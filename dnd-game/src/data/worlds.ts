import type { World, GameMap, NpcTemplate, Item } from '../types/game';

const commonItems: Item[] = [
  { id: 'health_potion', name: 'Heiltrank', icon: '🧪', type: 'potion', description: 'Heilt 30 HP', value: 25, rarity: 'common', effects: [{ type: 'heal', amount: 30 }] },
  { id: 'mana_potion', name: 'Manatrank', icon: '💧', type: 'potion', description: 'Stellt 20 MP wieder her', value: 30, rarity: 'common', effects: [{ type: 'heal', amount: 20 }] },
  { id: 'bread', name: 'Brot', icon: '🍞', type: 'food', description: 'Heilt 10 HP', value: 5, rarity: 'common', effects: [{ type: 'heal', amount: 10 }] },
  { id: 'iron_sword', name: 'Eisenschwert', icon: '⚔️', type: 'weapon', description: 'Ein solides Schwert', value: 50, rarity: 'common', damage: 8 },
  { id: 'leather_armor', name: 'Lederrüstung', icon: '🛡️', type: 'armor', description: 'Leichte Rüstung', value: 40, rarity: 'common', defense: 5 },
  { id: 'gold_ring', name: 'Goldring', icon: '💍', type: 'accessory', description: '+2 Charisma', value: 100, rarity: 'uncommon', statBonus: { charisma: 2 } },
  { id: 'fire_scroll', name: 'Feuerrolle', icon: '📜', type: 'scroll', description: 'Wirkt Feuerball (40 Schaden)', value: 75, rarity: 'rare', effects: [{ type: 'damage', amount: 40 }] },
  { id: 'strength_elixir', name: 'Stärke-Elixier', icon: '💪', type: 'potion', description: '+3 Stärke für 3 Runden', value: 60, rarity: 'uncommon', effects: [{ type: 'buff', stat: 'strength', amount: 3, duration: 3 }] },
];

function createCityMap(id: string, name: string, npcPositions: Array<{x: number; y: number; npcId: string}>): GameMap {
  const width = 15;
  const height = 12;
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        return { type: 'wall' as const, walkable: false, icon: '🧱', interactable: false };
      }
      if ((y === 2 || y === 5 || y === 8) && x > 1 && x < width - 2 && x !== 7) {
        return { type: 'road' as const, walkable: true, icon: '🟫', interactable: false };
      }
      if (x === 7 && y > 0 && y < height - 1) {
        return { type: 'road' as const, walkable: true, icon: '🟫', interactable: false };
      }
      if ((x === 3 && y === 1) || (x === 11 && y === 1)) {
        return { type: 'shop' as const, walkable: true, icon: '🏪', interactable: true, description: 'Ein Laden' };
      }
      if (x === 7 && y === 1) {
        return { type: 'tavern' as const, walkable: true, icon: '🍺', interactable: true, description: 'Eine Taverne' };
      }
      if ((x === 3 && y === 6) || (x === 11 && y === 6)) {
        return { type: 'building' as const, walkable: true, icon: '🏠', interactable: true, description: 'Ein Haus' };
      }
      if (x === 7 && y === height - 1) {
        return { type: 'exit' as const, walkable: true, icon: '🚪', interactable: true, description: 'Ausgang zur Welt', destination: id.replace('_city', '_world') };
      }
      const npc = npcPositions.find(n => n.x === x && n.y === y);
      if (npc) {
        return { type: 'npc' as const, walkable: true, icon: '🧑', interactable: true, npcId: npc.npcId };
      }
      return { type: 'floor' as const, walkable: true, icon: '⬜', interactable: false };
    })
  );
  return { id, name, type: 'city', width, height, tiles, playerStart: { x: 7, y: 6 }, connections: [] };
}

function createWorldMap(id: string, name: string, features: Array<{x: number; y: number; type: string; icon: string; dest?: string; label?: string}>): GameMap {
  const width = 20;
  const height = 15;
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const feature = features.find(f => f.x === x && f.y === y);
      if (feature) {
        return {
          type: feature.type as any,
          walkable: true,
          icon: feature.icon,
          interactable: !!feature.dest,
          destination: feature.dest,
          description: feature.label,
        };
      }
      if (y === 0 || y === height - 1) return { type: 'water' as const, walkable: false, icon: '🌊', interactable: false };
      if (x === 0 || x === width - 1) return { type: 'water' as const, walkable: false, icon: '🌊', interactable: false };
      const rand = (x * 7 + y * 13) % 10;
      if (rand < 2) return { type: 'forest' as const, walkable: true, icon: '🌲', interactable: false };
      if (rand === 2) return { type: 'mountain' as const, walkable: false, icon: '⛰️', interactable: false };
      if (rand === 3) return { type: 'water' as const, walkable: false, icon: '🌊', interactable: false };
      return { type: 'grass' as const, walkable: true, icon: '🟩', interactable: false };
    })
  );
  return { id, name, type: 'world', width, height, tiles, playerStart: { x: 10, y: 7 }, connections: [] };
}

