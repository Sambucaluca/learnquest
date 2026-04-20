import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { levelFromXp, todayKey, daysBetween } from '../utils/level';
import { badges as allBadges, BadgeStats } from '../data/badges';

export type QuizResult = {
  subjectId: string;
  correct: number;
  total: number;
  xpGained: number;
  completedAt: number;
};

type State = {
  username: string;
  avatar: string;
  onboarded: boolean;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  correctAnswers: number;
  totalAnswers: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  dailyGoal: number;
  dailyProgress: number;
  dailyGoalDate: string | null;
  unlockedBadgeIds: string[];
  recentResults: QuizResult[];
};

type Actions = {
  completeOnboarding: (username: string, avatar: string) => void;
  recordAnswer: (isCorrect: boolean) => void;
  completeQuiz: (result: QuizResult) => { newBadges: string[] };
  resetProgress: () => void;
  touchToday: () => void;
};

const initialState: State = {
  username: '',
  avatar: '🦊',
  onboarded: false,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  correctAnswers: 0,
  totalAnswers: 0,
  quizzesCompleted: 0,
  perfectQuizzes: 0,
  dailyGoal: 30, // 30 XP per day
  dailyProgress: 0,
  dailyGoalDate: null,
  unlockedBadgeIds: [],
  recentResults: [],
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: (username, avatar) =>
        set({ username: username.trim() || 'Lerner', avatar, onboarded: true }),

      recordAnswer: (isCorrect) =>
        set((s) => ({
          totalAnswers: s.totalAnswers + 1,
          correctAnswers: s.correctAnswers + (isCorrect ? 1 : 0),
        })),

      completeQuiz: (result) => {
        const state = get();
        const today = todayKey();
        let streak = state.streak;
        const last = state.lastActiveDate;

        if (!last) {
          streak = 1;
        } else if (last === today) {
          // already counted today
        } else {
          const diff = daysBetween(last, today);
          if (diff === 1) streak = streak + 1;
          else if (diff > 1) streak = 1;
        }

        // Reset daily progress if it's a new day
        const dailyDateMatches = state.dailyGoalDate === today;
        const newDailyProgress = (dailyDateMatches ? state.dailyProgress : 0) + result.xpGained;

        const newXp = state.xp + result.xpGained;
        const newLevel = levelFromXp(newXp);

        const perfect = result.correct === result.total && result.total > 0;

        const newState: Partial<State> = {
          xp: newXp,
          streak,
          lastActiveDate: today,
          quizzesCompleted: state.quizzesCompleted + 1,
          perfectQuizzes: state.perfectQuizzes + (perfect ? 1 : 0),
          dailyGoalDate: today,
          dailyProgress: newDailyProgress,
          recentResults: [result, ...state.recentResults].slice(0, 10),
        };

        const stats: BadgeStats = {
          xp: newXp,
          level: newLevel,
          streak,
          correctAnswers: state.correctAnswers,
          totalAnswers: state.totalAnswers,
          quizzesCompleted: (newState.quizzesCompleted as number) ?? state.quizzesCompleted,
          perfectQuizzes: (newState.perfectQuizzes as number) ?? state.perfectQuizzes,
          subjectsMastered: 0,
        };

        const currentBadgeIds = new Set(state.unlockedBadgeIds);
        const newlyUnlocked: string[] = [];
        for (const b of allBadges) {
          if (!currentBadgeIds.has(b.id) && b.requirement(stats)) {
            newlyUnlocked.push(b.id);
          }
        }
        if (newlyUnlocked.length) {
          newState.unlockedBadgeIds = [...state.unlockedBadgeIds, ...newlyUnlocked];
        }

        set(newState);
        return { newBadges: newlyUnlocked };
      },

      resetProgress: () => set({ ...initialState, onboarded: false }),

      touchToday: () => {
        const state = get();
        const today = todayKey();
        if (state.dailyGoalDate !== today) {
          set({ dailyGoalDate: today, dailyProgress: 0 });
        }
      },
    }),
    {
      name: 'learnquest-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
