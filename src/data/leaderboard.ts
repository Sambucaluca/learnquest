export type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  isYou?: boolean;
};

export const fakeLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Mia K.', avatar: '🦊', xp: 3480 },
  { id: '2', name: 'Jonas B.', avatar: '🐼', xp: 2910 },
  { id: '3', name: 'Lea S.', avatar: '🦉', xp: 2650 },
  { id: '4', name: 'Tim M.', avatar: '🐨', xp: 2100 },
  { id: '5', name: 'Nina W.', avatar: '🦁', xp: 1780 },
  { id: '6', name: 'Paul H.', avatar: '🐯', xp: 1440 },
  { id: '7', name: 'Emma R.', avatar: '🐰', xp: 1150 },
  { id: '8', name: 'Felix D.', avatar: '🐵', xp: 920 },
  { id: '9', name: 'Sara L.', avatar: '🦄', xp: 720 },
  { id: '10', name: 'Max T.', avatar: '🐺', xp: 540 },
  { id: '11', name: 'Anna P.', avatar: '🐸', xp: 380 },
  { id: '12', name: 'Luis F.', avatar: '🐻', xp: 210 },
];
