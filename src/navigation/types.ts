export type RootStackParamList = {
  Tabs: undefined;
  Quiz: { subjectId: string; mode: 'normal' | 'daily' | 'random' };
  Result: {
    correct: number;
    total: number;
    xpGained: number;
    subjectName: string;
    newBadges: string[];
  };
};
