import { StyleSheet, Text, View } from 'react-native';

import { SIN_MAP, type SinId } from '@/data/sins';

import { colors, radius, spacing } from './theme';

interface Props {
  sinId: SinId;
  temptation: number;
}

export function SinMeter({ sinId, temptation }: Props) {
  const def = SIN_MAP[sinId];
  const pct = Math.max(0, Math.min(100, temptation));
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{def.emoji}</Text>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.name}>{def.name}</Text>
          <Text style={styles.val}>{pct}</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  emoji: { fontSize: 22, width: 28, textAlign: 'center' },
  body: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: { color: colors.text, fontWeight: '600', fontSize: 14 },
  val: { color: colors.crimson, fontWeight: '700', fontSize: 13 },
  barTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.crimson,
  },
});
