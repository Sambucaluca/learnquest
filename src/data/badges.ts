export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: (stats: BadgeStats) => boolean;
};

export type BadgeStats = {
  xp: number;
  level: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  subjectsMastered: number;
};

export const badges: Badge[] = [
  {
    id: 'first_step',
    name: 'Erster Schritt',
    description: 'Beantworte deine erste Frage',
    emoji: '👣',
    requirement: (s) => s.totalAnswers >= 1,
  },
  {
    id: 'quick_learner',
    name: 'Schnellstarter',
    description: '10 Fragen richtig beantwortet',
    emoji: '⚡',
    requirement: (s) => s.correctAnswers >= 10,
  },
  {
    id: 'scholar',
    name: 'Gelehrter',
    description: '50 Fragen richtig beantwortet',
    emoji: '📚',
    requirement: (s) => s.correctAnswers >= 50,
  },
  {
    id: 'master_mind',
    name: 'Meisterdenker',
    description: '100 Fragen richtig beantwortet',
    emoji: '🧠',
    requirement: (s) => s.correctAnswers >= 100,
  },
  {
    id: 'streak_3',
    name: 'Aufwärmen',
    description: '3 Tage Streak',
    emoji: '🔥',
    requirement: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Wochen-Krieger',
    description: '7 Tage Streak',
    emoji: '🗓️',
    requirement: (s) => s.streak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Unaufhaltbar',
    description: '30 Tage Streak',
    emoji: '🌟',
    requirement: (s) => s.streak >= 30,
  },
  {
    id: 'perfect',
    name: 'Perfektionist',
    description: 'Ein Quiz ohne Fehler abschließen',
    emoji: '💯',
    requirement: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: 'level_5',
    name: 'Aufsteiger',
    description: 'Erreiche Level 5',
    emoji: '⭐',
    requirement: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Lern-Champion',
    description: 'Erreiche Level 10',
    emoji: '🏆',
    requirement: (s) => s.level >= 10,
  },
  {
    id: 'level_20',
    name: 'Lern-Legende',
    description: 'Erreiche Level 20',
    emoji: '👑',
    requirement: (s) => s.level >= 20,
  },
  {
    id: 'quiz_10',
    name: 'Quiz-Fan',
    description: '10 Quizze abgeschlossen',
    emoji: '🎯',
    requirement: (s) => s.quizzesCompleted >= 10,
  },
];

export function getUnlockedBadges(stats: BadgeStats): Badge[] {
  return badges.filter((b) => b.requirement(stats));
}
