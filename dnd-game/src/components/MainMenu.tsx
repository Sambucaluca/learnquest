import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
  const { setScreen } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-medieval text-amber-400 mb-4 drop-shadow-lg animate-pulse">
          ⚔️ Solo DnD ⚔️
        </h1>
        <p className="text-xl md:text-2xl text-parchment/80 font-medieval">
          Abenteuer in jeder Welt
        </p>
        <p className="text-sm text-gray-400 mt-2">
          One Piece • Marvel • Fantasy • Star Wars • Harry Potter
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => setScreen('world_select')}
          className="btn-primary text-2xl py-5 flex items-center justify-center gap-3"
        >
          🗡️ Neues Abenteuer
        </button>
        <button
          onClick={() => setScreen('settings')}
          className="btn-secondary text-lg py-3 flex items-center justify-center gap-3"
        >
          ⚙️ Einstellungen
        </button>
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm max-w-lg">
        <p>Wähle eine Welt, erstelle deinen Charakter und erlebe ein einzigartiges Abenteuer!</p>
        <p className="mt-1">Mit KI-gesteuertem Erzähler und NPCs</p>
      </div>
    </div>
  );
}
