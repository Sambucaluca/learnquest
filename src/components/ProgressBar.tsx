import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  progress: number; // 0..1
  color?: string;
  height?: number;
  trackColor?: string;
};

export function ProgressBar({
  progress,
  color = colors.primary,
  height = 10,
  trackColor = colors.border,
}: Props) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${pct * 100}%`,
          height,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.sm,
  },
});
