import { StyleSheet, Text, View } from 'react-native';

import { VIRTUE_MAP, type VirtueId } from '@/data/virtues';
import { levelProgressPct } from '@/game/progression';
import type { VirtueStat } from '@/store/usePlayerStore';

import { colors, radius, spacing } from './theme';

interface Props {
  virtueId: VirtueId;
  stat: VirtueStat;
}

export function VirtueBar({ virtueId, stat }: Props) {
  const def = VIRTUE_MAP[virtueId];
  const pct = levelProgressPct(stat);
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{def.emoji}</Text>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.name}>{def.name}</Text>
          <Text style={styles.level}>Lv {stat.level}</Text>
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
  emoji: { fontSize: 26, width: 32, textAlign: 'center' },
  body: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: { color: colors.text, fontWeight: '600', fontSize: 15 },
  level: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  barTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
});
