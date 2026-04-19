import { VIRTUES, type VirtueId } from '@/data/virtues';
import type { PlayerState, VirtueStat } from '@/store/usePlayerStore';
import { xpToNext } from '@/store/usePlayerStore';

export function levelProgressPct(stat: VirtueStat): number {
  const needed = xpToNext(stat.level);
  if (needed <= 0) return 0;
  return Math.min(100, (stat.xp / needed) * 100);
}

export function topVirtues(
  virtues: PlayerState['virtues'],
  n: number,
): { id: VirtueId; stat: VirtueStat }[] {
  return VIRTUES.map((v) => ({ id: v.id, stat: virtues[v.id] }))
    .sort(
      (a, b) =>
        b.stat.level - a.stat.level ||
        b.stat.xp - a.stat.xp,
    )
    .slice(0, n);
}

export function aggregateLevel(virtues: PlayerState['virtues']): number {
  let sum = 0;
  for (const v of VIRTUES) sum += virtues[v.id].level;
  return Math.floor(sum / VIRTUES.length);
}
