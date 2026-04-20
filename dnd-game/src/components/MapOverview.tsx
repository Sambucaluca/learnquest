import { useGameStore } from '../store/gameStore';

export default function MapOverview() {
  const { maps, currentMap, visitedMaps, setScreen, enterMap } = useGameStore();

  const mapList = Object.entries(maps);

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-medieval text-amber-400">Kartenübersicht</h2>
          <button onClick={() => setScreen('game')} className="btn-secondary">
            [ESC] Schließen
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mapList.map(([mapId, map]) => {
            const visited = visitedMaps.includes(mapId);
            const isCurrent = currentMap?.id === mapId;

            const typeIcon =
              map.type === 'world' ? '🗺️' :
              map.type === 'city' ? '🏰' :
              map.type === 'village' ? '🏘️' :
              map.type === 'dungeon' ? '🕳️' :
              map.type === 'building' ? '🏠' :
              map.type === 'house' ? '🏡' : '📍';

            const typeLabel =
              map.type === 'world' ? 'Welt' :
              map.type === 'city' ? 'Stadt' :
              map.type === 'village' ? 'Dorf' :
              map.type === 'dungeon' ? 'Dungeon' :
              map.type === 'building' ? 'Gebäude' : 'Ort';

            return (
              <button
                key={mapId}
                onClick={() => enterMap(mapId)}
                disabled={!visited && !isCurrent}
                className={`card-dark text-left transition-all hover:-translate-y-0.5 ${
                  isCurrent
                    ? 'border-amber-500 ring-1 ring-amber-500/30'
                    : visited
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeIcon}</span>
                  <div>
                    <p className="font-medieval text-parchment">
                      {visited ? map.name : '???'}
                      {isCurrent && <span className="text-amber-400 text-sm ml-2">(Hier)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{typeLabel} • {map.width}x{map.height}</p>
                  </div>
                </div>
                {visited && (
                  <p className="text-xs text-gray-400 mt-2">
                    Klicke um hierhin zu reisen
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
