import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SaintCard } from '@/components/SaintCard';
import { colors, spacing } from '@/components/theme';
import { SAINTS } from '@/data/saints';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function SaintsScreen() {
  const saintsUnlocked = usePlayerStore((s) => s.saintsUnlocked);
  const unlockedSet = new Set(saintsUnlocked);
  const unlockedCount = saintsUnlocked.length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>
          Communion of Saints ({unlockedCount}/{SAINTS.length})
        </Text>
        <Text style={styles.subtitle}>
          Saints walk beside you as you grow. Each grants a passive gift.
        </Text>
        <View style={styles.grid}>
          {SAINTS.map((s) => (
            <SaintCard key={s.id} saint={s} unlocked={unlockedSet.has(s.id)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: { color: colors.text, fontWeight: '800', fontSize: 18 },
  subtitle: { color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
