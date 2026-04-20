import { useGameStore } from '../store/gameStore';

const STAT_LABELS: Record<string, string> = {
  strength: 'Stärke',
  dexterity: 'Geschick',
  constitution: 'Konstitution',
  intelligence: 'Intelligenz',
  wisdom: 'Weisheit',
  charisma: 'Charisma',
};

const STAT_ICONS: Record<string, string> = {
  strength: '💪',
  dexterity: '🏃',
  constitution: '❤️',
  intelligence: '🧠',
  wisdom: '👁️',
  charisma: '🗣️',
};

export default function CharacterSheet() {
  const { character, world, setScreen, questLog } = useGameStore();

  if (!character || !world) return null;

  const race = world.races.find(r => r.id === character.raceId);
  const charClass = world.classes.find(c => c.id === character.classId);
  const xpPercent = (character.xp / character.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-medieval text-amber-400">Charakterbogen</h2>
          <button onClick={() => setScreen('game')} className="btn-secondary">
            [ESC] Schließen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="card-dark">
            <h3 className="text-xl font-medieval text-amber-300 mb-3">{character.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Welt:</span>
                <span className="text-parchment">{world.icon} {world.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rasse:</span>
                <span className="text-parchment">{race?.icon} {race?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Klasse:</span>
                <span className="text-parchment">{charClass?.icon} {charClass?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stufe:</span>
                <span className="text-amber-400 font-bold">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gold:</span>
                <span className="text-yellow-400">{character.gold}</span>
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>XP</span>
                <span>{character.xp} / {character.xpToNext}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-full h-3 transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* HP/MP */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400">HP</span>
                  <span className="text-red-400">{character.hp} / {character.maxHp}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-700 to-red-500 rounded-full h-3 transition-all"
                    style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400">MP</span>
                  <span className="text-blue-400">{character.mp} / {character.maxMp}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-full h-3 transition-all"
                    style={{ width: `${(character.mp / character.maxMp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card-dark">
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Attribute</h3>
            <div className="space-y-2">
              {Object.entries(character.stats).map(([stat, value]) => {
                const modifier = Math.floor((value - 10) / 2);
                const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                return (
                  <div key={stat} className="flex items-center gap-2">
                    <span className="text-xl w-8">{STAT_ICONS[stat]}</span>
                    <span className="text-gray-300 flex-1">{STAT_LABELS[stat]}</span>
                    <span className="text-parchment font-bold w-8 text-right">{value}</span>
                    <span className={`text-sm w-10 text-right ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({modStr})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Abilities */}
          <div className="card-dark">
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Fähigkeiten</h3>
            <div className="flex flex-wrap gap-2">
              {character.abilities.map((ability) => (
                <span key={ability} className="stat-badge text-purple-400">
                  {ability}
                </span>
              ))}
            </div>
          </div>

          {/* Quest Log */}
          <div className="card-dark">
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Questlog</h3>
            {questLog.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Keine aktiven Quests</p>
            ) : (
              <div className="space-y-2">
                {questLog.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-2 rounded border ${
                      quest.completed ? 'border-green-700 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <p className={`text-sm ${quest.completed ? 'text-green-400 line-through' : 'text-parchment'}`}>
                      {quest.completed ? '✓ ' : '○ '}{quest.title}
                    </p>
                    <p className="text-xs text-gray-500">{quest.description}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Belohnung: {quest.reward.xp} XP, {quest.reward.gold} Gold
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
