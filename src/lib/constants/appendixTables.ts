// ─── 레퍼런스 테이블 데이터 (Appendix용) ───

export interface StemEntry {
  hanja: string;
  romanization: string;
  element: string;
  polarity: 'Yang' | 'Yin';
}

export const HEAVENLY_STEMS: StemEntry[] = [
  { hanja: '甲', romanization: 'Gap', element: 'Wood', polarity: 'Yang' },
  { hanja: '乙', romanization: 'Eul', element: 'Wood', polarity: 'Yin' },
  { hanja: '丙', romanization: 'Byeong', element: 'Fire', polarity: 'Yang' },
  { hanja: '丁', romanization: 'Jeong', element: 'Fire', polarity: 'Yin' },
  { hanja: '戊', romanization: 'Mu', element: 'Earth', polarity: 'Yang' },
  { hanja: '己', romanization: 'Gi', element: 'Earth', polarity: 'Yin' },
  { hanja: '庚', romanization: 'Gyeong', element: 'Metal', polarity: 'Yang' },
  { hanja: '辛', romanization: 'Sin', element: 'Metal', polarity: 'Yin' },
  { hanja: '壬', romanization: 'Im', element: 'Water', polarity: 'Yang' },
  { hanja: '癸', romanization: 'Gye', element: 'Water', polarity: 'Yin' },
];

export interface BranchEntry {
  hanja: string;
  romanization: string;
  element: string;
  animal: string;
  polarity: 'Yang' | 'Yin';
}

export const EARTHLY_BRANCHES: BranchEntry[] = [
  { hanja: '子', romanization: 'Ja', element: 'Water', animal: 'Rat', polarity: 'Yang' },
  { hanja: '丑', romanization: 'Chuk', element: 'Earth', animal: 'Ox', polarity: 'Yin' },
  { hanja: '寅', romanization: 'In', element: 'Wood', animal: 'Tiger', polarity: 'Yang' },
  { hanja: '卯', romanization: 'Myo', element: 'Wood', animal: 'Rabbit', polarity: 'Yin' },
  { hanja: '辰', romanization: 'Jin', element: 'Earth', animal: 'Dragon', polarity: 'Yang' },
  { hanja: '巳', romanization: 'Sa', element: 'Fire', animal: 'Snake', polarity: 'Yin' },
  { hanja: '午', romanization: 'O', element: 'Fire', animal: 'Horse', polarity: 'Yang' },
  { hanja: '未', romanization: 'Mi', element: 'Earth', animal: 'Goat', polarity: 'Yin' },
  { hanja: '申', romanization: 'Sin', element: 'Metal', animal: 'Monkey', polarity: 'Yang' },
  { hanja: '酉', romanization: 'Yu', element: 'Metal', animal: 'Rooster', polarity: 'Yin' },
  { hanja: '戌', romanization: 'Sul', element: 'Earth', animal: 'Dog', polarity: 'Yang' },
  { hanja: '亥', romanization: 'Hae', element: 'Water', animal: 'Pig', polarity: 'Yin' },
];

export const ELEMENT_CYCLES = {
  productive: [
    { from: 'Wood', to: 'Fire', description: 'Wood feeds Fire' },
    { from: 'Fire', to: 'Earth', description: 'Fire creates Earth (ash)' },
    { from: 'Earth', to: 'Metal', description: 'Earth bears Metal (ore)' },
    { from: 'Metal', to: 'Water', description: 'Metal collects Water (condensation)' },
    { from: 'Water', to: 'Wood', description: 'Water nourishes Wood' },
  ],
  controlling: [
    { from: 'Wood', to: 'Earth', description: 'Wood parts Earth (roots)' },
    { from: 'Earth', to: 'Water', description: 'Earth dams Water' },
    { from: 'Water', to: 'Fire', description: 'Water extinguishes Fire' },
    { from: 'Fire', to: 'Metal', description: 'Fire melts Metal' },
    { from: 'Metal', to: 'Wood', description: 'Metal chops Wood' },
  ],
};
