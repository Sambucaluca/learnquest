import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { CharacterAppearance } from '../types/game';

const SKIN_COLORS = ['#f5d0a9', '#d4a574', '#a67b5b', '#8d5524', '#613318', '#c68642'];
const HAIR_COLORS = ['#2c1b18', '#4a3728', '#8b6914', '#b8860b', '#c0392b', '#ecf0f1', '#3498db', '#9b59b6'];
const EYE_COLORS = ['#634e34', '#2e536f', '#3d671d', '#1c7847', '#7c3f00', '#000000'];
const OUTFIT_COLORS = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#f39c12', '#2c3e50', '#e74c3c', '#1abc9c'];
const HAIR_STYLES = ['Kurz', 'Lang', 'Pferdeschwanz', 'Irokese', 'Glatze', 'Locken', 'Zöpfe', 'Wild'];
const OUTFITS = ['Rüstung', 'Robe', 'Leder', 'Umhang', 'Straßenkleidung', 'Krieger'];
const ACCESSORIES = ['Keine', 'Narbe', 'Augenklappe', 'Brille', 'Krone', 'Helm', 'Maske', 'Tattoo'];

function CharacterPreview({ appearance }: { appearance: CharacterAppearance }) {
  return (
    <div className="relative w-48 h-64 mx-auto">
      <svg viewBox="0 0 120 160" className="w-full h-full">
        {/* Body */}
        <rect x="35" y="80" width="50" height="55" rx="5" fill={appearance.outfitColor} />
        {/* Arms */}
        <rect x="20" y="85" width="18" height="40" rx="8" fill={appearance.skinColor} />
        <rect x="82" y="85" width="18" height="40" rx="8" fill={appearance.skinColor} />
        {/* Legs */}
        <rect x="38" y="130" width="18" height="28" rx="5" fill={appearance.outfitColor} opacity="0.8" />
        <rect x="64" y="130" width="18" height="28" rx="5" fill={appearance.outfitColor} opacity="0.8" />
        {/* Head */}
        <circle cx="60" cy="50" r="28" fill={appearance.skinColor} />
        {/* Hair */}
        {appearance.hairStyle !== 4 && (
          <ellipse
            cx="60"
            cy={appearance.hairStyle === 1 ? 45 : 38}
            rx={appearance.hairStyle === 3 ? 10 : 26}
            ry={appearance.hairStyle === 3 ? 22 : appearance.hairStyle === 1 ? 35 : 18}
            fill={appearance.hairColor}
          />
        )}
        {/* Eyes */}
        <circle cx="50" cy="48" r="4" fill="white" />
        <circle cx="70" cy="48" r="4" fill="white" />
        <circle cx="50" cy="48" r="2.5" fill={appearance.eyeColor} />
        <circle cx="70" cy="48" r="2.5" fill={appearance.eyeColor} />
        {/* Mouth */}
        <path d="M 52 60 Q 60 66 68 60" fill="none" stroke="#333" strokeWidth="1.5" />
        {/* Accessory */}
        {appearance.accessory === 1 && (
          <line x1="40" y1="45" x2="48" y2="55" stroke="#8b0000" strokeWidth="2" />
        )}
        {appearance.accessory === 2 && (
          <circle cx="50" cy="48" r="6" fill="black" stroke="#333" strokeWidth="1" />
        )}
        {appearance.accessory === 3 && (
          <>
            <circle cx="50" cy="48" r="7" fill="none" stroke="#999" strokeWidth="1.5" />
            <circle cx="70" cy="48" r="7" fill="none" stroke="#999" strokeWidth="1.5" />
            <line x1="57" y1="48" x2="63" y2="48" stroke="#999" strokeWidth="1" />
          </>
        )}
        {appearance.accessory === 4 && (
          <polygon points="42,30 60,18 78,30" fill="#ffd700" stroke="#daa520" strokeWidth="1" />
        )}
        {appearance.accessory === 5 && (
          <path d="M 32 40 Q 60 20 88 40" fill="#666" stroke="#555" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
}

export default function CharacterCreation() {
  const { world, setScreen, createCharacter } = useGameStore();
  const [name, setName] = useState('');
  const [raceId, setRaceId] = useState(world?.races[0]?.id || '');
  const [classId, setClassId] = useState(world?.classes[0]?.id || '');
  const [step, setStep] = useState(0);
  const [appearance, setAppearance] = useState<CharacterAppearance>({
    skinColor: SKIN_COLORS[0],
    hairColor: HAIR_COLORS[0],
    hairStyle: 0,
    eyeColor: EYE_COLORS[0],
    outfit: 0,
    outfitColor: OUTFIT_COLORS[0],
    accessory: 0,
  });

  if (!world) return null;

  const selectedRace = world.races.find(r => r.id === raceId);
  const selectedClass = world.classes.find(c => c.id === classId);

  const handleStart = () => {
    if (!name.trim()) return;
    createCharacter(name.trim(), raceId, classId, appearance);
  };

  const steps = ['Name & Rasse', 'Klasse', 'Aussehen', 'Bestätigen'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setScreen('world_select')} className="btn-secondary mb-4">
          ← Zurück
        </button>

        <h2 className="text-3xl font-medieval text-amber-400 text-center mb-2">
          {world.icon} Charakter erstellen — {world.name}
        </h2>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`px-3 py-1 rounded-full text-sm font-medieval cursor-pointer transition-colors
                ${i === step ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              onClick={() => setStep(i)}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Preview */}
          <div className="card-dark flex flex-col items-center">
            <h3 className="text-lg font-medieval text-amber-300 mb-3">Vorschau</h3>
            <CharacterPreview appearance={appearance} />
            <p className="text-xl font-medieval text-parchment mt-3">{name || '???'}</p>
            <p className="text-sm text-gray-400">
              {selectedRace?.icon} {selectedRace?.name || '?'} • {selectedClass?.icon} {selectedClass?.name || '?'}
            </p>
          </div>

          {/* Center: Current step */}
          <div className="card-dark md:col-span-2">
            {step === 0 && (
              <div>
                <h3 className="text-xl font-medieval text-amber-300 mb-4">Name & Rasse</h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dein Charaktername..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-parchment 
                             focus:outline-none focus:border-amber-500 mb-4 text-lg font-medieval"
                  maxLength={20}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {world.races.map((race) => (
                    <button
                      key={race.id}
                      onClick={() => setRaceId(race.id)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        raceId === race.id
                          ? 'border-amber-500 bg-amber-900/30'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{race.icon}</span>
                        <span className="font-medieval text-parchment">{race.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{race.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(race.bonuses).map(([stat, val]) => (
                          <span key={stat} className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                            +{val} {stat.substring(0, 3).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-xl font-medieval text-amber-300 mb-4">Klasse</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {world.classes.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setClassId(cls.id)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        classId === cls.id
                          ? 'border-amber-500 bg-amber-900/30'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cls.icon}</span>
                        <span className="font-medieval text-parchment">{cls.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{cls.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(cls.bonuses).map(([stat, val]) => (
                          <span key={stat} className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">
                            +{val} {stat.substring(0, 3).toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Fähigkeiten: {cls.abilities.join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-medieval text-amber-300 mb-4">Aussehen</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Hautfarbe</label>
                    <div className="flex gap-2 flex-wrap">
                      {SKIN_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAppearance({ ...appearance, skinColor: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            appearance.skinColor === c ? 'border-amber-400 scale-125' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Haarfarbe</label>
                    <div className="flex gap-2 flex-wrap">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAppearance({ ...appearance, hairColor: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            appearance.hairColor === c ? 'border-amber-400 scale-125' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Frisur</label>
                    <div className="flex gap-2 flex-wrap">
                      {HAIR_STYLES.map((s, i) => (
                        <button
                          key={s}
                          onClick={() => setAppearance({ ...appearance, hairStyle: i })}
                          className={`px-3 py-1 rounded text-sm ${
                            appearance.hairStyle === i ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Augenfarbe</label>
                    <div className="flex gap-2 flex-wrap">
                      {EYE_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAppearance({ ...appearance, eyeColor: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            appearance.eyeColor === c ? 'border-amber-400 scale-125' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Kleidungsfarbe</label>
                    <div className="flex gap-2 flex-wrap">
                      {OUTFIT_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAppearance({ ...appearance, outfitColor: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            appearance.outfitColor === c ? 'border-amber-400 scale-125' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Accessoire</label>
                    <div className="flex gap-2 flex-wrap">
                      {ACCESSORIES.map((a, i) => (
                        <button
                          key={a}
                          onClick={() => setAppearance({ ...appearance, accessory: i })}
                          className={`px-3 py-1 rounded text-sm ${
                            appearance.accessory === i ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-medieval text-amber-300 mb-4">Zusammenfassung</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-parchment font-medieval text-lg">{name || '???'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rasse:</span>
                    <span className="text-parchment">{selectedRace?.icon} {selectedRace?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Klasse:</span>
                    <span className="text-parchment">{selectedClass?.icon} {selectedClass?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Welt:</span>
                    <span className="text-parchment">{world.icon} {world.name}</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div>
                    <span className="text-gray-400 block mb-1">Rassen-Boni:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedRace && Object.entries(selectedRace.bonuses).map(([stat, val]) => (
                        <span key={stat} className="stat-badge text-green-400">
                          +{val} {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Klassen-Boni:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedClass && Object.entries(selectedClass.bonuses).map(([stat, val]) => (
                        <span key={stat} className="stat-badge text-blue-400">
                          +{val} {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Fähigkeiten:</span>
                    <div className="flex flex-wrap gap-2">
                      {[...(selectedRace?.abilities || []), ...(selectedClass?.abilities || [])].map(a => (
                        <span key={a} className="stat-badge text-purple-400">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!name.trim()}
                  className="btn-primary w-full mt-6 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abenteuer starten!
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className="btn-secondary"
                disabled={step === 0}
              >
                ← Zurück
              </button>
              {step < 3 && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="btn-primary"
                >
                  Weiter →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
