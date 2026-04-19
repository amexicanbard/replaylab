export type VirtueFramework = 'theological' | 'cardinal' | 'heavenly';

export type VirtueId =
  | 'faith'
  | 'hope'
  | 'charity'
  | 'prudence'
  | 'justice'
  | 'fortitude'
  | 'temperance'
  | 'chastity'
  | 'diligence'
  | 'patience'
  | 'kindness'
  | 'humility';

export interface VirtueDef {
  id: VirtueId;
  name: string;
  emoji: string;
  frameworks: VirtueFramework[];
  blurb: string;
}

export const VIRTUES: VirtueDef[] = [
  { id: 'faith',      name: 'Faith',      emoji: '\u271d\ufe0f', frameworks: ['theological'], blurb: 'Belief in God and His revelation.' },
  { id: 'hope',       name: 'Hope',       emoji: '\u2693',        frameworks: ['theological'], blurb: 'Trust in the promises of Christ.' },
  { id: 'charity',    name: 'Charity',    emoji: '\u2764\ufe0f',  frameworks: ['theological', 'heavenly'], blurb: 'Love of God and neighbor.' },
  { id: 'prudence',   name: 'Prudence',   emoji: '\ud83e\udd89',  frameworks: ['cardinal'],    blurb: 'Right reason in action.' },
  { id: 'justice',    name: 'Justice',    emoji: '\u2696\ufe0f',  frameworks: ['cardinal'],    blurb: 'Rendering to each what is due.' },
  { id: 'fortitude',  name: 'Fortitude',  emoji: '\ud83d\udee1\ufe0f', frameworks: ['cardinal'], blurb: 'Firmness in the pursuit of good.' },
  { id: 'temperance', name: 'Temperance', emoji: '\ud83c\udf77',  frameworks: ['cardinal', 'heavenly'], blurb: 'Moderation of appetites.' },
  { id: 'chastity',   name: 'Chastity',   emoji: '\ud83d\udd4a\ufe0f', frameworks: ['heavenly'], blurb: 'Purity of heart and body.' },
  { id: 'diligence',  name: 'Diligence',  emoji: '\ud83d\udee0\ufe0f', frameworks: ['heavenly'], blurb: 'Earnest, careful work.' },
  { id: 'patience',   name: 'Patience',   emoji: '\u23f3',        frameworks: ['heavenly'],    blurb: 'Peaceful endurance of trial.' },
  { id: 'kindness',   name: 'Kindness',   emoji: '\ud83e\udd32',  frameworks: ['heavenly'],    blurb: 'Goodness shown to others.' },
  { id: 'humility',   name: 'Humility',   emoji: '\ud83d\ude4f',  frameworks: ['heavenly'],    blurb: 'Truthful self-knowledge before God.' },
];

export const VIRTUE_MAP: Record<VirtueId, VirtueDef> = Object.fromEntries(
  VIRTUES.map((v) => [v.id, v]),
) as Record<VirtueId, VirtueDef>;
