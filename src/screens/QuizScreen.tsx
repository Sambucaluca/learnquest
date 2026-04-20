import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { colors, radius, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';
import { Question, getSubject, getAllQuestions, subjects } from '../data/quizzes';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizRoute = RouteProp<RootStackParamList, 'Quiz'>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUIZ_LENGTH = 5;

export function QuizScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<QuizRoute>();
  const { subjectId, mode } = route.params;

  const recordAnswer = useStore((s) => s.recordAnswer);
  const completeQuiz = useStore((s) => s.completeQuiz);

  const subject = useMemo(() => {
    if (subjectId === 'random') return undefined;
    return getSubject(subjectId);
  }, [subjectId]);

  const questions = useMemo<Question[]>(() => {
    const pool =
      subjectId === 'random' ? getAllQuestions() : subject?.questions ?? getAllQuestions();
    return shuffle(pool).slice(0, QUIZ_LENGTH);
  }, [subjectId, subject]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (optIndex: number) => {
    if (locked) return;
    setSelected(optIndex);
    setLocked(true);
    const isCorrect = optIndex === q.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);
    recordAnswer(isCorrect);
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex(index + 1);
      setSelected(null);
      setLocked(false);
    } else {
      const baseXp = correctCount * 10;
      const multiplier = mode === 'daily' ? 2 : 1;
      const bonus = correctCount === questions.length ? 20 : 0;
      const xpGained = baseXp * multiplier + bonus;
      const { newBadges } = completeQuiz({
        subjectId: subject?.id ?? 'mixed',
        correct: correctCount,
        total: questions.length,
        xpGained,
        completedAt: Date.now(),
      });
      navigation.replace('Result', {
        correct: correctCount,
        total: questions.length,
        xpGained,
        subjectName: subject?.name ?? 'Gemischt',
        newBadges,
      });
    }
  };

  if (!q) {
    return (
      <Screen>
        <Text style={typography.body}>Keine Fragen verfügbar.</Text>
      </Screen>
    );
  }

  const progress = (index + (locked ? 1 : 0)) / questions.length;
  const headerColor = subject?.color ?? colors.primary;

  return (
    <Screen padded>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar progress={progress} color={headerColor} height={10} />
        </View>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {index + 1}/{questions.length}
          </Text>
        </View>
      </View>

      {mode === 'daily' ? (
        <View style={styles.badgeRow}>
          <Text style={styles.bonusBadge}>⚡ 2× XP Bonus</Text>
        </View>
      ) : null}

      <Text style={styles.subject}>
        {subject ? `${subject.emoji}  ${subject.name}` : '🎲  Gemischtes Quiz'}
      </Text>

      <Card style={styles.questionCard}>
        <Text style={styles.question}>{q.question}</Text>
      </Card>

      <View style={{ gap: 10, marginTop: spacing.md }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctIndex;
          const showCorrect = locked && isCorrect;
          const showWrong = locked && isSelected && !isCorrect;

          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              disabled={locked}
              style={[
                styles.option,
                isSelected && !locked && styles.optionSelected,
                showCorrect && styles.optionCorrect,
                showWrong && styles.optionWrong,
              ]}
            >
              <View
                style={[
                  styles.optionBullet,
                  showCorrect && { backgroundColor: colors.success },
                  showWrong && { backgroundColor: colors.danger },
                ]}
              >
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={styles.optionText}>{opt}</Text>
              {showCorrect ? <Text style={styles.resultMark}>✓</Text> : null}
              {showWrong ? <Text style={styles.resultMark}>✗</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {locked && q.explanation ? (
        <Card style={styles.explanation}>
          <Text style={typography.small}>💡 {q.explanation}</Text>
        </Card>
      ) : null}

      <View style={{ marginTop: spacing.lg }}>
        <Button
          title={isLast ? 'Quiz abschließen' : 'Weiter'}
          icon={isLast ? '🏁' : undefined}
          onPress={handleNext}
          disabled={!locked}
          variant={
            locked
              ? selected === q.correctIndex
                ? 'success'
                : 'danger'
              : 'primary'
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.card,
  },
  closeText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  counter: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
  },
  counterText: { ...typography.small, color: colors.text, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bonusBadge: {
    color: colors.accent,
    fontWeight: '700',
    backgroundColor: '#FFB54722',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  subject: {
    ...typography.small,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionCard: {
    backgroundColor: colors.bgElevated,
    padding: spacing.lg,
  },
  question: { ...typography.h2, lineHeight: 30 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: '#3DDC8422',
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: '#FF5A6B22',
  },
  optionBullet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: { color: colors.text, fontWeight: '700' },
  optionText: { ...typography.body, flex: 1 },
  resultMark: { color: colors.text, fontSize: 20, fontWeight: '800' },
  explanation: {
    marginTop: spacing.md,
    backgroundColor: colors.bgElevated,
  },
});
