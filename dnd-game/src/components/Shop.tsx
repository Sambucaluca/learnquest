import { useGameStore } from '../store/gameStore';
import { findItemById } from '../data/worlds';

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-600',
  uncommon: 'border-green-600',
  rare: 'border-blue-600',
  epic: 'border-purple-600',
  legendary: 'border-amber-500',
};

export default function Shop() {
  const { currentNpc, character, world, buyItem, sellItem, leaveDialogue, setScreen } = useGameStore();

  if (!currentNpc || !character || !world) return null;

  const shopItems = (currentNpc.shopItems || [])
    .map(id => findItemById(world.id, id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentNpc.icon}</span>
            <div>
              <h2 className="text-2xl font-medieval text-amber-400">{currentNpc.name}'s Laden</h2>
              <p className="text-sm text-gray-400">{currentNpc.personality.split('.')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="stat-badge text-yellow-400">Gold: {character.gold}</span>
            <button onClick={leaveDialogue} className="btn-secondary">Verlassen</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy */}
          <div>
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Kaufen</h3>
            <div className="space-y-2">
              {shopItems.map((item) => {
                if (!item) return null;
                const canAfford = character.gold >= item.value;
                return (
                  <div key={item.id} className={`card-dark flex items-center gap-3 border ${RARITY_COLORS[item.rarity]}`}>
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-parchment truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      <div className="flex gap-1 mt-1">
                        {item.damage && <span className="text-xs text-red-400">DMG {item.damage}</span>}
                        {item.defense && <span className="text-xs text-blue-400">DEF {item.defense}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                        {item.value}g
                      </p>
                      <button
                        onClick={() => buyItem(item.id)}
                        disabled={!canAfford}
                        className="text-xs bg-green-800 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 
                                   text-white px-3 py-1 rounded transition-colors mt-1"
                      >
                        Kaufen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Verkaufen</h3>
            <div className="space-y-2">
              {character.inventory.length === 0 ? (
                <p className="text-gray-500 italic text-sm">Nichts zu verkaufen</p>
              ) : (
                character.inventory.map((item) => {
                  const sellPrice = Math.floor(item.value * 0.6);
                  return (
                    <div key={item.instanceId} className="card-dark flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-parchment truncate">
                          {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                        </p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-yellow-400">{sellPrice}g</p>
                        <button
                          onClick={() => sellItem(item.instanceId)}
                          className="text-xs bg-yellow-800 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors mt-1"
                        >
                          Verkaufen
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
