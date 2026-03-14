import type { SajuData } from '@/lib/types/saju';

export interface ExtractedInfo {
  name: string;
  gender: '남' | '여';
  genderEnglish: 'Male' | 'Female';
  age: number;
  birthDate: string;   // "1992년 01월 10일"
  birthTime: string;   // "02:57"
}

/**
 * SajuData에서 이름, 성별, 생년월일, 나이를 추출한다.
 */
export function extractInfo(data: SajuData): ExtractedInfo {
  const { info } = data;

  // solarDate: "1992년 01월 10일 02:57 (보정 : -30분)"
  const dateTimeParts = info.solarDate.split(/\s+/);
  const datePart = dateTimeParts.slice(0, 3).join(' '); // "1992년 01월 10일"
  const timePart = dateTimeParts[3] ?? '';               // "02:57"

  return {
    name: info.name,
    gender: info.gender,
    genderEnglish: info.gender === '남' ? 'Male' : 'Female',
    age: info.age,
    birthDate: datePart,
    birthTime: timePart,
  };
}
