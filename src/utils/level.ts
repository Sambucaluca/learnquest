// XP required to reach level N (cumulative).
// Using a gently increasing curve: level N needs 100 * N * (N-1) / 2 ... simpler: base 100 with 50 per level.
export function xpForLevel(level: number): number {
  // XP required to reach this level from 0.
  // Level 1 = 0, Level 2 = 100, Level 3 = 250, Level 4 = 450, ...
  // Formula: 50 * (level - 1) * level
  return 50 * (level - 1) * level;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export function xpProgressInLevel(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number; // 0..1
} {
  const level = levelFromXp(xp);
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const progress = (xp - current) / (next - current);
  return { level, currentLevelXp: current, nextLevelXp: next, progress };
}

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  const diff = db.getTime() - da.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
