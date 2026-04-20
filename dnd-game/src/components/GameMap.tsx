import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameMap() {
  const {
    currentMap, playerPosition, character, world,
    movePlayer, interactWithTile, setScreen, narratorMessages, maps,
  } = useGameStore();
  const mapRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        movePlayer(1, 0);
        break;
      case 'e':
      case 'E':
      case 'Enter':
        e.preventDefault();
        interactWithTile();
        break;
      case 'i':
      case 'I':
        e.preventDefault();
        setScreen('inventory');
        break;
      case 'c':
      case 'C':
        e.preventDefault();
        setScreen('character_sheet');
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        setScreen('map_overview');
        break;
    }
  }, [movePlayer, interactWithTile, setScreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (mapRef.current) {
      const playerEl = mapRef.current.querySelector('[data-player="true"]');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [playerPosition]);

  if (!currentMap || !character || !world) return null;

  const currentTile = currentMap.tiles[playerPosition.y]?.[playerPosition.x];
  const recentMessages = narratorMessages.slice(-3);

  return (
    <div className="h-screen flex flex-col bg-midnight overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/95 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-medieval text-amber-400">{world.icon} {currentMap.name}</span>
          <span className="text-sm text-gray-400">({currentMap.type})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="stat-badge text-red-400">HP {character.hp}/{character.maxHp}</span>
          <span className="stat-badge text-blue-400">MP {character.mp}/{character.maxMp}</span>
          <span className="stat-badge text-yellow-400">Gold {character.gold}</span>
          <span className="stat-badge text-purple-400">Lv.{character.level}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map area */}
        <div className="flex-1 overflow-auto p-2" ref={mapRef}>
          <div
            className="inline-grid gap-0 border border-gray-700 rounded-lg overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${currentMap.width}, 3rem)` }}
          >
            {currentMap.tiles.flatMap((row, y) =>
              row.map((tile, x) => {
                const isPlayer = x === playerPosition.x && y === playerPosition.y;
                const isAdjacent = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) === 1;
                const isNearby = Math.abs(x - playerPosition.x) <= 5 && Math.abs(y - playerPosition.y) <= 4;

                return (
                  <div
                    key={`${x}-${y}`}
                    data-player={isPlayer ? 'true' : undefined}
                    className={`map-tile relative ${
                      isPlayer ? 'ring-2 ring-amber-400 z-10' : ''
                    } ${
                      tile.interactable && isAdjacent ? 'ring-1 ring-green-400' : ''
                    } ${
                      !isNearby && currentMap.type === 'dungeon' ? 'opacity-30' : ''
                    }`}
                    onClick={() => {
                      if (isAdjacent && tile.walkable) {
                        movePlayer(x - playerPosition.x, y - playerPosition.y);
                      }
                    }}
                    title={tile.description || tile.type}
                    style={{
                      backgroundColor: tile.type === 'wall' ? '#1a1a1a' :
                        tile.type === 'water' ? '#1565c0' :
                        tile.type === 'floor' ? '#2a2a2a' :
                        tile.type === 'road' ? '#5d4037' :
                        tile.type === 'grass' ? '#1b5e20' :
                        tile.type === 'forest' ? '#2e7d32' :
                        tile.type === 'sand' ? '#a59055' :
                        '#1e1e1e'
                    }}
                  >
                    {isPlayer ? (
                      <span className="text-xl animate-bounce">🧙</span>
                    ) : (
                      <span className="text-base">{tile.icon}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 bg-gray-900/95 border-l border-gray-700 flex flex-col shrink-0">
          {/* Narrator messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <h3 className="text-sm font-medieval text-amber-400 mb-2">Erzähler</h3>
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`text-sm p-2 rounded ${
                  msg.type === 'narration' ? 'bg-gray-800 text-parchment italic' :
                  msg.type === 'combat' ? 'bg-red-900/30 text-red-300' :
                  msg.type === 'loot' ? 'bg-yellow-900/30 text-yellow-300' :
                  msg.type === 'levelup' ? 'bg-purple-900/30 text-purple-300' :
                  msg.type === 'dialogue' ? 'bg-blue-900/30 text-blue-300' :
                  'bg-gray-800/50 text-gray-300'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Current tile info */}
          {currentTile && currentTile.interactable && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <p className="text-sm text-amber-300">{currentTile.description || currentTile.type}</p>
              <button onClick={interactWithTile} className="btn-primary w-full mt-2 text-sm py-2">
                [E] Interagieren
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="p-3 border-t border-gray-700 shrink-0">
            {/* D-Pad for mobile */}
            <div className="grid grid-cols-3 gap-1 mb-3 md:hidden">
              <div />
              <button onClick={() => movePlayer(0, -1)} className="btn-secondary py-2 text-center">↑</button>
              <div />
              <button onClick={() => movePlayer(-1, 0)} className="btn-secondary py-2 text-center">←</button>
              <button onClick={interactWithTile} className="btn-primary py-2 text-center text-sm">E</button>
              <button onClick={() => movePlayer(1, 0)} className="btn-secondary py-2 text-center">→</button>
              <div />
              <button onClick={() => movePlayer(0, 1)} className="btn-secondary py-2 text-center">↓</button>
              <div />
            </div>

            <div className="flex flex-wrap gap-1">
              <button onClick={() => setScreen('inventory')} className="btn-secondary text-xs flex-1">[I] Inventar</button>
              <button onClick={() => setScreen('character_sheet')} className="btn-secondary text-xs flex-1">[C] Charakter</button>
              <button onClick={() => setScreen('map_overview')} className="btn-secondary text-xs flex-1">[M] Karte</button>
              <button onClick={() => useGameStore.getState().rest()} className="btn-secondary text-xs flex-1">Rasten</button>
            </div>
            <p className="text-xs text-gray-500 mt-2 hidden md:block">WASD/Pfeile: Bewegen | E: Interagieren</p>
          </div>
        </div>
      </div>
    </div>
  );
}
