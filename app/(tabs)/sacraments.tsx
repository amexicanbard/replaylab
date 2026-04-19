import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SacramentButton } from '@/components/SacramentButton';
import { colors, radius, spacing } from '@/components/theme';
import { SACRAMENTS } from '@/data/sacraments';
import { checkNewlyUnlockable } from '@/game/saintUnlock';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function SacramentsScreen() {
  const state = usePlayerStore();
  const [flash, setFlash] = useState<string | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => tick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const candidates = checkNewlyUnlockable(state);
    for (const id of candidates) state.unlockSaint(id);
  }, [state.player.timesConfessed]);

  const handle = (id: string, name: string) => {
    const ok = state.useSacrament(id as never);
    setFlash(ok ? `Received: ${name}` : `${name} is still on cooldown.`);
    setTimeout(() => setFlash(null), 2500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>The Sacraments</Text>
        <Text style={styles.subtitle}>
          Channels of grace. Confession purges sin; Communion blesses your next
          quest; Prayer refreshes Faith and Hope.
        </Text>
        {flash ? (
          <View style={styles.flash}>
            <Text style={styles.flashText}>{flash}</Text>
          </View>
        ) : null}
        {SACRAMENTS.map((s) => (
          <SacramentButton
            key={s.id}
            sacrament={s}
            lastUsed={state.sacramentLastUsed[s.id]}
            onUse={() => handle(s.id, s.name)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: { color: colors.text, fontWeight: '800', fontSize: 18 },
  subtitle: { color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  flash: {
    backgroundColor: '#fff7e6',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  flashText: { color: colors.gold, fontWeight: '700' },
});
