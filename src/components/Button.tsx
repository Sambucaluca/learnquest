import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { colors, radius } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  icon?: string;
  fullWidth?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  icon,
  fullWidth = true,
}: Props) {
  const variantStyle = variantStyles[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        fullWidth && { alignSelf: 'stretch' },
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon ? <Text style={[styles.icon, variantStyle.text]}>{icon}</Text> : null}
        <Text style={[styles.text, variantStyle.text]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    fontSize: 18,
  },
});

const variantStyles: Record<Variant, { container: ViewStyle; text: { color: string } }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: '#fff' },
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.text },
  },
  success: {
    container: { backgroundColor: colors.success },
    text: { color: '#0B2D1A' },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    text: { color: '#fff' },
  },
};
