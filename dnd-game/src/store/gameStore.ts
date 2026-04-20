import { create } from 'zustand';
import type {
  GameState, GameScreen, Character, World, GameMap,
  NarratorMessage, NpcTemplate, InventoryItem, Equipment,
  CombatState, Enemy, QuestEntry, Stats, CharacterAppearance,
} from '../types/game';
import { worlds, getWorldMaps, findItemById, findNpcById } from '../data/worlds';
import { rollD20, rollD6, attackRoll, calculateDamage, xpForLevel, generateId, skillCheck } from '../utils/dice';
import { narrateScene, npcDialogue, narrateCombat } from '../services/ai';

interface GameStore extends GameState {
  maps: Record<string, GameMap>;
  conversationHistory: string[];
  setScreen: (screen: GameScreen) => void;
  setApiKey: (key: string) => void;
  selectWorld: (worldId: string) => void;
  createCharacter: (name: string, raceId: string, classId: string, appearance: CharacterAppearance) => void;
  movePlayer: (dx: number, dy: number) => void;
  interactWithTile: () => void;
  addNarratorMessage: (msg: NarratorMessage) => void;
  startCombat: (enemy: Enemy) => void;
  playerAttack: () => void;
  playerDefend: () => void;
  playerFlee: () => void;
  useItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: keyof Equipment) => void;
  dropItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  buyItem: (itemId: string) => void;
  addItemToInventory: (itemId: string, quantity?: number) => void;
  talkToNpc: (message: string) => void;
  leaveDialogue: () => void;
  enterMap: (mapId: string) => void;
  rest: () => void;
  addQuest: (quest: QuestEntry) => void;
  completeQuest: (questId: string) => void;
  resetGame: () => void;
  gainXp: (amount: number) => void;
}

const initialCombat: CombatState = {
  active: false,
  enemy: null,
  playerTurn: true,
  log: [],
  round: 0,
};

const initialState: Omit<GameState, 'apiKey'> = {
  screen: 'menu',
  character: null,
  world: null,
  currentMap: null,
  playerPosition: { x: 0, y: 0 },
  narratorMessages: [],
  combat: initialCombat,
  currentNpc: null,
  visitedMaps: [],
  questLog: [],
  gameTime: 0,
  isLoading: false,
};

