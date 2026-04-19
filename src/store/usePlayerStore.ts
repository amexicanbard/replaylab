import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { VIRTUES, type VirtueId } from '@/data/virtues';
import { SINS, type SinId } from '@/data/sins';
import { SAINTS, STARTER_SAINTS, type SaintId } from '@/data/saints';
import { DAILY_QUESTS, MONTHLY_QUESTS, QUEST_MAP } from '@/data/quests';
import { SACRAMENTS, type SacramentId } from '@/data/sacraments';

export interface VirtueStat {
  xp: number;
  level: number;
}

export interface SinStat {
  temptation: number;
}

export interface Player {
  name: string;
  patronSaintId: SaintId | null;
  createdAt: string;
  questsCompletedTotal: number;
  timesConfessed: number;
}

export interface PlayerState {
  hydrated: boolean;
  onboarded: boolean;
  player: Player;
  virtues: Record<VirtueId, VirtueStat>;
  sins: Record<SinId, SinStat>;
  saintsUnlocked: SaintId[];
  completedQuestIds: string[];
  lastDailyReset: string;
  lastMonthlyReset: string;
  sacramentLastUsed: Partial<Record<SacramentId, string>>;
  nextQuestXpMultiplier: number;

  completeBaptism: (name: string, patronSaintId: SaintId) => void;
  completeQuest: (questId: string) => void;
  useSacrament: (id: SacramentId) => boolean;
  unlockSaint: (id: SaintId) => void;
  rolloverIfNeeded: () => void;
  resetProgress: () => void;
}

export function xpToNext(level: number): number {
  return 100 * level;
}

function emptyVirtues(): Record<VirtueId, VirtueStat> {
  return VIRTUES.reduce(
    (acc, v) => {
      acc[v.id] = { xp: 0, level: 1 };
      return acc;
    },
    {} as Record<VirtueId, VirtueStat>,
  );
}

function emptySins(): Record<SinId, SinStat> {
  return SINS.reduce(
    (acc, s) => {
      acc[s.id] = { temptation: 10 };
      return acc;
    },
    {} as Record<SinId, SinStat>,
  );
}

function initialState(): Omit<
  PlayerState,
  'completeBaptism' | 'completeQuest' | 'useSacrament' | 'unlockSaint' | 'rolloverIfNeeded' | 'resetProgress'
> {
  return {
    hydrated: false,
    onboarded: false,
    player: {
      name: '',
      patronSaintId: null,
      createdAt: dayjs().toISOString(),
      questsCompletedTotal: 0,
      timesConfessed: 0,
    },
    virtues: emptyVirtues(),
    sins: emptySins(),
    saintsUnlocked: [],
    completedQuestIds: [],
    lastDailyReset: dayjs().format('YYYY-MM-DD'),
    lastMonthlyReset: dayjs().format('YYYY-MM'),
    sacramentLastUsed: {},
    nextQuestXpMultiplier: 1,
  };
}

