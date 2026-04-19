import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/components/theme';
import { STARTER_SAINTS, type SaintId } from '@/data/saints';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function Onboarding() {
  const router = useRouter();
  const completeBaptism = usePlayerStore((s) => s.completeBaptism);
  const [name, setName] = useState('');
  const [patron, setPatron] = useState<SaintId | null>(null);

  const canContinue = name.trim().length > 0 && patron !== null;

  const onBaptize = () => {
    if (!canContinue || !patron) return;
    completeBaptism(name.trim(), patron);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>{'\u271d\ufe0f  Baptism'}</Text>
        <Text style={styles.lead}>
          Welcome, pilgrim. Take a name and choose a patron saint to walk beside
          you as you grow in virtue.
        </Text>

        <Text style={styles.label}>Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Anima"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Patron saint</Text>
        <View style={styles.saintGrid}>
          {STARTER_SAINTS.map((s) => {
            const selected = patron === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setPatron(s.id)}
                style={[styles.saintOpt, selected && styles.saintOptSelected]}
              >
                <Text style={styles.saintEmoji}>{s.emoji}</Text>
                <Text style={styles.saintName}>{s.name}</Text>
                <Text style={styles.saintPassive}>{s.passive.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={onBaptize}
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
        >
          <Text style={styles.ctaText}>Begin the journey</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lead: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  saintGrid: { gap: spacing.md },
  saintOpt: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
  },
  saintOptSelected: { borderColor: colors.gold, backgroundColor: '#fff7e6' },
  saintEmoji: { fontSize: 32, marginBottom: spacing.xs },
  saintName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  saintPassive: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.gold,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: colors.border },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
