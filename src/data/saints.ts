import type { VirtueId } from './virtues';
import type { SinId } from './sins';

export type SaintId =
  | 'francis'
  | 'michael'
  | 'therese'
  | 'aquinas'
  | 'joseph'
  | 'mary'
  | 'augustine'
  | 'ignatius';

export interface UnlockCondition {
  type: 'virtueLevel' | 'questsCompleted' | 'firstConfession' | 'starter';
  virtueId?: VirtueId;
  level?: number;
  count?: number;
}

export interface SaintDef {
  id: SaintId;
  name: string;
  emoji: string;
  patronage: string;
  starter?: boolean;
  unlock: UnlockCondition;
  passive: {
    description: string;
    virtueBonus?: { virtueId: VirtueId; multiplier: number };
    sinDampen?: { sinId: SinId; multiplier: number };
  };
}

export const SAINTS: SaintDef[] = [
  {
    id: 'francis',
    name: 'St. Francis of Assisi',
    emoji: '\ud83d\udc26',
    patronage: 'Animals, ecology, peace',
    starter: true,
    unlock: { type: 'starter' },
    passive: {
      description: '+25% Patience XP from quests.',
      virtueBonus: { virtueId: 'patience', multiplier: 1.25 },
    },
  },
  {
    id: 'therese',
    name: 'St. Th\u00e9r\u00e8se of Lisieux',
    emoji: '\ud83c\udf39',
    patronage: 'Missions, florists, the \u201cLittle Way\u201d',
    starter: true,
    unlock: { type: 'starter' },
    passive: {
      description: '+25% Charity XP from quests.',
      virtueBonus: { virtueId: 'charity', multiplier: 1.25 },
    },
  },
  {
    id: 'aquinas',
    name: 'St. Thomas Aquinas',
    emoji: '\ud83d\udcd6',
    patronage: 'Students, theologians',
    starter: true,
    unlock: { type: 'starter' },
    passive: {
      description: '+25% Prudence XP from quests.',
      virtueBonus: { virtueId: 'prudence', multiplier: 1.25 },
    },
  },
  {
    id: 'michael',
    name: 'St. Michael the Archangel',
    emoji: '\u2694\ufe0f',
    patronage: 'Protection, spiritual warfare',
    unlock: { type: 'virtueLevel', virtueId: 'fortitude', level: 3 },
    passive: {
      description: 'Halves passive Pride temptation.',
      sinDampen: { sinId: 'pride', multiplier: 0.5 },
    },
  },
  {
    id: 'joseph',
    name: 'St. Joseph',
    emoji: '\ud83d\udd28',
    patronage: 'Workers, fathers',
    unlock: { type: 'virtueLevel', virtueId: 'diligence', level: 3 },
    passive: {
      description: '+20% Diligence XP from quests.',
      virtueBonus: { virtueId: 'diligence', multiplier: 1.2 },
    },
  },
  {
    id: 'augustine',
    name: 'St. Augustine',
    emoji: '\ud83d\udd4a\ufe0f',
    patronage: 'Converts, theologians',
    unlock: { type: 'questsCompleted', count: 10 },
    passive: {
      description: '+15% Faith and Hope XP from quests.',
      virtueBonus: { virtueId: 'faith', multiplier: 1.15 },
    },
  },
  {
    id: 'ignatius',
    name: 'St. Ignatius of Loyola',
    emoji: '\ud83d\udd25',
    patronage: 'Retreats, soldiers, discernment',
    unlock: { type: 'virtueLevel', virtueId: 'prudence', level: 5 },
    passive: {
      description: 'Halves passive Sloth temptation.',
      sinDampen: { sinId: 'sloth', multiplier: 0.5 },
    },
  },
  {
    id: 'mary',
    name: 'Blessed Virgin Mary',
    emoji: '\ud83d\udc51',
    patronage: 'Mother of God, Queen of Saints',
    unlock: { type: 'firstConfession' },
    passive: {
      description: '+10% XP to every virtue.',
    },
  },
];

export const SAINT_MAP: Record<SaintId, SaintDef> = Object.fromEntries(
  SAINTS.map((s) => [s.id, s]),
) as Record<SaintId, SaintDef>;

export const STARTER_SAINTS: SaintDef[] = SAINTS.filter((s) => s.starter);
