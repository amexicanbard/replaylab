import type { VirtueId } from './virtues';

export type SinId =
  | 'pride'
  | 'greed'
  | 'lust'
  | 'envy'
  | 'gluttony'
  | 'wrath'
  | 'sloth';

export interface SinDef {
  id: SinId;
  name: string;
  emoji: string;
  opposingVirtue: VirtueId;
  blurb: string;
}

export const SINS: SinDef[] = [
  { id: 'pride',    name: 'Pride',    emoji: '\ud83d\udc51', opposingVirtue: 'humility',   blurb: 'Excessive love of one\u2019s own excellence.' },
  { id: 'greed',    name: 'Greed',    emoji: '\ud83d\udcb0', opposingVirtue: 'charity',    blurb: 'Disordered desire for possessions.' },
  { id: 'lust',     name: 'Lust',     emoji: '\ud83d\udd25', opposingVirtue: 'chastity',   blurb: 'Disordered desire for pleasure.' },
  { id: 'envy',     name: 'Envy',     emoji: '\ud83d\udc40', opposingVirtue: 'kindness',   blurb: 'Sorrow at another\u2019s good.' },
  { id: 'gluttony', name: 'Gluttony', emoji: '\ud83c\udf54', opposingVirtue: 'temperance', blurb: 'Immoderate consumption.' },
  { id: 'wrath',    name: 'Wrath',    emoji: '\ud83d\udca2', opposingVirtue: 'patience',   blurb: 'Inordinate, vengeful anger.' },
  { id: 'sloth',    name: 'Sloth',    emoji: '\ud83d\udecc', opposingVirtue: 'diligence',  blurb: 'Sorrow at spiritual good; laziness.' },
];

export const SIN_MAP: Record<SinId, SinDef> = Object.fromEntries(
  SINS.map((s) => [s.id, s]),
) as Record<SinId, SinDef>;
