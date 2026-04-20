import React from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { colors, radius, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';
import { xpProgressInLevel } from '../utils/level';
import { badges as allBadges } from '../data/badges';

export function ProfileScreen() {
  const store = useStore();
  const { level, progress, currentLevelXp, nextLevelXp } = xpProgressInLevel(store.xp);

  const accuracy =
    store.totalAnswers > 0
      ? Math.round((store.correctAnswers / store.totalAnswers) * 100)
      : 0;

  const handleReset = () => {
    const doReset = () => store.resetProgress();
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Wirklich gesamten Fortschritt löschen?')) {
        doReset();
      }
    } else {
      Alert.alert(
        'Fortschritt zurücksetzen?',
        'Dein gesamter Fortschritt wird gelöscht. Das kann nicht rückgängig gemacht werden.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Löschen', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatar}>{store.avatar}</Text>
        </View>
        <Text style={typography.h1}>{store.username || 'Lerner'}</Text>
        <Text style={[typography.small, { marginTop: 4, color: colors.primary, fontWeight: '700' }]}>
          LEVEL {level}
        </Text>
        <View style={{ width: '100%', marginTop: spacing.md }}>
          <ProgressBar progress={progress} color={colors.primary} height={12} />
          <Text style={[typography.small, { marginTop: 6, textAlign: 'center' }]}>
            {store.xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP zum nächsten Level
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Statistiken</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Gesamt-XP" value={store.xp} color={colors.accent} />
        <StatCard label="Streak 🔥" value={store.streak} color={colors.danger} />
        <StatCard label="Quizze" value={store.quizzesCompleted} color={colors.primary} />
        <StatCard label="Perfekte Quizze" value={store.perfectQuizzes} color={colors.gold} />
        <StatCard label="Richtige Antworten" value={store.correctAnswers} color={colors.success} />
        <StatCard label="Trefferquote" value={`${accuracy}%`} color={colors.primary} />
      </View>

      <Text style={styles.sectionTitle}>
        Abzeichen ({store.unlockedBadgeIds.length}/{allBadges.length})
      </Text>
      <View style={styles.badgeGrid}>
        {allBadges.map((b) => {
          const unlocked = store.unlockedBadgeIds.includes(b.id);
          return (
            <View
              key={b.id}
              style={[styles.badgeTile, !unlocked && styles.badgeTileLocked]}
            >
              <Text style={[styles.badgeEmoji, !unlocked && { opacity: 0.3 }]}>
                {b.emoji}
              </Text>
              <Text
                style={[typography.small, { textAlign: 'center', fontWeight: '700' }, !unlocked && { color: colors.textMuted }]}
              >
                {b.name}
              </Text>
              <Text style={[styles.badgeDesc, !unlocked && { opacity: 0.7 }]}>
                {b.description}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Button
          title="Fortschritt zurücksetzen"
          variant="danger"
          icon="🗑️"
          onPress={handleReset}
        />
      </View>
    </Screen>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={typography.small}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  avatar: { fontSize: 48 },
  sectionTitle: { ...typography.h2, marginTop: spacing.lg, marginBottom: spacing.sm },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: { ...typography.h1, fontSize: 26 },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeTile: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gold + '66',
  },
  badgeTileLocked: {
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  badgeEmoji: { fontSize: 32, marginBottom: 4 },
  badgeDesc: {
    ...typography.small,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 2,
  },
});
