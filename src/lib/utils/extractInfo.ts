import type { SajuData } from '@/lib/types/saju';
import { calcInternationalAge } from '@/lib/translate/client';

export interface ExtractedInfo {
  name: string;
  gender: '남' | '여';
  genderEnglish: 'Male' | 'Female';
  age: number;            // 국제 표준 만나이 (fallback: 한국 나이 - 1)
  koreanAge: number;      // 원본 한국 나이
  birthDate: string;      // "1992년 01월 10일"
  birthTime: string;      // "02:57"
}

/**
 * SajuData에서 이름, 성별, 생년월일, 나이를 추출한다.
 * age는 국제 표준 만나이로 변환하여 반환한다.
 */
export function extractInfo(data: SajuData): ExtractedInfo {
  const { info } = data;

  // solarDate: "1992년 01월 10일 02:57 (보정 : -30분)"
  const dateTimeParts = info.solarDate.split(/\s+/);
  const datePart = dateTimeParts.slice(0, 3).join(' '); // "1992년 01월 10일"
  const timePart = dateTimeParts[3] ?? '';               // "02:57"

  const intAge = calcInternationalAge(info);

  return {
    name: info.name,
    gender: info.gender,
    genderEnglish: info.gender === '남' ? 'Male' : 'Female',
    age: intAge ?? Math.max(0, info.age - 1),  // fallback: 한국 나이 - 1 (근사치)
    koreanAge: info.age,
    birthDate: datePart,
    birthTime: timePart,
  };
}