function createDungeonMap(id: string, name: string): GameMap {
  const width = 12;
  const height = 10;
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        return { type: 'wall' as const, walkable: false, icon: '⬛', interactable: false };
      }
      if ((x * 3 + y * 5) % 7 === 0 && x > 1 && y > 1 && x < width - 2 && y < height - 2) {
        return { type: 'wall' as const, walkable: false, icon: '⬛', interactable: false };
      }
      if (x === width - 2 && y === 1) {
        return { type: 'chest' as const, walkable: true, icon: '📦', interactable: true, description: 'Eine Truhe!', loot: ['health_potion', 'gold_ring'] };
      }
      if (x === width - 2 && y === height - 2) {
        return { type: 'boss' as const, walkable: true, icon: '👹', interactable: true, description: 'Ein mächtiger Gegner!', enemyId: 'dungeon_boss' };
      }
      if (x === 1 && y === height - 2) {
        return { type: 'stairs_up' as const, walkable: true, icon: '🪜', interactable: true, description: 'Zurück nach oben' };
      }
      if ((x + y) % 5 === 0 && x > 2 && y > 2) {
        return { type: 'enemy' as const, walkable: true, icon: '👾', interactable: true, enemyId: 'dungeon_mob' };
      }
      return { type: 'floor' as const, walkable: true, icon: '⬜', interactable: false };
    })
  );
  return { id, name, type: 'dungeon', width, height, tiles, playerStart: { x: 1, y: 1 }, connections: [] };
}