const CONFESSION_SIN_REDUCTION = 35;

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      completeBaptism: (name, patronSaintId) => {
        set((s) => ({
          onboarded: true,
          player: { ...s.player, name, patronSaintId },
          saintsUnlocked: Array.from(new Set([...s.saintsUnlocked, patronSaintId])),
        }));
      },

      completeQuest: (questId) => {
        const state = get();
        const quest = QUEST_MAP[questId];
        if (!quest) return;
        if (state.completedQuestIds.includes(questId)) return;

        const multiplier = state.nextQuestXpMultiplier;
        const patronBonus = getPatronVirtueBonuses(state.saintsUnlocked);

        const virtues = { ...state.virtues };
        for (const [vid, baseXp] of Object.entries(quest.virtueRewards) as [VirtueId, number][]) {
          const saintMult = patronBonus.virtues[vid] ?? 1;
          const gained = Math.round(baseXp * multiplier * saintMult);
          const current = virtues[vid];
          let xp = current.xp + gained;
          let level = current.level;
          while (xp >= xpToNext(level)) {
            xp -= xpToNext(level);
            level += 1;
          }
          virtues[vid] = { xp, level };
        }

        const sins = { ...state.sins };
        if (quest.sinReduction) {
          for (const [sid, amt] of Object.entries(quest.sinReduction) as [SinId, number][]) {
            sins[sid] = { temptation: Math.max(0, sins[sid].temptation - amt) };
          }
        }

        set({
          virtues,
          sins,
          completedQuestIds: [...state.completedQuestIds, questId],
          nextQuestXpMultiplier: 1,
          player: {
            ...state.player,
            questsCompletedTotal: state.player.questsCompletedTotal + 1,
          },
        });
      },

      useSacrament: (id) => {
        const state = get();
        const def = SACRAMENTS.find((s) => s.id === id);
        if (!def) return false;

        const last = state.sacramentLastUsed[id];
        if (last) {
          const hoursSince = dayjs().diff(dayjs(last), 'hour', true);
          if (hoursSince < def.cooldownHours) return false;
        }

        if (id === 'confession') {
          const sins = { ...state.sins };
          for (const sid of Object.keys(sins) as SinId[]) {
            sins[sid] = { temptation: Math.max(0, sins[sid].temptation - CONFESSION_SIN_REDUCTION) };
          }
          set({
            sins,
            sacramentLastUsed: { ...state.sacramentLastUsed, confession: dayjs().toISOString() },
            player: { ...state.player, timesConfessed: state.player.timesConfessed + 1 },
          });
          return true;
        }

        if (id === 'eucharist') {
          set({
            nextQuestXpMultiplier: 1.5,
            sacramentLastUsed: { ...state.sacramentLastUsed, eucharist: dayjs().toISOString() },
          });
          return true;
        }

        if (id === 'prayer') {
          const virtues = { ...state.virtues };
          for (const vid of ['faith', 'hope'] as VirtueId[]) {
            const current = virtues[vid];
            let xp = current.xp + 5;
            let level = current.level;
            while (xp >= xpToNext(level)) {
              xp -= xpToNext(level);
              level += 1;
            }
            virtues[vid] = { xp, level };
          }
          set({
            virtues,
            sacramentLastUsed: { ...state.sacramentLastUsed, prayer: dayjs().toISOString() },
          });
          return true;
        }

        return false;
      },

      unlockSaint: (id) => {
        set((s) => ({
          saintsUnlocked: s.saintsUnlocked.includes(id)
            ? s.saintsUnlocked
            : [...s.saintsUnlocked, id],
        }));
      },

      rolloverIfNeeded: () => {
        const state = get();
        const todayKey = dayjs().format('YYYY-MM-DD');
        const monthKey = dayjs().format('YYYY-MM');

        const dailyChanged = state.lastDailyReset !== todayKey;
        const monthlyChanged = state.lastMonthlyReset !== monthKey;

        if (!dailyChanged && !monthlyChanged) return;

        let completedQuestIds = state.completedQuestIds;

        if (dailyChanged) {
          const dailyIds = new Set(DAILY_QUESTS.map((q) => q.id));
          completedQuestIds = completedQuestIds.filter((id) => !dailyIds.has(id));
        }
        if (monthlyChanged) {
          const monthlyIds = new Set(MONTHLY_QUESTS.map((q) => q.id));
          completedQuestIds = completedQuestIds.filter((id) => !monthlyIds.has(id));
        }

        const sins = { ...state.sins };
        if (dailyChanged) {
          const daysPassed = Math.max(1, dayjs(todayKey).diff(dayjs(state.lastDailyReset), 'day'));
          const patronBonus = getPatronVirtueBonuses(state.saintsUnlocked);
          for (const sid of Object.keys(sins) as SinId[]) {
            const dampen = patronBonus.sinDampen[sid] ?? 1;
            const rise = Math.round(2 * daysPassed * dampen);
            sins[sid] = { temptation: Math.min(100, sins[sid].temptation + rise) };
          }
        }

        set({
          completedQuestIds,
          sins,
          lastDailyReset: todayKey,
          lastMonthlyReset: monthKey,
        });
      },

      resetProgress: () => {
        set({ ...initialState(), hydrated: true });
      },
    }),
    {
      name: 'melodic-grove-player-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { hydrated: _h, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

interface PatronBonus {
  virtues: Partial<Record<VirtueId, number>>;
  sinDampen: Partial<Record<SinId, number>>;
}

function getPatronVirtueBonuses(unlocked: SaintId[]): PatronBonus {
  const virtues: Record<string, number> = {};
  const sinDampen: Record<string, number> = {};
  for (const sid of unlocked) {
    const def = SAINTS.find((s) => s.id === sid);
    if (!def) continue;
    const bonus = def.passive.virtueBonus;
    if (bonus) {
      virtues[bonus.virtueId] = (virtues[bonus.virtueId] ?? 1) * bonus.multiplier;
    }
    const dampen = def.passive.sinDampen;
    if (dampen) {
      sinDampen[dampen.sinId] = (sinDampen[dampen.sinId] ?? 1) * dampen.multiplier;
    }
    if (sid === 'mary') {
      for (const v of VIRTUES) {
        virtues[v.id] = (virtues[v.id] ?? 1) * 1.1;
      }
    }
  }
  return { virtues, sinDampen };
}

export { getPatronVirtueBonuses };

export function sanctityScore(virtues: Record<VirtueId, VirtueStat>): number {
  let total = 0;
  for (const v of VIRTUES) {
    total += (virtues[v.id].level - 1) * 100 + virtues[v.id].xp;
  }
  return total;
}
