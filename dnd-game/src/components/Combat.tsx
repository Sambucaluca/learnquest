import { useGameStore } from '../store/gameStore';

export default function Combat() {
  const { combat, character, world, playerAttack, playerDefend, playerFlee, useItem, setScreen } = useGameStore();

  if (!combat.active || !combat.enemy || !character || !world) return null;

  const enemyHpPercent = (combat.enemy.hp / combat.enemy.maxHp) * 100;
  const playerHpPercent = (character.hp / character.maxHp) * 100;

  const potions = character.inventory.filter(i => i.type === 'potion' || i.type === 'food');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-gray-900 to-midnight flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h2 className="text-3xl font-medieval text-red-400 text-center mb-6 animate-pulse">
          ⚔️ KAMPF ⚔️
        </h2>
        <p className="text-center text-gray-400 text-sm mb-4">Runde {combat.round}</p>

        {/* Combatants */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Player */}
          <div className="card-dark text-center">
            <span className="text-4xl block mb-2">🧙</span>
            <p className="font-medieval text-amber-300">{character.name}</p>
            <p className="text-sm text-gray-400">Stufe {character.level}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">HP</span>
                <span className="text-red-400">{character.hp}/{character.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-700 to-red-500 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1 mt-2 justify-center">
              {character.equipment.weapon && (
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded" title={character.equipment.weapon.name}>
                  {character.equipment.weapon.icon} DMG {character.equipment.weapon.damage}
                </span>
              )}
              {character.equipment.armor && (
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded" title={character.equipment.armor.name}>
                  {character.equipment.armor.icon} DEF {character.equipment.armor.defense}
                </span>
              )}
            </div>
          </div>

          {/* Enemy */}
          <div className="card-dark text-center border-red-900/50">
            <span className="text-4xl block mb-2">{combat.enemy.icon}</span>
            <p className="font-medieval text-red-300">{combat.enemy.name}</p>
            <p className="text-sm text-gray-400">Stufe {combat.enemy.level}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">HP</span>
                <span className="text-red-400">{combat.enemy.hp}/{combat.enemy.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-800 to-red-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${enemyHpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className="card-dark mb-4 max-h-40 overflow-y-auto">
          <h3 className="text-sm font-medieval text-amber-400 mb-2">Kampflog</h3>
          {combat.log.map((entry, i) => (
            <p key={i} className="text-sm text-parchment/80 py-0.5">{entry}</p>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={playerAttack} className="btn-primary flex items-center justify-center gap-2 text-lg">
            ⚔️ Angreifen
          </button>
          <button onClick={playerDefend} className="btn-secondary flex items-center justify-center gap-2 text-lg">
            🛡️ Verteidigen
          </button>
          <button onClick={playerFlee} className="btn-secondary flex items-center justify-center gap-2">
            🏃 Fliehen
          </button>
          {potions.length > 0 && (
            <button
              onClick={() => {
                const potion = potions[0];
                useItem(potion.instanceId);
              }}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              🧪 Heiltrank ({potions.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
