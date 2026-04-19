import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { colors } from '@/components/theme';

function tabIcon(emoji: string) {
  return ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Grove',
          tabBarIcon: tabIcon('\ud83c\udf3f'),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: tabIcon('\ud83d\udcdc'),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Soul',
          tabBarIcon: tabIcon('\ud83d\udc64'),
        }}
      />
      <Tabs.Screen
        name="saints"
        options={{
          title: 'Saints',
          tabBarIcon: tabIcon('\u2728'),
        }}
      />
      <Tabs.Screen
        name="sacraments"
        options={{
          title: 'Sacraments',
          tabBarIcon: tabIcon('\u271d\ufe0f'),
        }}
      />
    </Tabs>
  );
}
