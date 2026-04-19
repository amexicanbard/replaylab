import type { VirtueId } from './virtues';
import type { SinId } from './sins';

export type QuestCadence = 'daily' | 'monthly';

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  cadence: QuestCadence;
  virtueRewards: Partial<Record<VirtueId, number>>;
  sinReduction?: Partial<Record<SinId, number>>;
}

export const DAILY_QUESTS: QuestDef[] = [
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    description: 'Offer the day\u2019s work, joys, and sufferings to God upon waking.',
    cadence: 'daily',
    virtueRewards: { faith: 15, humility: 5 },
  },
  {
    id: 'examen',
    title: 'Examination of Conscience',
    description: 'Review the day before sleep; name sins, thank God for graces.',
    cadence: 'daily',
    virtueRewards: { prudence: 10, humility: 10 },
    sinReduction: { pride: 3 },
  },
  {
    id: 'rosary-decade',
    title: 'Pray a Decade of the Rosary',
    description: 'One Our Father, ten Hail Marys, one Glory Be.',
    cadence: 'daily',
    virtueRewards: { faith: 10, hope: 10, patience: 5 },
  },
  {
    id: 'corporal-mercy',
    title: 'A Corporal Work of Mercy',
    description: 'Feed the hungry, give drink, clothe the naked, shelter, visit, bury, or ransom.',
    cadence: 'daily',
    virtueRewards: { charity: 20, kindness: 10 },
    sinReduction: { greed: 5, envy: 3 },
  },
  {
    id: 'fast-sweets',
    title: 'Fast from Sweets',
    description: 'Refuse one legitimate pleasure today as an offering.',
    cadence: 'daily',
    virtueRewards: { temperance: 15, fortitude: 5 },
    sinReduction: { gluttony: 5, lust: 2 },
  },
  {
    id: 'scripture',
    title: 'Read Sacred Scripture',
    description: 'Read at least one chapter of the Bible prayerfully.',
    cadence: 'daily',
    virtueRewards: { faith: 10, prudence: 5 },
  },
  {
    id: 'silent-prayer',
    title: 'Ten Minutes of Silent Prayer',
    description: 'Sit in silence before the Lord. Listen.',
    cadence: 'daily',
    virtueRewards: { patience: 10, hope: 10 },
    sinReduction: { sloth: 3 },
  },
  {
    id: 'kind-word',
    title: 'A Kind Word to Someone Difficult',
    description: 'Speak encouragingly to a person you find hard to love.',
    cadence: 'daily',
    virtueRewards: { kindness: 15, charity: 5, humility: 5 },
    sinReduction: { wrath: 5, envy: 3 },
  },
  {
    id: 'honest-work',
    title: 'Honest Day\u2019s Work',
    description: 'Give full attention to duty without cutting corners.',
    cadence: 'daily',
    virtueRewards: { diligence: 15, justice: 10 },
    sinReduction: { sloth: 5 },
  },
  {
    id: 'guard-tongue',
    title: 'Guard the Tongue',
    description: 'Refrain from gossip, complaint, and contempt all day.',
    cadence: 'daily',
    virtueRewards: { temperance: 10, humility: 10, charity: 5 },
    sinReduction: { pride: 3, wrath: 3, envy: 3 },
  },
];

export const MONTHLY_QUESTS: QuestDef[] = [
  {
    id: 'attend-mass-weekly',
    title: 'Attend Sunday Mass Every Week',
    description: 'Keep the Lord\u2019s Day holy for all four weeks.',
    cadence: 'monthly',
    virtueRewards: { faith: 80, hope: 40 },
  },
  {
    id: 'sacramental-confession',
    title: 'Go to Confession',
    description: 'Receive the sacrament of Reconciliation this month.',
    cadence: 'monthly',
    virtueRewards: { humility: 50, prudence: 30 },
    sinReduction: { pride: 30, lust: 20, wrath: 20, envy: 20, greed: 20, gluttony: 20, sloth: 20 },
  },
  {
    id: 'spiritual-reading',
    title: 'Finish a Spiritual Book',
    description: 'Complete one book by a saint or faithful Catholic author.',
    cadence: 'monthly',
    virtueRewards: { faith: 40, prudence: 40 },
  },
  {
    id: 'corporal-mercy-month',
    title: 'A Sustained Work of Mercy',
    description: 'Serve the poor, sick, or imprisoned through organized effort this month.',
    cadence: 'monthly',
    virtueRewards: { charity: 80, justice: 40, kindness: 30 },
    sinReduction: { greed: 30 },
  },
  {
    id: 'reconcile',
    title: 'Reconcile with Someone',
    description: 'Seek peace with a person you have wronged or held a grudge against.',
    cadence: 'monthly',
    virtueRewards: { humility: 50, charity: 40, patience: 30 },
    sinReduction: { wrath: 40, pride: 20 },
  },
  {
    id: 'tithe',
    title: 'Tithe or Alms',
    description: 'Give generously to the Church or the poor this month.',
    cadence: 'monthly',
    virtueRewards: { charity: 60, justice: 30 },
    sinReduction: { greed: 40 },
  },
];

export const ALL_QUESTS: QuestDef[] = [...DAILY_QUESTS, ...MONTHLY_QUESTS];

export const QUEST_MAP: Record<string, QuestDef> = Object.fromEntries(
  ALL_QUESTS.map((q) => [q.id, q]),
);
