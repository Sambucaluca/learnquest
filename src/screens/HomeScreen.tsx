import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { colors, radius, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';
import { xpProgressInLevel, todayKey } from '../utils/level';
import { subjects } from '../data/quizzes';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const username = useStore((s) => s.username);
  const avatar = useStore((s) => s.avatar);
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const dailyGoal = useStore((s) => s.dailyGoal);
  const dailyProgress = useStore((s) => s.dailyProgress);
  const dailyGoalDate = useStore((s) => s.dailyGoalDate);
  const touchToday = useStore((s) => s.touchToday);

  useEffect(() => {
    touchToday();
  }, [touchToday]);

  const { level, progress, nextLevelXp, currentLevelXp } = xpProgressInLevel(xp);
  const dailyPct =
    dailyGoalDate === todayKey() ? Math.min(1, dailyProgress / dailyGoal) : 0;
  const dailyShown = dailyGoalDate === todayKey() ? dailyProgress : 0;

  // Daily challenge: pick a deterministic subject for today.
  const todaySeed = todayKey()
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const challengeSubject = subjects[todaySeed % subjects.length];

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{avatar}</Text>
          </View>
          <View>
            <Text style={styles.hello}>Hi, {username} 👋</Text>
            <Text style={styles.level}>Level {level}</Text>
          </View>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakValue}>{streak}</Text>
        </View>
      </View>

      <Card style={styles.xpCard}>
        <View style={styles.row}>
          <Text style={typography.small}>FORTSCHRITT</Text>
          <Text style={styles.xpValue}>
            {xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP
          </Text>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <ProgressBar progress={progress} color={colors.primary} height={14} />
        </View>
        <Text style={styles.xpHint}>
          Noch {Math.max(0, nextLevelXp - xp)} XP bis Level {level + 1}
        </Text>
      </Card>

      <Card style={[styles.xpCard, { backgroundColor: colors.bgElevated }]}>
        <View style={styles.row}>
          <Text style={typography.h3}>Tagesziel 🎯</Text>
          <Text style={styles.xpValue}>
            {dailyShown} / {dailyGoal} XP
          </Text>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <ProgressBar progress={dailyPct} color={colors.accent} height={10} />
        </View>
        {dailyPct >= 1 ? (
          <Text style={[styles.xpHint, { color: colors.success }]}>
            🎉 Tagesziel erreicht! Du hältst deinen Streak.
          </Text>
        ) : (
          <Text style={styles.xpHint}>Halte deinen Streak und sammle XP!</Text>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Tägliche Challenge</Text>
      <Pressable
        onPress={() =>
          navigation.navigate('Quiz', { subjectId: challengeSubject.id, mode: 'daily' })
        }
      >
        <Card
          style={[
            styles.challengeCard,
            { backgroundColor: challengeSubject.color + '33', borderColor: challengeSubject.color },
          ]}
        >
          <Text style={styles.challengeEmoji}>{challengeSubject.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>{challengeSubject.name}</Text>
            <Text style={styles.challengeText}>5 Fragen · 2× XP Bonus</Text>
          </View>
          <Text style={styles.challengeArrow}>→</Text>
        </Card>
      </Pressable>

      <Text style={styles.sectionTitle}>Fächer</Text>
      {subjects.map((s) => (
        <Pressable
          key={s.id}
          onPress={() => navigation.navigate('Quiz', { subjectId: s.id, mode: 'normal' })}
          style={({ pressed }) => [pressed && { opacity: 0.85 }]}
        >
          <Card style={styles.subjectRow}>
            <View style={[styles.subjectIcon, { backgroundColor: s.color + '33' }]}>
              <Text style={styles.subjectEmoji}>{s.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>{s.name}</Text>
              <Text style={typography.small}>{s.description}</Text>
            </View>
            <Text style={styles.subjectArrow}>›</Text>
          </Card>
        </Pressable>
      ))}

      <View style={{ marginTop: spacing.md }}>
        <Button
          title="Zufalls-Quiz starten"
          icon="🎲"
          variant="secondary"
          onPress={() => navigation.navigate('Quiz', { subjectId: 'random', mode: 'random' })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: { fontSize: 26 },
  hello: { ...typography.h3 },
  level: { ...typography.small, color: colors.primary, fontWeight: '700' },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakEmoji: { fontSize: 18 },
  streakValue: { ...typography.h3, color: colors.accent },
  xpCard: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpValue: { ...typography.small, color: colors.text, fontWeight: '700' },
  xpHint: { ...typography.small, marginTop: spacing.sm },
  sectionTitle: {
    ...typography.h2,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  challengeEmoji: { fontSize: 38 },
  challengeText: { ...typography.small, marginTop: 4 },
  challengeArrow: { fontSize: 26, color: colors.text, fontWeight: '700' },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: spacing.sm,
  },
  subjectIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectEmoji: { fontSize: 28 },
  subjectArrow: { fontSize: 28, color: colors.textMuted },
});
