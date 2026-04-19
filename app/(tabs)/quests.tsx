import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/components/QuestCard';
import { colors, radius, spacing } from '@/components/theme';
import { buildQuestList } from '@/game/questEngine';
import { checkNewlyUnlockable } from '@/game/saintUnlock';
import { usePlayerStore } from '@/store/usePlayerStore';

type Tab = 'daily' | 'monthly';

export default function QuestsScreen() {
  const state = usePlayerStore();
  const [tab, setTab] = useState<Tab>('daily');

  const list = buildQuestList(tab, state.completedQuestIds);

  useEffect(() => {
    const candidates = checkNewlyUnlockable(state);
    for (const id of candidates) state.unlockSaint(id);
  }, [state.completedQuestIds, state.player.questsCompletedTotal]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('daily')}
          style={[styles.tabBtn, tab === 'daily' && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === 'daily' && styles.tabTextActive]}>
            Daily
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('monthly')}
          style={[styles.tabBtn, tab === 'monthly' && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === 'monthly' && styles.tabTextActive]}>
            Monthly
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {list.map(({ def, completed }) => (
          <QuestCard
            key={def.id}
            quest={def}
            completed={completed}
            onComplete={() => state.completeQuest(def.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  tabText: { color: colors.text, fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  scroll: { padding: spacing.lg, paddingTop: 0 },
});
