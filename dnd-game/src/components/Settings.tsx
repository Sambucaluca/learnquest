import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Settings() {
  const { apiKey, setApiKey, setScreen } = useGameStore();
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="card-dark max-w-lg w-full">
        <h2 className="text-3xl font-medieval text-amber-400 mb-6 text-center">⚙️ Einstellungen</h2>

        <div className="mb-6">
          <label className="block text-parchment font-medieval text-lg mb-2">
            OpenAI API-Schlüssel
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-parchment 
                       focus:outline-none focus:border-amber-500 transition-colors"
          />
          <p className="text-gray-400 text-sm mt-2">
            Wird für den KI-Erzähler und NPC-Dialoge benötigt. 
            Ohne API-Key funktioniert das Spiel mit vordefinierten Texten.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Dein Schlüssel wird nur lokal im Browser gespeichert.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">
            {saved ? 'Gespeichert!' : 'Speichern'}
          </button>
          <button onClick={() => setScreen('menu')} className="btn-secondary flex-1">
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
}