function createEnemy(npcTemplate: NpcTemplate | undefined, level: number): Enemy {
  const baseHp = 20 + level * 10;
  return {
    id: npcTemplate?.id || 'unknown_enemy',
    name: npcTemplate?.name || 'Gegner',
    icon: npcTemplate?.icon || '👾',
    level,
    hp: npcTemplate?.hp || baseHp,
    maxHp: npcTemplate?.hp || baseHp,
    stats: npcTemplate?.stats || { strength: 8 + level, dexterity: 8 + level, constitution: 8 + level, intelligence: 8, wisdom: 8, charisma: 6 },
    xpReward: level * 25,
    goldReward: level * 10 + rollD6() * 5,
    loot: ['health_potion'],
    abilities: ['Angriff'],
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  maps: {},
  conversationHistory: [],
  apiKey: localStorage.getItem('dnd_api_key') || '',

  setScreen: (screen) => set({ screen }),

  setApiKey: (key) => {
    localStorage.setItem('dnd_api_key', key);
    set({ apiKey: key });
  },

  selectWorld: (worldId) => {
    const world = worlds.find(w => w.id === worldId);
    if (!world) return;
    const maps = getWorldMaps(worldId);
    set({ world, maps, screen: 'character_create' });
  },

  createCharacter: (name, raceId, classId, appearance) => {
    const { world, maps } = get();
    if (!world) return;

    const race = world.races.find(r => r.id === raceId);
    const charClass = world.classes.find(c => c.id === classId);
    if (!race || !charClass) return;

    const baseStats: Stats = { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 };
    const stats: Stats = { ...baseStats };
    for (const [key, val] of Object.entries(race.bonuses)) {
      stats[key as keyof Stats] += val;
    }
    for (const [key, val] of Object.entries(charClass.bonuses)) {
      stats[key as keyof Stats] += val;
    }

    const maxHp = 20 + stats.constitution * 2;
    const maxMp = 10 + stats.intelligence * 2;

    const startingItems: InventoryItem[] = charClass.startingItems
      .map(itemId => {
        const item = findItemById(world.id, itemId);
        if (!item) return null;
        return { ...item, quantity: 1, instanceId: generateId() };
      })
      .filter((i): i is InventoryItem => i !== null);

    const character: Character = {
      name,
      worldId: world.id,
      raceId,
      classId,
      level: 1,
      xp: 0,
      xpToNext: xpForLevel(2),
      hp: maxHp,
      maxHp,
      mp: maxMp,
      maxMp,
      stats,
      inventory: startingItems,
      equipment: { weapon: null, armor: null, accessory: null },
      gold: 50,
      appearance,
      abilities: [...race.abilities, ...charClass.abilities],
    };

    const firstMapId = Object.keys(maps)[1] || Object.keys(maps)[0];
    const firstMap = maps[firstMapId];

    set({
      character,
      currentMap: firstMap,
      playerPosition: firstMap.playerStart,
      screen: 'game',
      visitedMaps: [firstMapId],
      narratorMessages: [{
        id: generateId(),
        text: `Willkommen in der Welt von ${world.name}, ${name}! Dein Abenteuer beginnt in ${firstMap.name}. Erkunde die Umgebung, sprich mit NPCs und entdecke Geheimnisse!`,
        type: 'system',
        timestamp: Date.now(),
      }],
    });

    const { apiKey } = get();
    narrateScene(apiKey, world, character, firstMap.name, 'Ankunft', `${name} betritt ${firstMap.name} zum ersten Mal.`).then(msg => {
      set(s => ({ narratorMessages: [...s.narratorMessages, msg] }));
    });
  },

  movePlayer: (dx, dy) => {
    const { playerPosition, currentMap, character, world, apiKey } = get();
    if (!currentMap || !character || !world) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX < 0 || newX >= currentMap.width || newY < 0 || newY >= currentMap.height) return;

    const tile = currentMap.tiles[newY][newX];
    if (!tile.walkable) return;

    set({ playerPosition: { x: newX, y: newY }, gameTime: get().gameTime + 1 });

    if (tile.type === 'enemy' && tile.enemyId) {
      const npc = findNpcById(world.id, tile.enemyId);
      const enemy = createEnemy(npc, character.level);
      get().startCombat(enemy);
    }
  },

  interactWithTile: () => {
    const { playerPosition, currentMap, character, world, apiKey, maps } = get();
    if (!currentMap || !character || !world) return;

    const tile = currentMap.tiles[playerPosition.y][playerPosition.x];
    if (!tile.interactable) return;

    if (tile.type === 'npc' && tile.npcId) {
      const npc = findNpcById(world.id, tile.npcId);
      if (npc) {
        set({ currentNpc: npc, screen: 'dialogue', conversationHistory: [] });
        narrateScene(apiKey, world, character, currentMap.name, `Begegnung mit ${npc.name}`, `${npc.personality}`).then(msg => {
          set(s => ({ narratorMessages: [...s.narratorMessages, msg] }));
        });
      }
    } else if (tile.type === 'chest' && tile.loot) {
      const lootMessages: string[] = [];
      for (const itemId of tile.loot) {
        get().addItemToInventory(itemId);
        const item = findItemById(world.id, itemId);
        if (item) lootMessages.push(item.name);
      }
      const goldFound = rollD6() * 10;
      set(s => ({
        character: s.character ? { ...s.character, gold: s.character.gold + goldFound } : null,
        narratorMessages: [...s.narratorMessages, {
          id: generateId(),
          text: `📦 Truhe geöffnet! Gefunden: ${lootMessages.join(', ')} und ${goldFound} Gold!`,
          type: 'loot' as const,
          timestamp: Date.now(),
        }],
      }));
      const newTiles = currentMap.tiles.map(row => row.map(t => t));
      newTiles[playerPosition.y][playerPosition.x] = { ...tile, type: 'floor', icon: '⬜', interactable: false, loot: undefined };
      set({ currentMap: { ...currentMap, tiles: newTiles } });
    } else if ((tile.type === 'exit' || tile.type === 'entrance' || tile.type === 'stairs_up' || tile.type === 'castle' || tile.type === 'building') && tile.destination) {
      const destMap = maps[tile.destination];
      if (destMap) {
        get().enterMap(tile.destination);
      }
    } else if (tile.type === 'shop' || tile.type === 'tavern') {
      const merchant = world.npcs.find(n => n.role === 'merchant');
      if (merchant) {
        set({ currentNpc: merchant, screen: 'shop', conversationHistory: [] });
      }
    } else if (tile.type === 'boss' && tile.enemyId) {
      const npc = findNpcById(world.id, tile.enemyId);
      const bossLevel = character.level + 3;
      const enemy = createEnemy(npc, bossLevel);
      enemy.name = npc?.name || 'Boss';
      enemy.xpReward *= 3;
      enemy.goldReward *= 3;
      get().startCombat(enemy);
    }
  },

  addNarratorMessage: (msg) => set(s => ({ narratorMessages: [...s.narratorMessages, msg] })),

  startCombat: (enemy) => {
    set({
      combat: { active: true, enemy, playerTurn: true, log: [`Kampf gegen ${enemy.name} beginnt!`], round: 1 },
      screen: 'combat',
    });
  },

  playerAttack: async () => {
    const { combat, character, world, apiKey } = get();
    if (!combat.active || !combat.enemy || !character || !world) return;

    const weaponDamage = character.equipment.weapon?.damage || 5;
    const result = attackRoll(character.stats.strength, combat.enemy.stats.dexterity);
    
    let log = [...combat.log];
    const enemy = { ...combat.enemy };

    if (result.hit) {
      const dmg = calculateDamage(weaponDamage, character.stats.strength, result.critical);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      const critText = result.critical ? ' **KRITISCHER TREFFER!**' : '';
      log.push(`⚔️ Du greifst an! Würfel: ${result.roll}${critText} — ${dmg} Schaden!`);

      if (enemy.hp <= 0) {
        log.push(`🎉 ${enemy.name} wurde besiegt! +${enemy.xpReward} XP, +${enemy.goldReward} Gold`);
        get().gainXp(enemy.xpReward);
        set(s => ({
          character: s.character ? { ...s.character, gold: s.character.gold + enemy.goldReward } : null,
          combat: { ...initialCombat, log },
          screen: 'game',
        }));

        if (enemy.loot.length > 0) {
          const lootItem = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];
          get().addItemToInventory(lootItem);
          const item = findItemById(world.id, lootItem);
          set(s => ({
            narratorMessages: [...s.narratorMessages, {
              id: generateId(),
              text: `⚔️ ${enemy.name} besiegt! +${enemy.xpReward} XP, +${enemy.goldReward} Gold. ${item ? `Beute: ${item.name}` : ''}`,
              type: 'combat' as const,
              timestamp: Date.now(),
            }],
          }));
        }
        return;
      }
    } else {
      log.push(`⚔️ Du greifst an! Würfel: ${result.roll} — Daneben!`);
    }

    const enemyResult = attackRoll(enemy.stats.strength, character.stats.dexterity);
    const updatedChar = { ...character };
    if (enemyResult.hit) {
      const enemyDmg = calculateDamage(5 + enemy.level, enemy.stats.strength, enemyResult.critical);
      updatedChar.hp = Math.max(0, updatedChar.hp - enemyDmg);
      log.push(`👹 ${enemy.name} greift an! ${enemyDmg} Schaden!`);

      if (updatedChar.hp <= 0) {
        log.push('💀 Du wurdest besiegt...');
        set({ character: updatedChar, combat: { ...combat, log, enemy }, screen: 'game_over' });
        return;
      }
    } else {
      log.push(`👹 ${enemy.name} greift an — Daneben!`);
    }

    set({
      character: updatedChar,
      combat: { ...combat, enemy, log, round: combat.round + 1 },
    });
  },

  playerDefend: () => {
    const { combat, character } = get();
    if (!combat.active || !combat.enemy || !character) return;

    const log = [...combat.log];
    const enemy = { ...combat.enemy };
    const updatedChar = { ...character };

    log.push('🛡️ Du gehst in Verteidigungshaltung!');

    const armorDef = updatedChar.equipment.armor?.defense || 0;
    const enemyResult = attackRoll(enemy.stats.strength, character.stats.dexterity + 4);
    if (enemyResult.hit) {
      const rawDmg = calculateDamage(5 + enemy.level, enemy.stats.strength, false);
      const reducedDmg = Math.max(1, rawDmg - armorDef - 3);
      updatedChar.hp = Math.max(0, updatedChar.hp - reducedDmg);
      log.push(`👹 ${enemy.name} greift an! Nur ${reducedDmg} Schaden (blockiert)!`);
    } else {
      log.push(`👹 ${enemy.name} greift an — Vollständig geblockt!`);
    }

    if (updatedChar.hp <= 0) {
      log.push('💀 Du wurdest besiegt...');
      set({ character: updatedChar, combat: { ...combat, log, enemy }, screen: 'game_over' });
      return;
    }

    set({ character: updatedChar, combat: { ...combat, enemy, log, round: combat.round + 1 } });
  },

  playerFlee: () => {
    const { combat, character } = get();
    if (!combat.active || !combat.enemy || !character) return;

    const check = skillCheck(character.stats.dexterity, 10 + combat.enemy.level);
    if (check.success) {
      set(s => ({
        combat: initialCombat,
        screen: 'game',
        narratorMessages: [...s.narratorMessages, {
          id: generateId(),
          text: `🏃 Du bist erfolgreich geflohen! (Würfel: ${check.roll}, Gesamt: ${check.total})`,
          type: 'combat' as const,
          timestamp: Date.now(),
        }],
      }));
    } else {
      const log = [...combat.log, `🏃 Flucht fehlgeschlagen! (Würfel: ${check.roll}, Gesamt: ${check.total})`];
      const enemy = { ...combat.enemy };
      const updatedChar = { ...character };
      const enemyResult = attackRoll(enemy.stats.strength, character.stats.dexterity);
      if (enemyResult.hit) {
        const dmg = calculateDamage(5 + enemy.level, enemy.stats.strength, false);
        updatedChar.hp = Math.max(0, updatedChar.hp - dmg);
        log.push(`👹 ${enemy.name} nutzt die Gelegenheit! ${dmg} Schaden!`);
      }
      if (updatedChar.hp <= 0) {
        log.push('💀 Du wurdest besiegt...');
        set({ character: updatedChar, combat: { ...combat, log, enemy }, screen: 'game_over' });
        return;
      }
      set({ character: updatedChar, combat: { ...combat, log, enemy, round: combat.round + 1 } });
    }
  },

  useItem: (instanceId) => {
    const { character } = get();
    if (!character) return;

    const itemIndex = character.inventory.findIndex(i => i.instanceId === instanceId);
    if (itemIndex === -1) return;

    const item = character.inventory[itemIndex];
    const updatedChar = { ...character };
    const newInventory = [...updatedChar.inventory];

    if (item.effects) {
      for (const effect of item.effects) {
        if (effect.type === 'heal') {
          if (item.type === 'potion' && item.id === 'mana_potion') {
            updatedChar.mp = Math.min(updatedChar.maxMp, updatedChar.mp + effect.amount);
          } else {
            updatedChar.hp = Math.min(updatedChar.maxHp, updatedChar.hp + effect.amount);
          }
        }
      }
    }

    if (item.quantity > 1) {
      newInventory[itemIndex] = { ...item, quantity: item.quantity - 1 };
    } else {
      newInventory.splice(itemIndex, 1);
    }
    updatedChar.inventory = newInventory;

    set(s => ({
      character: updatedChar,
      narratorMessages: [...s.narratorMessages, {
        id: generateId(),
        text: `🧪 ${item.name} benutzt!`,
        type: 'system' as const,
        timestamp: Date.now(),
      }],
    }));
  },

  equipItem: (instanceId) => {
    const { character } = get();
    if (!character) return;

    const item = character.inventory.find(i => i.instanceId === instanceId);
    if (!item) return;

    const slot: keyof Equipment | null =
      item.type === 'weapon' ? 'weapon' :
      item.type === 'armor' ? 'armor' :
      item.type === 'accessory' ? 'accessory' : null;
    if (!slot) return;

    const updatedChar = { ...character };
    const newInventory = [...updatedChar.inventory];
    const oldEquip = updatedChar.equipment[slot];

    if (oldEquip) {
      newInventory.push(oldEquip);
    }

    const itemIndex = newInventory.findIndex(i => i.instanceId === instanceId);
    const [equipped] = newInventory.splice(itemIndex, 1);

    updatedChar.equipment = { ...updatedChar.equipment, [slot]: equipped };
    updatedChar.inventory = newInventory;

    if (equipped.statBonus) {
      const newStats = { ...updatedChar.stats };
      for (const [key, val] of Object.entries(equipped.statBonus)) {
        newStats[key as keyof Stats] += val;
      }
      if (oldEquip?.statBonus) {
        for (const [key, val] of Object.entries(oldEquip.statBonus)) {
          newStats[key as keyof Stats] -= val;
        }
      }
      updatedChar.stats = newStats;
    }

    set({ character: updatedChar });
  },

  unequipItem: (slot) => {
    const { character } = get();
    if (!character || !character.equipment[slot]) return;

    const updatedChar = { ...character };
    const item = updatedChar.equipment[slot]!;
    updatedChar.inventory = [...updatedChar.inventory, item];
    updatedChar.equipment = { ...updatedChar.equipment, [slot]: null };

    if (item.statBonus) {
      const newStats = { ...updatedChar.stats };
      for (const [key, val] of Object.entries(item.statBonus)) {
        newStats[key as keyof Stats] -= val;
      }
      updatedChar.stats = newStats;
    }

    set({ character: updatedChar });
  },

  dropItem: (instanceId) => {
    const { character } = get();
    if (!character) return;

    set({
      character: {
        ...character,
        inventory: character.inventory.filter(i => i.instanceId !== instanceId),
      },
    });
  },

  sellItem: (instanceId) => {
    const { character } = get();
    if (!character) return;

    const item = character.inventory.find(i => i.instanceId === instanceId);
    if (!item) return;

    const sellPrice = Math.floor(item.value * 0.6);
    set({
      character: {
        ...character,
        gold: character.gold + sellPrice,
        inventory: character.inventory.filter(i => i.instanceId !== instanceId),
      },
    });
  },

  buyItem: (itemId) => {
    const { character, world } = get();
    if (!character || !world) return;

    const item = findItemById(world.id, itemId);
    if (!item || character.gold < item.value) return;

    const invItem: InventoryItem = { ...item, quantity: 1, instanceId: generateId() };
    set({
      character: {
        ...character,
        gold: character.gold - item.value,
        inventory: [...character.inventory, invItem],
      },
    });
  },

  addItemToInventory: (itemId, quantity = 1) => {
    const { character, world } = get();
    if (!character || !world) return;

    const item = findItemById(world.id, itemId);
    if (!item) return;

    const existing = character.inventory.find(i => i.id === itemId && (i.type === 'potion' || i.type === 'food' || i.type === 'material'));
    if (existing) {
      set({
        character: {
          ...character,
          inventory: character.inventory.map(i =>
            i.instanceId === existing.instanceId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        },
      });
    } else {
      const invItem: InventoryItem = { ...item, quantity, instanceId: generateId() };
      set({
        character: {
          ...character,
          inventory: [...character.inventory, invItem],
        },
      });
    }
  },

  talkToNpc: async (message) => {
    const { currentNpc, character, world, apiKey, conversationHistory } = get();
    if (!currentNpc || !character || !world) return;

    set({ isLoading: true });
    const history = [...conversationHistory, `Spieler: ${message}`];
    
    const response = await npcDialogue(apiKey, world, character, currentNpc, message, history);
    
    set(s => ({
      narratorMessages: [...s.narratorMessages, response],
      conversationHistory: [...history, response.text],
      isLoading: false,
    }));
  },

  leaveDialogue: () => {
    set({ currentNpc: null, screen: 'game', conversationHistory: [] });
  },

  enterMap: (mapId) => {
    const { maps, character, world, apiKey, visitedMaps } = get();
    const map = maps[mapId];
    if (!map || !character || !world) return;

    set({
      currentMap: map,
      playerPosition: map.playerStart,
      visitedMaps: visitedMaps.includes(mapId) ? visitedMaps : [...visitedMaps, mapId],
      screen: 'game',
    });

    narrateScene(apiKey, world, character, map.name, `Betritt ${map.type}`, `${character.name} betritt ${map.name}`).then(msg => {
      set(s => ({ narratorMessages: [...s.narratorMessages, msg] }));
    });
  },

  rest: () => {
    const { character } = get();
    if (!character) return;

    set(s => ({
      character: character ? {
        ...character,
        hp: character.maxHp,
        mp: character.maxMp,
      } : null,
      narratorMessages: [...s.narratorMessages, {
        id: generateId(),
        text: '💤 Du ruhst dich aus. HP und MP vollständig wiederhergestellt!',
        type: 'system' as const,
        timestamp: Date.now(),
      }],
    }));
  },

  addQuest: (quest) => {
    set(s => ({ questLog: [...s.questLog, quest] }));
  },

  completeQuest: (questId) => {
    const { questLog, character } = get();
    if (!character) return;

    const quest = questLog.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    get().gainXp(quest.reward.xp);
    set(s => ({
      character: s.character ? { ...s.character, gold: s.character.gold + quest.reward.gold } : null,
      questLog: s.questLog.map(q => q.id === questId ? { ...q, completed: true } : q),
      narratorMessages: [...s.narratorMessages, {
        id: generateId(),
        text: `🎯 Quest abgeschlossen: "${quest.title}"! +${quest.reward.xp} XP, +${quest.reward.gold} Gold`,
        type: 'system' as const,
        timestamp: Date.now(),
      }],
    }));
  },

  resetGame: () => {
    set({ ...initialState, apiKey: get().apiKey, maps: {} });
  },

  gainXp: (amount) => {
    const { character } = get();
    if (!character) return;

    let newXp = character.xp + amount;
    let newLevel = character.level;
    let newXpToNext = character.xpToNext;

    while (newXp >= newXpToNext) {
      newXp -= newXpToNext;
      newLevel++;
      newXpToNext = xpForLevel(newLevel + 1);

      set(s => ({
        narratorMessages: [...s.narratorMessages, {
          id: generateId(),
          text: `⬆️ LEVEL UP! Du bist jetzt Stufe ${newLevel}!`,
          type: 'levelup' as const,
          timestamp: Date.now(),
        }],
      }));
    }

    const hpGain = newLevel > character.level ? (newLevel - character.level) * 5 : 0;
    const mpGain = newLevel > character.level ? (newLevel - character.level) * 3 : 0;

    set({
      character: {
        ...character,
        xp: newXp,
        level: newLevel,
        xpToNext: newXpToNext,
        maxHp: character.maxHp + hpGain,
        hp: Math.min(character.hp + hpGain, character.maxHp + hpGain),
        maxMp: character.maxMp + mpGain,
        mp: Math.min(character.mp + mpGain, character.maxMp + mpGain),
      },
    });
  },
}));
