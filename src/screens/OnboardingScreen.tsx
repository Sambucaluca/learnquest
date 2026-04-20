import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';

const AVATARS = ['🦊', '🐼', '🦉', '🐨', '🦁', '🐯', '🐰', '🐵', '🦄', '🐺', '🐸', '🐻'];

export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const canContinue = name.trim().length >= 2;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Willkommen bei</Text>
          <Text style={styles.brand}>LearnQuest ⚔️</Text>
          <Text style={styles.subtitle}>
            Lerne jeden Tag etwas Neues. Sammle XP, steigere Level auf und werde zur Lern-Legende.
          </Text>
        </View>

        <Text style={styles.label}>Wie heißt du?</Text>
        <TextInput
          style={styles.input}
          placeholder="Dein Name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        <Text style={styles.label}>Wähle deinen Avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((a) => (
            <Pressable
              key={a}
              onPress={() => setAvatar(a)}
              style={[styles.avatarTile, avatar === a && styles.avatarTileActive]}
            >
              <Text style={styles.avatar}>{a}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Los geht's!"
            icon="🚀"
            disabled={!canContinue}
            onPress={() => completeOnboarding(name, avatar)}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  title: { ...typography.h3, color: colors.textMuted, fontWeight: '500' },
  brand: { fontSize: 40, fontWeight: '900', color: colors.primary, marginTop: 4 },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  label: {
    ...typography.small,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarTile: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarTileActive: {
    borderColor: colors.primary,
    backgroundColor: colors.bgElevated,
  },
  avatar: { fontSize: 30 },
});
