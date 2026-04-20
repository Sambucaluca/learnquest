import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors, radius, spacing, typography } from '../theme';
import { fakeLeaderboard, LeaderboardEntry } from '../data/leaderboard';
import { useStore } from '../store/useStore';

export function LeaderboardScreen() {
  const xp = useStore((s) => s.xp);
  const username = useStore((s) => s.username);
  const avatar = useStore((s) => s.avatar);

  const entries = useMemo<LeaderboardEntry[]>(() => {
    const you: LeaderboardEntry = {
      id: 'you',
      name: username || 'Du',
      avatar,
      xp,
      isYou: true,
    };
    return [...fakeLeaderboard, you]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 15);
  }, [xp, username, avatar]);

  const yourRank = entries.findIndex((e) => e.isYou) + 1;

  return (
    <Screen>
      <Text style={typography.h1}>Bestenliste 🏆</Text>
      <Text style={[typography.small, { marginTop: 4 }]}>
        Du bist aktuell auf Platz {yourRank || '—'}
      </Text>

      <View style={{ marginTop: spacing.md, gap: 8 }}>
        {entries.map((e, i) => {
          const rank = i + 1;
          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
          return (
            <Card
              key={e.id}
              style={e.isYou ? [styles.row, styles.rowMe] : styles.row}
            >
              <Text style={styles.rank}>{medal ?? `${rank}.`}</Text>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatar}>{e.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.body, { fontWeight: '700' }]}>
                  {e.name}
                  {e.isYou ? '  · du' : ''}
                </Text>
                <Text style={typography.small}>{e.xp} XP</Text>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  rowMe: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  rank: {
    width: 34,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { fontSize: 22 },
});
