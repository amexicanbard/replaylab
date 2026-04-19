import { SINS, type SinId } from '@/data/sins';
import type { PlayerState } from '@/store/usePlayerStore';

export function averageTemptation(sins: PlayerState['sins']): number {
  let total = 0;
  for (const s of SINS) total += sins[s.id].temptation;
  return Math.round(total / SINS.length);
}

export function dominantSins(sins: PlayerState['sins'], n: number): { id: SinId; temptation: number }[] {
  return SINS.map((s) => ({ id: s.id, temptation: sins[s.id].temptation }))
    .sort((a, b) => b.temptation - a.temptation)
    .slice(0, n);
}