export const worlds: World[] = [
  {
    id: 'onepiece',
    name: 'One Piece',
    description: 'Segle die Grand Line, finde das One Piece und werde König der Piraten! Begegne Teufelsfrüchten, Marineofffizieren und legendären Piraten.',
    icon: '🏴‍☠️',
    color: '#e53935',
    lore: 'In einer Welt voller Ozeane und Inseln suchen Piraten nach dem legendären Schatz "One Piece". Teufelsfrüchte verleihen übernatürliche Kräfte, aber dafür kann man nie wieder schwimmen.',
    races: [
      { id: 'human_op', name: 'Mensch', icon: '🧑', description: 'Vielseitig und anpassungsfähig', bonuses: { charisma: 1, strength: 1 }, abilities: ['Haki-Potential'] },
      { id: 'fishman', name: 'Fischmenschen', icon: '🐟', description: 'Stark im Wasser, 10x menschliche Kraft', bonuses: { strength: 3, constitution: 1 }, abilities: ['Unterwasser-Atem', 'Fischmenschen-Karate'] },
      { id: 'giant', name: 'Riese', icon: '🗿', description: 'Enorm stark und groß', bonuses: { strength: 4, constitution: 3 }, abilities: ['Riesenschlag', 'Erdbeben'] },
      { id: 'mink', name: 'Mink', icon: '🐾', description: 'Tiermensch mit Elektrokräften', bonuses: { dexterity: 2, strength: 1 }, abilities: ['Electro', 'Mondform'] },
      { id: 'skypian', name: 'Himmelsbewohner', icon: '☁️', description: 'Bewohner der Himmelsinseln', bonuses: { wisdom: 2, dexterity: 1 }, abilities: ['Mantra', 'Dial-Nutzung'] },
    ],
    classes: [
      { id: 'pirate', name: 'Pirat', icon: '🏴‍☠️', description: 'Freiheit auf den Meeren', bonuses: { strength: 2, charisma: 1 }, abilities: ['Schwertkunst', 'Navigation'], startingItems: ['iron_sword', 'bread'] },
      { id: 'marine', name: 'Marine', icon: '⚓', description: 'Gerechtigkeit auf den Meeren', bonuses: { strength: 1, constitution: 2 }, abilities: ['Rokushiki', 'Autorität'], startingItems: ['iron_sword', 'leather_armor'] },
      { id: 'revolutionary', name: 'Revolutionär', icon: '✊', description: 'Kämpfe gegen die Weltregierung', bonuses: { intelligence: 2, dexterity: 1 }, abilities: ['Guerilla-Taktik', 'Verkleidung'], startingItems: ['health_potion', 'fire_scroll'] },
      { id: 'bounty_hunter', name: 'Kopfgeldjäger', icon: '💰', description: 'Jage Verbrecher für Belohnung', bonuses: { dexterity: 2, wisdom: 1 }, abilities: ['Spurenlesen', 'Fesseltechnik'], startingItems: ['iron_sword', 'strength_elixir'] },
    ],
    locations: [
      { mapId: 'op_world', name: 'Grand Line', type: 'world', description: 'Der gefährlichste Ozean der Welt' },
      { mapId: 'op_city', name: 'Loguetown', type: 'city', description: 'Stadt des Anfangs und des Endes' },
      { mapId: 'op_dungeon', name: 'Impel Down', type: 'dungeon', description: 'Das berüchtigte Unterwasser-Gefängnis' },
    ],
    items: [
      ...commonItems,
      { id: 'devil_fruit', name: 'Teufelsfrucht', icon: '🍇', type: 'potion', description: 'Verleiht eine übernatürliche Kraft!', value: 500, rarity: 'legendary', effects: [{ type: 'buff', stat: 'strength', amount: 5, duration: 99 }] },
      { id: 'straw_hat', name: 'Strohhut', icon: '🎩', type: 'accessory', description: 'Ein berühmter Strohhut', value: 1000, rarity: 'legendary', statBonus: { charisma: 5, wisdom: 3 } },
      { id: 'seastone_cuffs', name: 'Seestein-Fesseln', icon: '⛓️', type: 'weapon', description: 'Neutralisiert Teufelsfrucht-Kräfte', value: 200, rarity: 'epic', damage: 15 },
    ],
    npcs: [
      { id: 'op_merchant', name: 'Händler Buggy', icon: '🤡', race: 'Mensch', class: 'Pirat', role: 'merchant', personality: 'Gierig, prahlerisch, feige aber listig. Redet immer über seine Größe als Pirat.', backstory: 'Ein ehemaliger Pirat der Roger-Piraten, jetzt Händler.', level: 5, hp: 40, stats: { strength: 6, dexterity: 8, constitution: 5, intelligence: 7, wisdom: 4, charisma: 8 }, shopItems: ['health_potion', 'iron_sword', 'leather_armor'] },
      { id: 'op_quest', name: 'Nami', icon: '🗺️', race: 'Mensch', class: 'Navigator', role: 'questgiver', personality: 'Clever, geldgierig, aber loyal zu Freunden. Liebt Karten und Schätze.', backstory: 'Eine talentierte Navigatorin mit einem Traum, eine Weltkarte zu zeichnen.', level: 8, hp: 35, stats: { strength: 4, dexterity: 9, constitution: 5, intelligence: 10, wisdom: 8, charisma: 7 } },
      { id: 'op_guard', name: 'Kapitän Smoker', icon: '🚬', race: 'Mensch', class: 'Marine', role: 'guard', personality: 'Streng, gerecht, raucht ständig. Hasst Piraten aber respektiert Stärke.', backstory: 'Ein Marine-Kapitän, der Loguetown bewacht.', level: 15, hp: 80, stats: { strength: 12, dexterity: 10, constitution: 11, intelligence: 8, wisdom: 9, charisma: 6 } },
    ],
  },
  {
    id: 'marvel',
    name: 'Marvel Universe',
    description: 'Werde ein Superheld oder Schurke im Marvel-Universum! Mutanten, kosmische Mächte und epische Schlachten erwarten dich.',
    icon: '🦸',
    color: '#1565c0',
    lore: 'In einer Welt voller Superhelden und Schurken kämpfen verschiedene Fraktionen um Macht und Gerechtigkeit. Mutanten, Inhumans und kosmische Wesen ringen um das Schicksal der Erde.',
    races: [
      { id: 'human_mv', name: 'Mensch', icon: '🧑', description: 'Normaler Mensch mit Potential', bonuses: { intelligence: 1, charisma: 1 }, abilities: ['Anpassungsfähig'] },
      { id: 'mutant', name: 'Mutant', icon: '🧬', description: 'Geboren mit dem X-Gen', bonuses: { constitution: 1, wisdom: 2 }, abilities: ['Mutation', 'X-Gen-Aktivierung'] },
      { id: 'inhuman', name: 'Inhuman', icon: '💎', description: 'Durch Terrigen-Nebel verwandelt', bonuses: { strength: 2, constitution: 1 }, abilities: ['Terrigenese', 'Elementarkraft'] },
      { id: 'asgardian', name: 'Asgardier', icon: '⚡', description: 'Göttliches Volk aus Asgard', bonuses: { strength: 3, constitution: 2 }, abilities: ['Göttliche Ausdauer', 'Allsprech'] },
      { id: 'alien_mv', name: 'Alien (Skrull)', icon: '👽', description: 'Gestaltwandler aus dem Weltraum', bonuses: { dexterity: 2, charisma: 2 }, abilities: ['Gestaltwandlung', 'Infiltration'] },
    ],
    classes: [
      { id: 'hero', name: 'Superheld', icon: '🦸', description: 'Beschütze die Unschuldigen', bonuses: { strength: 2, charisma: 1 }, abilities: ['Heldenmut', 'Rettung'], startingItems: ['leather_armor', 'health_potion'] },
      { id: 'villain', name: 'Superschurke', icon: '🦹', description: 'Erobere die Welt', bonuses: { intelligence: 2, strength: 1 }, abilities: ['Intrige', 'Angst'], startingItems: ['fire_scroll', 'strength_elixir'] },
      { id: 'scientist', name: 'Wissenschaftler', icon: '🔬', description: 'Technologie ist deine Waffe', bonuses: { intelligence: 3 }, abilities: ['Erfindung', 'Analyse'], startingItems: ['health_potion', 'mana_potion'] },
      { id: 'spy', name: 'Agent/Spion', icon: '🕵️', description: 'S.H.I.E.L.D. oder HYDRA', bonuses: { dexterity: 2, intelligence: 1 }, abilities: ['Tarnung', 'Nahkampf'], startingItems: ['iron_sword', 'health_potion'] },
    ],
    locations: [
      { mapId: 'mv_world', name: 'Erde-616', type: 'world', description: 'Die Hauptdimension des Marvel-Universums' },
      { mapId: 'mv_city', name: 'New York City', type: 'city', description: 'Zentrum der Superhelden-Aktivität' },
      { mapId: 'mv_dungeon', name: 'HYDRA-Basis', type: 'dungeon', description: 'Geheime Untergrundbasis von HYDRA' },
    ],
    items: [
      ...commonItems,
      { id: 'vibranium_shield', name: 'Vibranium-Schild', icon: '🛡️', type: 'armor', description: 'Nahezu unzerstörbar', value: 800, rarity: 'legendary', defense: 20 },
      { id: 'arc_reactor', name: 'Arc-Reaktor', icon: '💙', type: 'accessory', description: 'Unendliche Energie', value: 600, rarity: 'epic', statBonus: { intelligence: 4, constitution: 3 } },
      { id: 'web_shooters', name: 'Netzwerfer', icon: '🕸️', type: 'weapon', description: 'Verschießt Spinnweben', value: 300, rarity: 'rare', damage: 12 },
    ],
    npcs: [
      { id: 'mv_merchant', name: 'Tony Stark', icon: '🤖', race: 'Mensch', class: 'Wissenschaftler', role: 'merchant', personality: 'Arrogant, witzig, genial. Macht ständig sarkastische Kommentare.', backstory: 'Milliardär, Genie, Playboy, Philanthrop. Verkauft Technologie.', level: 20, hp: 100, stats: { strength: 8, dexterity: 7, constitution: 8, intelligence: 18, wisdom: 10, charisma: 14 }, shopItems: ['health_potion', 'arc_reactor', 'web_shooters'] },
      { id: 'mv_quest', name: 'Nick Fury', icon: '🕵️', race: 'Mensch', class: 'Agent', role: 'questgiver', personality: 'Streng, geheimnisvoll, immer einen Plan voraus.', backstory: 'Direktor von S.H.I.E.L.D., koordiniert die Avengers.', level: 15, hp: 70, stats: { strength: 9, dexterity: 10, constitution: 9, intelligence: 14, wisdom: 15, charisma: 12 } },
      { id: 'mv_guard', name: 'Captain America', icon: '🇺🇸', race: 'Mensch', class: 'Superheld', role: 'guard', personality: 'Noble, mutig, leicht altmodisch. Hält immer inspirende Reden.', backstory: 'Super-Soldat aus dem Zweiten Weltkrieg, Symbol der Freiheit.', level: 18, hp: 120, stats: { strength: 15, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 13, charisma: 16 } },
    ],
  },
  {
    id: 'fantasy',
    name: 'Klassische Fantasy',
    description: 'Klassisches DnD-Abenteuer mit Elfen, Zwergen und Drachen. Erkunde Dungeons, besiege Monster und werde ein Held der Legenden!',
    icon: '🐉',
    color: '#2e7d32',
    lore: 'In den Reichen von Eldoria existieren uralte Magie, mächtige Drachen und vergessene Ruinen. Verschiedene Völker leben zusammen, mal in Frieden, mal im Krieg.',
    races: [
      { id: 'human_f', name: 'Mensch', icon: '🧑', description: 'Vielseitig und ehrgeizig', bonuses: { charisma: 1, intelligence: 1 }, abilities: ['Bonus-Talent'] },
      { id: 'elf', name: 'Elf', icon: '🧝', description: 'Langlebig und magisch begabt', bonuses: { dexterity: 2, wisdom: 1 }, abilities: ['Dunkelsicht', 'Fey-Ahne'] },
      { id: 'dwarf', name: 'Zwerg', icon: '⛏️', description: 'Hart wie Stein, Meister der Schmiedekunst', bonuses: { constitution: 2, strength: 1 }, abilities: ['Giftresistenz', 'Steinkunde'] },
      { id: 'halfling', name: 'Halbling', icon: '🍀', description: 'Klein, flink und glücklich', bonuses: { dexterity: 2, charisma: 1 }, abilities: ['Glückspilz', 'Mutig'] },
      { id: 'orc', name: 'Ork', icon: '👹', description: 'Stark und furchtlos', bonuses: { strength: 3, constitution: 1 }, abilities: ['Wutanfall', 'Einschüchterung'] },
      { id: 'dragonborn', name: 'Drachenblut', icon: '🐲', description: 'Nachfahre der Drachen', bonuses: { strength: 2, charisma: 1 }, abilities: ['Drachenodem', 'Elementarresistenz'] },
    ],
    classes: [
      { id: 'warrior', name: 'Krieger', icon: '⚔️', description: 'Meister der Waffen', bonuses: { strength: 2, constitution: 1 }, abilities: ['Mehrfachangriff', 'Verteidigung'], startingItems: ['iron_sword', 'leather_armor'] },
      { id: 'mage', name: 'Magier', icon: '🧙', description: 'Beherrscht arkane Magie', bonuses: { intelligence: 3 }, abilities: ['Feuerball', 'Magischer Schild'], startingItems: ['fire_scroll', 'mana_potion'] },
      { id: 'rogue', name: 'Schurke', icon: '🗡️', description: 'Meister der Schatten', bonuses: { dexterity: 2, intelligence: 1 }, abilities: ['Hinterhalt', 'Schlösser knacken'], startingItems: ['iron_sword', 'health_potion'] },
      { id: 'cleric', name: 'Kleriker', icon: '✝️', description: 'Göttliche Magie und Heilung', bonuses: { wisdom: 2, constitution: 1 }, abilities: ['Heilung', 'Untote vertreiben'], startingItems: ['health_potion', 'leather_armor'] },
      { id: 'ranger', name: 'Waldläufer', icon: '🏹', description: 'Hüter der Wildnis', bonuses: { dexterity: 2, wisdom: 1 }, abilities: ['Tierbegleiter', 'Fährtenlesen'], startingItems: ['iron_sword', 'bread'] },
    ],
    locations: [
      { mapId: 'f_world', name: 'Eldoria', type: 'world', description: 'Ein magisches Königreich' },
      { mapId: 'f_city', name: 'Sturmhafen', type: 'city', description: 'Die Hauptstadt des Königreichs' },
      { mapId: 'f_dungeon', name: 'Katakomben von Morag', type: 'dungeon', description: 'Uralte Grüfte voller Undead' },
    ],
    items: [
      ...commonItems,
      { id: 'dragon_sword', name: 'Drachentöter', icon: '🗡️', type: 'weapon', description: 'Geschmiedet im Drachenfeuer', value: 1000, rarity: 'legendary', damage: 25 },
      { id: 'mithril_armor', name: 'Mithril-Rüstung', icon: '🛡️', type: 'armor', description: 'Leicht wie eine Feder, hart wie Stahl', value: 800, rarity: 'epic', defense: 15 },
      { id: 'wizard_staff', name: 'Zauberstab des Erzmagiers', icon: '🪄', type: 'weapon', description: '+5 Intelligenz, verstärkt Zauber', value: 600, rarity: 'epic', damage: 10, statBonus: { intelligence: 5 } },
    ],
    npcs: [
      { id: 'f_merchant', name: 'Thorin Hammerfaust', icon: '⛏️', race: 'Zwerg', class: 'Schmied', role: 'merchant', personality: 'Grummelig, ehrlich, stolz auf seine Arbeit. Trinkt gerne Bier.', backstory: 'Der beste Schmied in Sturmhafen, seit 200 Jahren im Geschäft.', level: 10, hp: 60, stats: { strength: 12, dexterity: 6, constitution: 14, intelligence: 8, wisdom: 10, charisma: 6 }, shopItems: ['iron_sword', 'leather_armor', 'mithril_armor'] },
      { id: 'f_quest', name: 'Elara Mondschein', icon: '🧝', race: 'Elf', class: 'Magierin', role: 'questgiver', personality: 'Weise, ruhig, spricht in Rätseln. Sieht mehr als sie verrät.', backstory: 'Eine uralte Elfenmagierin, die die Katakomben erforscht.', level: 12, hp: 50, stats: { strength: 5, dexterity: 8, constitution: 6, intelligence: 16, wisdom: 15, charisma: 11 } },
      { id: 'f_guard', name: 'Ser Roland', icon: '🛡️', race: 'Mensch', class: 'Krieger', role: 'guard', personality: 'Ehrenhaft, pflichtbewusst, etwas humorlos.', backstory: 'Hauptmann der Stadtwache von Sturmhafen.', level: 10, hp: 80, stats: { strength: 14, dexterity: 8, constitution: 12, intelligence: 7, wisdom: 10, charisma: 9 } },
    ],
  },
  {
    id: 'starwars',
    name: 'Star Wars',
    description: 'In einer weit, weit entfernten Galaxis... Wähle die helle oder dunkle Seite der Macht und kämpfe um das Schicksal der Galaxis!',
    icon: '⭐',
    color: '#ffd700',
    lore: 'Die Galaxis wird vom Imperium beherrscht. Die Rebellenallianz kämpft für Freiheit. Die Macht durchströmt alles und wird von Jedi und Sith gleichermaßen genutzt.',
    races: [
      { id: 'human_sw', name: 'Mensch', icon: '🧑', description: 'Die häufigste Spezies der Galaxis', bonuses: { charisma: 1, intelligence: 1 }, abilities: ['Anpassungsfähig'] },
      { id: 'wookiee', name: 'Wookiee', icon: '🦧', description: 'Riesige, pelzige Krieger von Kashyyyk', bonuses: { strength: 3, constitution: 1 }, abilities: ['Wookiee-Wut', 'Mechaniker'] },
      { id: 'twilek', name: "Twi'lek", icon: '👤', description: 'Charismatische Bewohner von Ryloth', bonuses: { charisma: 2, dexterity: 1 }, abilities: ['Überzeugung', 'Lekku-Kommunikation'] },
      { id: 'togruta', name: 'Togruta', icon: '🎭', description: 'Jäger mit natürlichem Echolot', bonuses: { wisdom: 2, dexterity: 1 }, abilities: ['Räumlicher Sinn', 'Rudeltaktik'] },
      { id: 'mandalorian', name: 'Mandalorianer', icon: '🪖', description: 'Kriegerkultur in Beskar-Rüstung', bonuses: { strength: 1, constitution: 2, dexterity: 1 }, abilities: ['Beskar-Rüstung', 'Jetpack'] },
    ],
    classes: [
      { id: 'jedi', name: 'Jedi', icon: '🟢', description: 'Hüter des Friedens und der Macht', bonuses: { wisdom: 2, dexterity: 1 }, abilities: ['Lichtschwert', 'Machtschub'], startingItems: ['iron_sword', 'health_potion'] },
      { id: 'sith', name: 'Sith', icon: '🔴', description: 'Meister der dunklen Seite', bonuses: { strength: 2, intelligence: 1 }, abilities: ['Machtblitz', 'Machtwürgen'], startingItems: ['iron_sword', 'fire_scroll'] },
      { id: 'smuggler', name: 'Schmuggler', icon: '🚀', description: 'Schneller als der Kessel-Run', bonuses: { dexterity: 2, charisma: 1 }, abilities: ['Schnellziehen', 'Verhandlung'], startingItems: ['iron_sword', 'bread'] },
      { id: 'bounty_hunter_sw', name: 'Kopfgeldjäger', icon: '🎯', description: 'Die Beute ist alles', bonuses: { dexterity: 2, constitution: 1 }, abilities: ['Spurenlesen', 'Gadgets'], startingItems: ['iron_sword', 'strength_elixir'] },
    ],
    locations: [
      { mapId: 'sw_world', name: 'Galaxis', type: 'world', description: 'Die weite Galaxis erkunden' },
      { mapId: 'sw_city', name: 'Mos Eisley', type: 'city', description: 'Raumhafen auf Tatooine' },
      { mapId: 'sw_dungeon', name: 'Imperialer Stützpunkt', type: 'dungeon', description: 'Eine Basis des Imperiums' },
    ],
    items: [
      ...commonItems,
      { id: 'lightsaber', name: 'Lichtschwert', icon: '🔦', type: 'weapon', description: 'Die elegante Waffe einer zivilisierten Zeit', value: 900, rarity: 'legendary', damage: 22 },
      { id: 'beskar_armor', name: 'Beskar-Rüstung', icon: '🪖', type: 'armor', description: 'Nahezu unzerstörbar', value: 700, rarity: 'epic', defense: 18 },
      { id: 'holocron', name: 'Holocron', icon: '🔮', type: 'accessory', description: 'Uraltes Machtwissen', value: 500, rarity: 'epic', statBonus: { wisdom: 4, intelligence: 3 } },
    ],
    npcs: [
      { id: 'sw_merchant', name: 'Watto', icon: '🪰', race: 'Toydarianer', class: 'Händler', role: 'merchant', personality: 'Gierig, listig, lässt sich nicht von Jedi-Tricks beeindrucken.', backstory: 'Ein fliegender Schrotthändler auf Tatooine.', level: 6, hp: 30, stats: { strength: 4, dexterity: 7, constitution: 5, intelligence: 9, wisdom: 8, charisma: 6 }, shopItems: ['health_potion', 'iron_sword', 'lightsaber'] },
      { id: 'sw_quest', name: 'Yoda', icon: '🟢', race: 'Unbekannt', class: 'Jedi-Meister', role: 'questgiver', personality: 'Weise, spricht in umgekehrter Satzstellung. Testet immer die Würdigkeit.', backstory: 'Der älteste und mächtigste Jedi-Meister.', level: 25, hp: 60, stats: { strength: 6, dexterity: 12, constitution: 8, intelligence: 18, wisdom: 20, charisma: 14 } },
      { id: 'sw_guard', name: 'Sturmtruppler', icon: '🪖', race: 'Mensch', class: 'Soldat', role: 'guard', personality: 'Loyal zum Imperium, nicht besonders clever. Trifft nie.', backstory: 'Ein Soldat des Galaktischen Imperiums.', level: 3, hp: 25, stats: { strength: 8, dexterity: 4, constitution: 7, intelligence: 5, wisdom: 4, charisma: 3 } },
    ],
  },
  {
    id: 'harrypotter',
    name: 'Harry Potter',
    description: 'Besuche Hogwarts, lerne Zaubersprüche und kämpfe gegen die dunklen Künste! Dein Zauberstab wartet auf dich.',
    icon: '🪄',
    color: '#6a0dad',
    lore: 'Die magische Welt existiert verborgen vor den Muggeln. Hogwarts ist die berühmteste Schule für Hexerei und Zauberei. Dunkle Mächte bedrohen den Frieden.',
    races: [
      { id: 'wizard', name: 'Reinblut-Zauberer', icon: '🧙', description: 'Magische Familie seit Generationen', bonuses: { intelligence: 2, wisdom: 1 }, abilities: ['Reinblut-Erbe', 'Alte Magie'] },
      { id: 'halfblood', name: 'Halbblut', icon: '🧑', description: 'Ein Muggle- und ein Zauberer-Elternteil', bonuses: { intelligence: 1, charisma: 1, wisdom: 1 }, abilities: ['Beide Welten', 'Anpassungsfähig'] },
      { id: 'muggleborn', name: 'Muggelstämmig', icon: '✨', description: 'Erste Generation Zauberer', bonuses: { charisma: 2, constitution: 1 }, abilities: ['Muggle-Wissen', 'Entschlossenheit'] },
      { id: 'goblin', name: 'Kobold', icon: '🏦', description: 'Meister der Finanzen und Schmiedekunst', bonuses: { intelligence: 2, dexterity: 1 }, abilities: ['Kobold-Magie', 'Schätze spüren'] },
      { id: 'house_elf', name: 'Hauself', icon: '🧦', description: 'Kleine, mächtige magische Wesen', bonuses: { dexterity: 2, wisdom: 2 }, abilities: ['Elfenmagie', 'Apparieren'] },
    ],
    classes: [
      { id: 'gryffindor', name: 'Gryffindor', icon: '🦁', description: 'Mutig und tapfer', bonuses: { strength: 2, charisma: 1 }, abilities: ['Mut', 'Schwertkunst'], startingItems: ['iron_sword', 'health_potion'] },
      { id: 'slytherin', name: 'Slytherin', icon: '🐍', description: 'Ehrgeizig und listig', bonuses: { intelligence: 2, charisma: 1 }, abilities: ['Parselmund', 'Tränkekunst'], startingItems: ['fire_scroll', 'mana_potion'] },
      { id: 'ravenclaw', name: 'Ravenclaw', icon: '🦅', description: 'Weise und kreativ', bonuses: { intelligence: 2, wisdom: 1 }, abilities: ['Brillanz', 'Rätsel lösen'], startingItems: ['mana_potion', 'fire_scroll'] },
      { id: 'hufflepuff', name: 'Hufflepuff', icon: '🦡', description: 'Loyal und fleißig', bonuses: { constitution: 2, wisdom: 1 }, abilities: ['Kräuterkunde', 'Loyalität'], startingItems: ['health_potion', 'bread'] },
    ],
    locations: [
      { mapId: 'hp_world', name: 'Magische Welt', type: 'world', description: 'Die verborgene Welt der Zauberer' },
      { mapId: 'hp_city', name: 'Winkelgasse', type: 'city', description: 'Die Einkaufsstraße der Zauberer' },
      { mapId: 'hp_dungeon', name: 'Kammer des Schreckens', type: 'dungeon', description: 'Tief unter Hogwarts verborgen' },
    ],
    items: [
      ...commonItems,
      { id: 'elder_wand', name: 'Elderstab', icon: '🪄', type: 'weapon', description: 'Der mächtigste Zauberstab der Welt', value: 1000, rarity: 'legendary', damage: 25, statBonus: { intelligence: 5 } },
      { id: 'invisibility_cloak', name: 'Tarnumhang', icon: '👻', type: 'armor', description: 'Macht unsichtbar', value: 800, rarity: 'legendary', defense: 10, statBonus: { dexterity: 5 } },
      { id: 'felix_felicis', name: 'Felix Felicis', icon: '🍯', type: 'potion', description: 'Flüssiges Glück!', value: 400, rarity: 'epic', effects: [{ type: 'buff', stat: 'charisma', amount: 5, duration: 5 }] },
    ],
    npcs: [
      { id: 'hp_merchant', name: 'Mr. Ollivander', icon: '🪄', race: 'Reinblut', class: 'Zauberstabmacher', role: 'merchant', personality: 'Mysteriös, wissend, erinnert sich an jeden Zauberstab den er je verkauft hat.', backstory: 'Der berühmteste Zauberstabmacher der magischen Welt.', level: 15, hp: 40, stats: { strength: 4, dexterity: 7, constitution: 5, intelligence: 18, wisdom: 16, charisma: 10 }, shopItems: ['health_potion', 'mana_potion', 'fire_scroll'] },
      { id: 'hp_quest', name: 'Dumbledore', icon: '🧙', race: 'Halbblut', class: 'Schulleiter', role: 'questgiver', personality: 'Weise, exzentrisch, liebt Zitronenbonbons. Antwortet oft mit Gegenfragen.', backstory: 'Der größte Zauberer seiner Zeit und Schulleiter von Hogwarts.', level: 25, hp: 100, stats: { strength: 8, dexterity: 10, constitution: 9, intelligence: 20, wisdom: 20, charisma: 16 } },
      { id: 'hp_guard', name: 'Hagrid', icon: '🧔', race: 'Halbriese', class: 'Wildhüter', role: 'guard', personality: 'Herzlich, loyal, liebt gefährliche Tiere. Kann kein Geheimnis bewahren.', backstory: 'Wildhüter und Hüter der Schlüssel von Hogwarts.', level: 8, hp: 100, stats: { strength: 16, dexterity: 5, constitution: 16, intelligence: 6, wisdom: 8, charisma: 10 } },
    ],
  },
];

