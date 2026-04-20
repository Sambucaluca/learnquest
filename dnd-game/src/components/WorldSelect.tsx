import { useGameStore } from '../store/gameStore';
import { worlds } from '../data/worlds';

export default function WorldSelect() {
  const { selectWorld, setScreen } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => setScreen('menu')} className="btn-secondary mb-6">
          ← Zurück
        </button>

        <h2 className="text-4xl font-medieval text-amber-400 text-center mb-2">Wähle deine Welt</h2>
        <p className="text-center text-gray-400 mb-8">Jede Welt hat einzigartige Rassen, Klassen und Abenteuer</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worlds.map((world) => (
            <button
              key={world.id}
              onClick={() => selectWorld(world.id)}
              className="card-dark hover:border-amber-500/50 transition-all duration-300 
                         hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">{world.icon}</span>
                <div>
                  <h3 className="text-2xl font-medieval text-amber-300 group-hover:text-amber-200">
                    {world.name}
                  </h3>
                  <div
                    className="w-16 h-1 rounded"
                    style={{ backgroundColor: world.color }}
                  />
                </div>
              </div>
              
              <p className="text-parchment/70 text-sm mb-4">{world.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                  {world.races.length} Rassen
                </span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                  {world.classes.length} Klassen
                </span>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                  {world.items.length} Items
                </span>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-bold">Rassen:</span>{' '}
                {world.races.map(r => r.icon).join(' ')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
