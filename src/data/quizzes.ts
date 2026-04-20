export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Subject = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  questions: Question[];
};

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematik',
    emoji: '🧮',
    color: '#7C5CFF',
    description: 'Algebra, Geometrie & mehr',
    questions: [
      {
        id: 'm1',
        question: 'Was ist 7 × 8?',
        options: ['54', '56', '58', '64'],
        correctIndex: 1,
        explanation: '7 × 8 = 56',
      },
      {
        id: 'm2',
        question: 'Löse: 3x + 6 = 21. Was ist x?',
        options: ['3', '5', '7', '9'],
        correctIndex: 1,
        explanation: '3x = 15, also x = 5',
      },
      {
        id: 'm3',
        question: 'Wie viele Seiten hat ein Hexagon?',
        options: ['5', '6', '7', '8'],
        correctIndex: 1,
        explanation: 'Ein Hexagon (Sechseck) hat 6 Seiten.',
      },
      {
        id: 'm4',
        question: 'Wie lautet die Quadratwurzel von 144?',
        options: ['10', '11', '12', '14'],
        correctIndex: 2,
        explanation: '12 × 12 = 144',
      },
      {
        id: 'm5',
        question: 'Was ist 15 % von 200?',
        options: ['20', '25', '30', '35'],
        correctIndex: 2,
        explanation: '200 × 0,15 = 30',
      },
      {
        id: 'm6',
        question: 'Welche Zahl ist eine Primzahl?',
        options: ['9', '15', '21', '23'],
        correctIndex: 3,
        explanation: '23 ist nur durch 1 und sich selbst teilbar.',
      },
      {
        id: 'm7',
        question: 'Umfang eines Quadrats mit Seitenlänge 7?',
        options: ['14', '21', '28', '49'],
        correctIndex: 2,
        explanation: 'U = 4 × 7 = 28',
      },
      {
        id: 'm8',
        question: 'Was ist π (Pi) ungefähr?',
        options: ['2,71', '3,14', '3,41', '4,13'],
        correctIndex: 1,
        explanation: 'π ≈ 3,14159…',
      },
    ],
  },
  {
    id: 'english',
    name: 'Englisch',
    emoji: '🇬🇧',
    color: '#3DDC84',
    description: 'Vokabeln & Grammatik',
    questions: [
      {
        id: 'e1',
        question: 'Was bedeutet "house"?',
        options: ['Hund', 'Haus', 'Pferd', 'Hof'],
        correctIndex: 1,
      },
      {
        id: 'e2',
        question: 'Welche Form ist richtig: "She ___ to school every day."',
        options: ['go', 'goes', 'going', 'gone'],
        correctIndex: 1,
        explanation: '3. Person Singular: goes',
      },
      {
        id: 'e3',
        question: 'Past tense of "run"?',
        options: ['runned', 'ran', 'runs', 'running'],
        correctIndex: 1,
      },
      {
        id: 'e4',
        question: 'Was bedeutet "although"?',
        options: ['deshalb', 'obwohl', 'außerdem', 'zuerst'],
        correctIndex: 1,
      },
      {
        id: 'e5',
        question: 'Choose the correct: "I ___ never been to London."',
        options: ['have', 'has', 'had', 'am'],
        correctIndex: 0,
      },
      {
        id: 'e6',
        question: 'Was ist ein "butterfly"?',
        options: ['Schmetterling', 'Biene', 'Libelle', 'Marienkäfer'],
        correctIndex: 0,
      },
      {
        id: 'e7',
        question: 'Antonym of "begin"?',
        options: ['start', 'continue', 'end', 'open'],
        correctIndex: 2,
      },
      {
        id: 'e8',
        question: '"Mein Bruder ist älter als ich." → "My brother is ___ than me."',
        options: ['old', 'older', 'oldest', 'more old'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biologie',
    emoji: '🧬',
    color: '#FFB547',
    description: 'Leben & Natur',
    questions: [
      {
        id: 'b1',
        question: 'Welches Organ pumpt das Blut?',
        options: ['Lunge', 'Leber', 'Herz', 'Niere'],
        correctIndex: 2,
      },
      {
        id: 'b2',
        question: 'Wie viele Chromosomen hat ein Mensch normalerweise?',
        options: ['23', '42', '46', '48'],
        correctIndex: 2,
        explanation: '46 (23 Paare)',
      },
      {
        id: 'b3',
        question: 'Welcher Prozess wandelt Licht in Energie in Pflanzen um?',
        options: ['Atmung', 'Photosynthese', 'Mitose', 'Osmose'],
        correctIndex: 1,
      },
      {
        id: 'b4',
        question: 'Welches Gas atmen wir beim Einatmen ein?',
        options: ['Stickstoff', 'CO₂', 'Sauerstoff', 'Wasserstoff'],
        correctIndex: 2,
      },
      {
        id: 'b5',
        question: 'Das größte Organ des Menschen ist die…',
        options: ['Leber', 'Haut', 'Lunge', 'Darm'],
        correctIndex: 1,
      },
      {
        id: 'b6',
        question: 'DNA steht für…',
        options: [
          'Deoxyribonukleinsäure',
          'Diaminonukleinsäure',
          'Digitalnetzwerk-Analyse',
          'Dezentrale Nukleotid-Ansammlung',
        ],
        correctIndex: 0,
      },
      {
        id: 'b7',
        question: 'Wie heißt die Grundbaueinheit des Lebens?',
        options: ['Atom', 'Molekül', 'Zelle', 'Organ'],
        correctIndex: 2,
      },
      {
        id: 'b8',
        question: 'Wer formulierte die Evolutionstheorie?',
        options: ['Einstein', 'Newton', 'Darwin', 'Mendel'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'history',
    name: 'Geschichte',
    emoji: '🏛️',
    color: '#FF5A6B',
    description: 'Vergangenheit entdecken',
    questions: [
      {
        id: 'h1',
        question: 'Wann fiel die Berliner Mauer?',
        options: ['1987', '1989', '1991', '1993'],
        correctIndex: 1,
      },
      {
        id: 'h2',
        question: 'Wer war der erste Bundeskanzler der BRD?',
        options: ['Willy Brandt', 'Konrad Adenauer', 'Helmut Kohl', 'Ludwig Erhard'],
        correctIndex: 1,
      },
      {
        id: 'h3',
        question: 'Wann begann der Zweite Weltkrieg?',
        options: ['1914', '1918', '1939', '1945'],
        correctIndex: 2,
      },
      {
        id: 'h4',
        question: 'Welches Volk baute das Kolosseum?',
        options: ['Ägypter', 'Griechen', 'Römer', 'Perser'],
        correctIndex: 2,
      },
      {
        id: 'h5',
        question: 'Wer entdeckte Amerika 1492?',
        options: ['Magellan', 'Kolumbus', 'Vasco da Gama', 'Cortés'],
        correctIndex: 1,
      },
      {
        id: 'h6',
        question: 'Die Französische Revolution begann im Jahr…',
        options: ['1776', '1789', '1804', '1815'],
        correctIndex: 1,
      },
      {
        id: 'h7',
        question: 'Welches Reich führte Cäsar an?',
        options: ['Griechisches', 'Römisches', 'Persisches', 'Ägyptisches'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'geography',
    name: 'Geografie',
    emoji: '🌍',
    color: '#5EC9FF',
    description: 'Länder & Kontinente',
    questions: [
      {
        id: 'g1',
        question: 'Was ist die Hauptstadt von Australien?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correctIndex: 2,
      },
      {
        id: 'g2',
        question: 'Welcher ist der längste Fluss der Welt?',
        options: ['Amazonas', 'Nil', 'Jangtsekiang', 'Mississippi'],
        correctIndex: 1,
        explanation: 'Der Nil mit ca. 6.650 km.',
      },
      {
        id: 'g3',
        question: 'Wie viele Kontinente gibt es?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
      },
      {
        id: 'g4',
        question: 'Welches Land hat die meisten Einwohner?',
        options: ['USA', 'China', 'Indien', 'Russland'],
        correctIndex: 2,
        explanation: 'Seit 2023 ist Indien vor China.',
      },
      {
        id: 'g5',
        question: 'Welcher Berg ist der höchste der Welt?',
        options: ['K2', 'Mont Blanc', 'Mount Everest', 'Kilimandscharo'],
        correctIndex: 2,
      },
      {
        id: 'g6',
        question: 'Welches Meer grenzt an Italien NICHT an?',
        options: ['Mittelmeer', 'Adria', 'Nordsee', 'Tyrrhenisches Meer'],
        correctIndex: 2,
      },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getAllQuestions(): Question[] {
  return subjects.flatMap((s) => s.questions);
}
