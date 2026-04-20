import type { Character, NpcTemplate, World, NarratorMessage } from '../types/game';
import { generateId } from '../utils/dice';

interface AiResponse {
  text: string;
}

async function callAI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<AiResponse> {
  if (!apiKey) {
    return { text: getFallbackResponse(userPrompt) };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.choices[0].message.content };
  } catch {
    return { text: getFallbackResponse(userPrompt) };
  }
}

function getFallbackResponse(context: string): string {
  const responses = [
    'Die Luft ist erfüllt von Spannung. Du spürst, dass etwas Großes bevorsteht...',
    'Ein kalter Wind weht durch die Gegend. Du hörst Geräusche in der Ferne.',
    'Die Umgebung ist ruhig, aber deine Instinkte sagen dir, dass Gefahr lauert.',
    'Du bemerkst Spuren am Boden. Jemand oder etwas war hier vor nicht allzu langer Zeit.',
    'Ein seltsames Leuchten erfüllt den Raum. Magische Energie pulsiert in der Luft.',
    'Du hörst das Klirren von Münzen und das Murmeln von Händlern in der Nähe.',
    'Schatten bewegen sich an den Wänden. Du greifst instinktiv nach deiner Waffe.',
    'Die Sonne geht unter und taucht alles in ein goldenes Licht. Ein neuer Tag geht zu Ende.',
  ];
  const hash = context.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return responses[hash % responses.length];
}

export async function narrateScene(
  apiKey: string,
  world: World,
  character: Character,
  mapName: string,
  action: string,
  context: string
): Promise<NarratorMessage> {
  const race = world.races.find(r => r.id === character.raceId);
  const charClass = world.classes.find(c => c.id === character.classId);
  
  const systemPrompt = `Du bist der Erzähler eines Solo-DnD-Abenteuers in der Welt von "${world.name}". 
${world.lore}

Der Spieler ist ${character.name}, ein${race ? ` ${race.name}` : ''} ${charClass?.name || 'Abenteurer'} (Level ${character.level}).
HP: ${character.hp}/${character.maxHp}, Gold: ${character.gold}

Erzähle atmosphärisch und spannend auf Deutsch. Halte dich an die Regeln und den Stil der "${world.name}"-Welt.
Sei beschreibend aber prägnant (2-4 Sätze). Benutze die typischen Begriffe und Orte der Welt.
Gib Hinweise auf mögliche Aktionen, ohne sie direkt vorzuschlagen.`;

  const userPrompt = `Ort: ${mapName}\nAktion: ${action}\nKontext: ${context}`;

  const response = await callAI(apiKey, systemPrompt, userPrompt);
  return {
    id: generateId(),
    text: response.text,
    type: 'narration',
    timestamp: Date.now(),
  };
}

export async function npcDialogue(
  apiKey: string,
  world: World,
  character: Character,
  npc: NpcTemplate,
  playerMessage: string,
  conversationHistory: string[]
): Promise<NarratorMessage> {
  const systemPrompt = `Du bist "${npc.name}" in der Welt von "${world.name}".
Rasse: ${npc.race}, Klasse: ${npc.class}, Rolle: ${npc.role}
Persönlichkeit: ${npc.personality}
Hintergrund: ${npc.backstory}

${world.lore}

Antworte immer in Charakter auf Deutsch. Bleibe deiner Persönlichkeit treu.
${npc.role === 'merchant' ? 'Du bist ein Händler. Biete Waren an und verhandle über Preise.' : ''}
${npc.role === 'questgiver' ? 'Du gibst Quests. Erzähle von Problemen die gelöst werden müssen.' : ''}
${npc.role === 'guard' ? 'Du bist eine Wache. Sei wachsam und stelle Fragen.' : ''}
Halte dich kurz (1-3 Sätze). Sprich so wie der Charakter in "${world.name}" sprechen würde.`;

  const history = conversationHistory.length > 0 
    ? `\nBisheriges Gespräch:\n${conversationHistory.slice(-4).join('\n')}` 
    : '';
  const userPrompt = `${history}\n\nDer Spieler (${character.name}, ${character.level}. Stufe) sagt: "${playerMessage}"`;

  const response = await callAI(apiKey, systemPrompt, userPrompt);
  return {
    id: generateId(),
    text: `**${npc.name}:** ${response.text}`,
    type: 'dialogue',
    timestamp: Date.now(),
  };
}

export async function narrateCombat(
  apiKey: string,
  world: World,
  action: string,
  result: string
): Promise<string> {
  const systemPrompt = `Du bist der Kampf-Erzähler in der Welt von "${world.name}". 
Beschreibe Kampfaktionen dramatisch und kurz (1-2 Sätze) auf Deutsch.
Benutze Begriffe und Stil passend zur "${world.name}"-Welt.`;

  const response = await callAI(apiKey, systemPrompt, `Aktion: ${action}\nErgebnis: ${result}`);
  return response.text;
}
