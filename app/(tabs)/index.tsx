import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/components/QuestCard';
import { VirtueBar } from '@/components/VirtueBar';
import { colors, radius, spacing } from '@/components/theme';
import { DAILY_QUESTS } from '@/data/quests';
import { aggregateLevel, topVirtues } from '@/game/progression';
import { averageTemptation } from '@/game/sinDecay';
import { checkNewlyUnlockable } from '@/game/saintUnlock';
import { sanctityScore, usePlayerStore } from '@/store/usePlayerStore';

export default function Dashboard() {
  const router = useRouter();
  const state = usePlayerStore();
  const {
    player,
    virtues,
    sins,
    completedQuestIds,
    nextQuestXpMultiplier,
  } = state;

  const sanctity = sanctityScore(virtues);
  const level = aggregateLevel(virtues);
  const temptation = averageTemptation(sins);
  const top = topVirtues(virtues, 3);

  const firstOpen = DAILY_QUESTS.find((q) => !completedQuestIds.includes(q.id));

  useEffect(() => {
    const candidates = checkNewlyUnlockable(state);
    if (candidates.length) {
      for (const id of candidates) state.unlockSaint(id);
    }
  }, [state]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Pax tecum, {player.name}.</Text>
          <View style={styles.statsRow}>
            <StatBlock label="Soul level" value={level.toString()} />
            <StatBlock label="Sanctity" value={sanctity.toString()} />
            <StatBlock label="Temptation" value={`${temptation}/100`} />
          </View>
          {nextQuestXpMultiplier > 1 ? (
            <View style={styles.blessing}>
              <Text style={styles.blessingText}>
                {'\u2728'} Communion blessing active: next quest earns +
                {Math.round((nextQuestXpMultiplier - 1) * 100)}% virtue XP.
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionHeader}>Strongest virtues</Text>
        {top.map(({ id, stat }) => (
          <VirtueBar key={id} virtueId={id} stat={stat} />
        ))}

        <View style={styles.sectionSpacer} />

        <Text style={styles.sectionHeader}>Next daily quest</Text>
        {firstOpen ? (
          <QuestCard
            quest={firstOpen}
            completed={false}
            onComplete={() => state.completeQuest(firstOpen.id)}
          />
        ) : (
          <View style={styles.doneCard}>
            <Text style={styles.doneText}>
              All daily quests completed. Deo gratias.
            </Text>
          </View>
        )}

        <Pressable
          onPress={() => router.push('/quests')}
          style={styles.moreBtn}
        >
          <Text style={styles.moreBtnText}>See all quests</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  hero: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.gold },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  blessing: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#fff7e6',
    borderRadius: radius.sm,
  },
  blessingText: { color: colors.gold, fontSize: 12, fontWeight: '600' },
  sectionHeader: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSpacer: { height: spacing.lg },
  doneCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  doneText: { color: colors.green, fontWeight: '700' },
  moreBtn: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
  },
  moreBtnText: { color: colors.gold, fontWeight: '700' },
});
