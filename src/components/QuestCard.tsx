import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QuestDef } from '@/data/quests';
import { VIRTUE_MAP, type VirtueId } from '@/data/virtues';

import { colors, radius, spacing } from './theme';

interface Props {
  quest: QuestDef;
  completed: boolean;
  onComplete: () => void;
}

export function QuestCard({ quest, completed, onComplete }: Props) {
  const rewards = Object.entries(quest.virtueRewards) as [VirtueId, number][];
  return (
    <View style={[styles.card, completed && styles.cardDone]}>
      <Text style={[styles.title, completed && styles.textDone]}>{quest.title}</Text>
      <Text style={[styles.desc, completed && styles.textDone]}>{quest.description}</Text>
      <View style={styles.rewards}>
        {rewards.map(([vid, amt]) => (
          <View key={vid} style={styles.reward}>
            <Text style={styles.rewardEmoji}>{VIRTUE_MAP[vid].emoji}</Text>
            <Text style={styles.rewardText}>+{amt}</Text>
          </View>
        ))}
      </View>
      <Pressable
        disabled={completed}
        onPress={onComplete}
        style={[styles.btn, completed && styles.btnDone]}
      >
        <Text style={styles.btnText}>{completed ? 'Completed' : 'Mark done'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardDone: { opacity: 0.6 },
  title: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  desc: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
  textDone: { textDecorationLine: 'line-through' },
  rewards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  rewardEmoji: { fontSize: 14 },
  rewardText: { color: colors.gold, fontWeight: '700', fontSize: 12 },
  btn: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnDone: { backgroundColor: colors.border },
  btnText: { color: '#fff', fontWeight: '700' },
});
