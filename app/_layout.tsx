import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/components/theme';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function RootLayout() {
  const hydrated = usePlayerStore((s) => s.hydrated);
  const onboarded = usePlayerStore((s) => s.onboarded);
  const rolloverIfNeeded = usePlayerStore((s) => s.rolloverIfNeeded);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (hydrated) rolloverIfNeeded();
  }, [hydrated, rolloverIfNeeded]);

  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0];
    if (!onboarded && first !== 'onboarding') {
      router.replace('/onboarding');
    } else if (onboarded && first === 'onboarding') {
      router.replace('/');
    }
  }, [hydrated, onboarded, segments, router]);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
