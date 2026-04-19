import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SinMeter } from '@/components/SinMeter';
import { VirtueBar } from '@/components/VirtueBar';
import { colors, radius, spacing } from '@/components/theme';
import { SINS } from '@/data/sins';
import { VIRTUES, type VirtueFramework } from '@/data/virtues';
import { sanctityScore, usePlayerStore } from '@/store/usePlayerStore';

const FRAMEWORK_LABEL: Record<VirtueFramework, string> = {
  theological: 'Theological Virtues',
  cardinal: 'Cardinal Virtues',
  heavenly: 'Heavenly Virtues',
};

export default function CharacterScreen() {
  const { player, virtues, sins } = usePlayerStore();
  const sanctity = sanctityScore(virtues);

  const byFramework = (fw: VirtueFramework) =>
    VIRTUES.filter((v) => v.frameworks.includes(fw));

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.subtitle}>
            {`Sanctity ${sanctity} \u00b7 ${player.questsCompletedTotal} quests completed`}
          </Text>
        </View>

        {(['theological', 'cardinal', 'heavenly'] as VirtueFramework[]).map((fw) => (
          <View key={fw} style={styles.block}>
            <Text style={styles.sectionHeader}>{FRAMEWORK_LABEL[fw]}</Text>
            {byFramework(fw).map((v) => (
              <VirtueBar key={v.id} virtueId={v.id} stat={virtues[v.id]} />
            ))}
          </View>
        ))}

        <View style={styles.block}>
          <Text style={styles.sectionHeader}>Capital Sins</Text>
          {SINS.map((s) => (
            <SinMeter
              key={s.id}
              sinId={s.id}
              temptation={sins[s.id].temptation}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: 4 },
  block: { marginBottom: spacing.lg },
  sectionHeader: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
