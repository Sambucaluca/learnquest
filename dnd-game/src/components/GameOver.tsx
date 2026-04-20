import { useGameStore } from '../store/gameStore';

export default function GameOver() {
  const { character, resetGame, setScreen } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-950 via-gray-900 to-midnight p-4">
      <div className="text-center max-w-md">
        <span className="text-8xl block mb-6">💀</span>
        <h1 className="text-5xl font-medieval text-red-400 mb-4">Gefallen!</h1>
        <p className="text-parchment/70 text-lg mb-2">
          {character?.name || 'Dein Held'} ist im Kampf gefallen.
        </p>
        <p className="text-gray-500 mb-8">
          Stufe {character?.level || 1} • {character?.gold || 0} Gold gesammelt
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              if (character) {
                useGameStore.setState(s => ({
                  character: s.character ? {
                    ...s.character,
                    hp: Math.floor(s.character.maxHp / 2),
                    mp: Math.floor(s.character.maxMp / 2),
                    gold: Math.floor(s.character.gold * 0.75),
                  } : null,
                  combat: { active: false, enemy: null, playerTurn: true, log: [], round: 0 },
                  screen: 'game' as const,
                }));
              }
            }}
            className="btn-primary text-xl py-4"
          >
            Wiederbeleben (25% Gold Verlust)
          </button>
          <button onClick={resetGame} className="btn-danger text-lg py-3">
            Neues Spiel
          </button>
        </div>
      </div>
    </div>
  );
}