export function getWorldMaps(worldId: string): Record<string, GameMap> {
  const prefix = worldId === 'onepiece' ? 'op' : worldId === 'marvel' ? 'mv' : worldId === 'fantasy' ? 'f' : worldId === 'starwars' ? 'sw' : 'hp';
  const world = worlds.find(w => w.id === worldId)!;

  const worldMap = createWorldMap(`${prefix}_world`, world.locations[0].name, [
    { x: 5, y: 3, type: 'castle', icon: '🏰', dest: `${prefix}_city`, label: world.locations[1].name },
    { x: 14, y: 5, type: 'entrance', icon: '🕳️', dest: `${prefix}_dungeon`, label: world.locations[2].name },
    { x: 10, y: 10, type: 'building', icon: '🏘️', dest: `${prefix}_village`, label: 'Dorf' },
    { x: 3, y: 8, type: 'forest', icon: '🌳', dest: undefined, label: 'Dichter Wald' },
    { x: 16, y: 11, type: 'mountain', icon: '🏔️', dest: undefined, label: 'Hohe Berge' },
  ]);

  const cityMap = createCityMap(`${prefix}_city`, world.locations[1].name, [
    { x: 4, y: 3, npcId: `${prefix}_merchant` },
    { x: 10, y: 3, npcId: `${prefix}_quest` },
    { x: 7, y: 9, npcId: `${prefix}_guard` },
  ]);

  const dungeonMap = createDungeonMap(`${prefix}_dungeon`, world.locations[2].name);

  const villageMap = createCityMap(`${prefix}_village`, 'Kleines Dorf', [
    { x: 5, y: 4, npcId: `${prefix}_merchant` },
  ]);
  villageMap.type = 'village';

  return {
    [`${prefix}_world`]: worldMap,
    [`${prefix}_city`]: cityMap,
    [`${prefix}_dungeon`]: dungeonMap,
    [`${prefix}_village`]: villageMap,
  };
}

export function findItemById(worldId: string, itemId: string): Item | undefined {
  const world = worlds.find(w => w.id === worldId);
  return world?.items.find(i => i.id === itemId);
}

export function findNpcById(worldId: string, npcId: string): NpcTemplate | undefined {
  const world = worlds.find(w => w.id === worldId);
  return world?.npcs.find(n => n.id === npcId);
}
