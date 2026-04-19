export type SacramentId = 'confession' | 'eucharist' | 'prayer';

export interface SacramentDef {
  id: SacramentId;
  name: string;
  emoji: string;
  description: string;
  cooldownHours: number;
}

export const SACRAMENTS: SacramentDef[] = [
  {
    id: 'confession',
    name: 'Confession',
    emoji: '\ud83d\udd52',
    description: 'Reduces every sin temptation meter substantially. Weekly cooldown.',
    cooldownHours: 24 * 7,
  },
  {
    id: 'eucharist',
    name: 'Holy Communion',
    emoji: '\ud83e\udd50',
    description: 'Grants a +50% virtue XP blessing on your next completed quest. Daily.',
    cooldownHours: 24,
  },
  {
    id: 'prayer',
    name: 'Simple Prayer',
    emoji: '\ud83d\ude4f',
    description: 'A moment of prayer. Small XP tick to Faith and Hope. Short cooldown.',
    cooldownHours: 1,
  },
];

export const SACRAMENT_MAP: Record<SacramentId, SacramentDef> = Object.fromEntries(
  SACRAMENTS.map((s) => [s.id, s]),
) as Record<SacramentId, SacramentDef>;
