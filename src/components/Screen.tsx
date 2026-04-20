import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export function Screen({ children, scroll = true, style, padded = true }: Props) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[padded && styles.padded, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padded, style]}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: { flex: 1 },
  padded: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});
