export interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  races: Race[];
  classes: CharClass[];
  locations: WorldLocation[];
  items: Item[];
  npcs: NpcTemplate[];
  lore: string;
}

export interface Race {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonuses: Partial<Stats>;
  abilities: string[];
}

export interface CharClass {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonuses: Partial<Stats>;
  abilities: string[];
  startingItems: string[];
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  name: string;
  worldId: string;
  raceId: string;
  classId: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: Stats;
  inventory: InventoryItem[];
  equipment: Equipment;
  gold: number;
  appearance: CharacterAppearance;
  abilities: string[];
}

export interface CharacterAppearance {
  skinColor: string;
  hairColor: string;
  hairStyle: number;
  eyeColor: string;
  outfit: number;
  outfitColor: string;
  accessory: number;
}

export interface Equipment {
  weapon: InventoryItem | null;
  armor: InventoryItem | null;
  accessory: InventoryItem | null;
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  type: 'weapon' | 'armor' | 'potion' | 'food' | 'quest' | 'material' | 'accessory' | 'scroll';
  description: string;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects?: ItemEffect[];
  damage?: number;
  defense?: number;
  statBonus?: Partial<Stats>;
}

export interface InventoryItem extends Item {
  quantity: number;
  instanceId: string;
}

export interface ItemEffect {
  type: 'heal' | 'damage' | 'buff' | 'debuff';
  stat?: keyof Stats;
  amount: number;
  duration?: number;
}

export type MapTileType = 
  | 'grass' | 'water' | 'mountain' | 'forest' | 'sand' | 'road' | 'wall'
  | 'floor' | 'door' | 'chest' | 'stairs_up' | 'stairs_down'
  | 'building' | 'shop' | 'tavern' | 'castle' | 'port'
  | 'entrance' | 'exit' | 'npc' | 'enemy' | 'boss';

export interface MapTile {
  type: MapTileType;
  walkable: boolean;
  icon: string;
  interactable: boolean;
  description?: string;
  npcId?: string;
  enemyId?: string;
  loot?: string[];
  destination?: string;
}

export interface GameMap {
  id: string;
  name: string;
  type: 'world' | 'city' | 'village' | 'dungeon' | 'building' | 'house';
  width: number;
  height: number;
  tiles: MapTile[][];
  playerStart: { x: number; y: number };
  connections: MapConnection[];
}

export interface MapConnection {
  fromTile: { x: number; y: number };
  toMapId: string;
  toTile: { x: number; y: number };
  label: string;
}

export interface WorldLocation {
  mapId: string;
  name: string;
  type: GameMap['type'];
  description: string;
}

export interface NpcTemplate {
  id: string;
  name: string;
  icon: string;
  race: string;
  class: string;
  role: 'merchant' | 'questgiver' | 'guard' | 'villager' | 'companion' | 'enemy' | 'boss';
  personality: string;
  backstory: string;
  dialogue?: string[];
  shopItems?: string[];
  level: number;
  hp: number;
  stats: Stats;
}

export interface Enemy {
  id: string;
  name: string;
  icon: string;
  level: number;
  hp: number;
  maxHp: number;
  stats: Stats;
  xpReward: number;
  goldReward: number;
  loot: string[];
  abilities: string[];
}

export interface CombatState {
  active: boolean;
  enemy: Enemy | null;
  playerTurn: boolean;
  log: string[];
  round: number;
}

export interface NarratorMessage {
  id: string;
  text: string;
  type: 'narration' | 'dialogue' | 'combat' | 'system' | 'loot' | 'levelup';
  timestamp: number;
}

export interface DialogChoice {
  text: string;
  action: 'talk' | 'buy' | 'sell' | 'quest' | 'attack' | 'leave' | 'intimidate' | 'persuade' | 'steal';
}

export type GameScreen = 
  | 'menu' | 'settings' | 'world_select' | 'character_create' 
  | 'game' | 'inventory' | 'character_sheet' | 'map_overview'
  | 'combat' | 'dialogue' | 'shop' | 'game_over' | 'rest';

export interface GameState {
  screen: GameScreen;
  character: Character | null;
  world: World | null;
  currentMap: GameMap | null;
  playerPosition: { x: number; y: number };
  narratorMessages: NarratorMessage[];
  combat: CombatState;
  currentNpc: NpcTemplate | null;
  visitedMaps: string[];
  questLog: QuestEntry[];
  gameTime: number;
  apiKey: string;
  isLoading: boolean;
}

export interface QuestEntry {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward: { xp: number; gold: number; items?: string[] };
}
