import { SAINTS, type SaintDef, type SaintId } from '@/data/saints';
import type { PlayerState } from '@/store/usePlayerStore';

export function checkNewlyUnlockable(state: PlayerState): SaintId[] {
  const unlockedSet = new Set(state.saintsUnlocked);
  const out: SaintId[] = [];
  for (const saint of SAINTS) {
    if (unlockedSet.has(saint.id)) continue;
    if (meetsUnlock(saint, state)) out.push(saint.id);
  }
  return out;
}

function meetsUnlock(saint: SaintDef, state: PlayerState): boolean {
  const cond = saint.unlock;
  switch (cond.type) {
    case 'starter':
      return false;
    case 'virtueLevel': {
      if (!cond.virtueId || cond.level == null) return false;
      return state.virtues[cond.virtueId].level >= cond.level;
    }
    case 'questsCompleted':
      return state.player.questsCompletedTotal >= (cond.count ?? 0);
    case 'firstConfession':
      return state.player.timesConfessed >= 1;
    default:
      return false;
  }
}

export function describeUnlock(saint: SaintDef): string {
  const cond = saint.unlock;
  switch (cond.type) {
    case 'starter':
      return 'Starter patron.';
    case 'virtueLevel':
      return `Reach ${cond.virtueId} level ${cond.level}.`;
    case 'questsCompleted':
      return `Complete ${cond.count} quests.`;
    case 'firstConfession':
      return 'Go to Confession.';
    default:
      return '';
  }
}
