import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Dialogue() {
  const { currentNpc, character, world, narratorMessages, talkToNpc, leaveDialogue, isLoading, setScreen } = useGameStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [narratorMessages]);

  if (!currentNpc || !character || !world) return null;

  const dialogueMessages = narratorMessages.filter(m => m.type === 'dialogue' || m.type === 'narration').slice(-10);

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    talkToNpc(message.trim());
    setMessage('');
  };

  const quickActions = [
    { label: 'Hallo!', text: 'Hallo! Wer bist du?' },
    { label: 'Quest?', text: 'Hast du eine Aufgabe für mich?' },
    { label: 'Gerüchte', text: 'Was gibt es Neues in der Gegend?' },
    { label: 'Handel', text: 'Ich möchte handeln.' },
    { label: 'Tschüss', text: '', action: 'leave' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-gray-900 to-midnight flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* NPC Info */}
        <div className="card-dark mb-4 flex items-center gap-4">
          <span className="text-5xl">{currentNpc.icon}</span>
          <div>
            <h2 className="text-2xl font-medieval text-amber-400">{currentNpc.name}</h2>
            <p className="text-sm text-gray-400">
              {currentNpc.race} • {currentNpc.class} • Stufe {currentNpc.level}
            </p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{currentNpc.role}</p>
          </div>
          <div className="ml-auto flex gap-2">
            {currentNpc.role === 'merchant' && (
              <button onClick={() => setScreen('shop')} className="btn-secondary text-sm">
                🏪 Shop
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="card-dark mb-4 h-64 overflow-y-auto">
          {dialogueMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 mb-2 rounded text-sm ${
                msg.type === 'dialogue'
                  ? 'bg-blue-900/20 text-blue-200'
                  : 'bg-gray-800 text-parchment/70 italic'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="p-2 text-gray-400 animate-pulse text-sm">
              {currentNpc.name} denkt nach...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if (action.action === 'leave') {
                  leaveDialogue();
                } else {
                  talkToNpc(action.text);
                }
              }}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                action.action === 'leave'
                  ? 'bg-red-900/50 text-red-300 hover:bg-red-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              disabled={isLoading}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Custom message */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Sage etwas zu ${currentNpc.name}...`}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-parchment 
                       focus:outline-none focus:border-amber-500 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="btn-primary disabled:opacity-50"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}
