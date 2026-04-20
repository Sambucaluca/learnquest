import { useGameStore } from '../store/gameStore';
import type { InventoryItem, Equipment } from '../types/game';

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-300 border-gray-600',
  uncommon: 'text-green-400 border-green-600',
  rare: 'text-blue-400 border-blue-600',
  epic: 'text-purple-400 border-purple-600',
  legendary: 'text-amber-400 border-amber-500',
};

function ItemCard({
  item,
  onUse,
  onEquip,
  onDrop,
  onSell,
  showSell,
}: {
  item: InventoryItem;
  onUse?: () => void;
  onEquip?: () => void;
  onDrop?: () => void;
  onSell?: () => void;
  showSell?: boolean;
}) {
  const rarityClass = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  const isEquippable = item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory';
  const isUsable = item.type === 'potion' || item.type === 'food' || item.type === 'scroll';

  return (
    <div className={`card-dark border ${rarityClass} p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-medieval text-sm truncate ${rarityClass.split(' ')[0]}`}>
            {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
          </p>
          <p className="text-xs text-gray-500 capitalize">{item.rarity} • {item.type}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-2">{item.description}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {item.damage && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">DMG {item.damage}</span>}
        {item.defense && <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">DEF {item.defense}</span>}
        {item.statBonus && Object.entries(item.statBonus).map(([stat, val]) => (
          <span key={stat} className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
            +{val} {stat.substring(0, 3).toUpperCase()}
          </span>
        ))}
        {item.effects?.map((e, i) => (
          <span key={i} className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded">
            {e.type === 'heal' ? `+${e.amount} HP` : e.type === 'damage' ? `${e.amount} DMG` : `+${e.amount} ${e.stat || ''}`}
          </span>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap">
        {isUsable && onUse && (
          <button onClick={onUse} className="text-xs bg-green-800 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors">
            Benutzen
          </button>
        )}
        {isEquippable && onEquip && (
          <button onClick={onEquip} className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
            Ausrüsten
          </button>
        )}
        {showSell && onSell && (
          <button onClick={onSell} className="text-xs bg-yellow-800 hover:bg-yellow-700 text-white px-2 py-1 rounded transition-colors">
            Verkaufen ({Math.floor(item.value * 0.6)}g)
          </button>
        )}
        {onDrop && (
          <button onClick={onDrop} className="text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors">
            Ablegen
          </button>
        )}
      </div>
    </div>
  );
}

function EquipSlot({ slot, item, onUnequip }: { slot: string; item: InventoryItem | null; onUnequip: () => void }) {
  return (
    <div className="card-dark p-2">
      <p className="text-xs text-gray-500 mb-1 capitalize">{slot}</p>
      {item ? (
        <div className="flex items-center gap-2">
          <span className="text-xl">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-parchment truncate">{item.name}</p>
            <button onClick={onUnequip} className="text-xs text-red-400 hover:text-red-300">Ablegen</button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 italic">Leer</p>
      )}
    </div>
  );
}

export default function Inventory() {
  const { character, setScreen, useItem, equipItem, unequipItem, dropItem, sellItem, screen } = useGameStore();

  if (!character) return null;

  const showSell = screen === 'shop';

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-medieval text-amber-400">Inventar</h2>
          <div className="flex items-center gap-3">
            <span className="stat-badge text-yellow-400">Gold: {character.gold}</span>
            <button onClick={() => setScreen('game')} className="btn-secondary">
              [ESC] Schließen
            </button>
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-6">
          <h3 className="text-lg font-medieval text-amber-300 mb-2">Ausrüstung</h3>
          <div className="grid grid-cols-3 gap-3">
            <EquipSlot slot="Waffe" item={character.equipment.weapon} onUnequip={() => unequipItem('weapon')} />
            <EquipSlot slot="Rüstung" item={character.equipment.armor} onUnequip={() => unequipItem('armor')} />
            <EquipSlot slot="Accessoire" item={character.equipment.accessory} onUnequip={() => unequipItem('accessory')} />
          </div>
        </div>

        {/* Inventory items */}
        <h3 className="text-lg font-medieval text-amber-300 mb-2">
          Gegenstände ({character.inventory.length})
        </h3>
        {character.inventory.length === 0 ? (
          <p className="text-gray-500 italic">Dein Inventar ist leer.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {character.inventory.map((item) => (
              <ItemCard
                key={item.instanceId}
                item={item}
                onUse={() => useItem(item.instanceId)}
                onEquip={() => equipItem(item.instanceId)}
                onDrop={() => dropItem(item.instanceId)}
                onSell={showSell ? () => sellItem(item.instanceId) : undefined}
                showSell={showSell}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
