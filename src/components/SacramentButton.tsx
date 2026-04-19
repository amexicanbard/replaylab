import dayjs from 'dayjs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SacramentDef } from '@/data/sacraments';

import { colors, radius, spacing } from './theme';

interface Props {
  sacrament: SacramentDef;
  lastUsed: string | undefined;
  onUse: () => void;
}

export function SacramentButton({ sacrament, lastUsed, onUse }: Props) {
  const hoursSince = lastUsed ? dayjs().diff(dayjs(lastUsed), 'hour', true) : Infinity;
  const ready = hoursSince >= sacrament.cooldownHours;
  const remaining = Math.max(0, sacrament.cooldownHours - hoursSince);
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{sacrament.emoji}</Text>
      <View style={styles.body}>
        <Text style={styles.name}>{sacrament.name}</Text>
        <Text style={styles.desc}>{sacrament.description}</Text>
        <Text style={styles.status}>
          {ready ? 'Ready' : `Cooldown: ${formatHours(remaining)}`}
        </Text>
      </View>
      <Pressable
        disabled={!ready}
        onPress={onUse}
        style={[styles.btn, !ready && styles.btnDisabled]}
      >
        <Text style={styles.btnText}>{ready ? 'Receive' : 'Wait'}</Text>
      </Pressable>
    </View>
  );
}

function formatHours(hours: number): string {
  if (hours >= 24) return `${Math.ceil(hours / 24)}d`;
  if (hours >= 1) return `${Math.ceil(hours)}h`;
  return `${Math.ceil(hours * 60)}m`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  emoji: { fontSize: 36 },
  body: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  desc: { color: colors.textMuted, fontSize: 12, marginVertical: 4 },
  status: { color: colors.gold, fontSize: 11, fontWeight: '600' },
  btn: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  btnDisabled: { backgroundColor: colors.border },
  btnText: { color: '#fff', fontWeight: '700' },
});
