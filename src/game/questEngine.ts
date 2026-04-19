import { DAILY_QUESTS, MONTHLY_QUESTS, type QuestDef } from '@/data/quests';

export interface QuestView {
  def: QuestDef;
  completed: boolean;
}

export function buildQuestList(
  cadence: 'daily' | 'monthly',
  completedIds: string[],
): QuestView[] {
  const source = cadence === 'daily' ? DAILY_QUESTS : MONTHLY_QUESTS;
  const completedSet = new Set(completedIds);
  return source.map((def) => ({ def, completed: completedSet.has(def.id) }));
}
