import { StyleSheet, Text, View } from 'react-native';

import type { SaintDef } from '@/data/saints';
import { describeUnlock } from '@/game/saintUnlock';

import { colors, radius, spacing } from './theme';

interface Props {
  saint: SaintDef;
  unlocked: boolean;
}

export function SaintCard({ saint, unlocked }: Props) {
  return (
    <View style={[styles.card, !unlocked && styles.locked]}>
      <Text style={styles.emoji}>{unlocked ? saint.emoji : '\ud83d\udd12'}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {unlocked ? saint.name : '???'}
      </Text>
      <Text style={styles.patronage} numberOfLines={2}>
        {unlocked ? saint.patronage : describeUnlock(saint)}
      </Text>
      {unlocked ? (
        <Text style={styles.passive}>{saint.passive.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    width: '48%',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  locked: { opacity: 0.55 },
  emoji: { fontSize: 36, marginBottom: spacing.sm },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  patronage: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  passive: {
    color: colors.gold,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
});
