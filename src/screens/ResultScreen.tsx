import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';
import { badges as allBadges } from '../data/badges';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type R = RouteProp<RootStackParamList, 'Result'>;

export function ResultScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const { correct, total, xpGained, subjectName, newBadges } = route.params;

  const perfect = correct === total;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const { title, emoji, message } = perfect
    ? {
        emoji: '🏆',
        title: 'Perfekt!',
        message: `Du hast alle ${total} Fragen richtig beantwortet. Unglaublich!`,
      }
    : correct >= Math.ceil(total * 0.6)
      ? {
          emoji: '🎉',
          title: 'Gut gemacht!',
          message: `Du hast ${correct} von ${total} Fragen richtig beantwortet.`,
        }
      : {
          emoji: '💪',
          title: 'Weiter so!',
          message: `Du hast ${correct} von ${total} Fragen richtig. Beim nächsten Mal schaffst du mehr!`,
        };

  const unlockedDetails = newBadges
    .map((id) => allBadges.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{correct}/{total}</Text>
          <Text style={styles.statLabel}>Richtig</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.accent }]}>+{xpGained}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Trefferquote</Text>
        </Card>
      </View>

      <Card style={styles.subjectCard}>
        <Text style={typography.small}>Fach</Text>
        <Text style={typography.h3}>{subjectName}</Text>
      </Card>

      {unlockedDetails.length > 0 ? (
        <View style={{ marginTop: spacing.md }}>
          <Text style={typography.h2}>🎖️ Neue Abzeichen</Text>
          {unlockedDetails.map((b) => (
            <Card key={b.id} style={styles.badgeCard}>
              <Text style={styles.badgeEmoji}>{b.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{b.name}</Text>
                <Text style={typography.small}>{b.description}</Text>
              </View>
            </Card>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Button
          title="Nochmal spielen"
          icon="🔁"
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Zurück zur Übersicht"
          variant="secondary"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  heroEmoji: { fontSize: 64, marginBottom: 8 },
  title: { ...typography.h1, fontSize: 32 },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: { ...typography.h1, fontSize: 26 },
  statLabel: { ...typography.small, marginTop: 4 },
  subjectCard: {
    marginTop: spacing.md,
    flexDirection: 'column',
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: spacing.sm,
    borderColor: colors.gold,
    backgroundColor: '#FFD23F22',
  },
  badgeEmoji: { fontSize: 38 },
});
