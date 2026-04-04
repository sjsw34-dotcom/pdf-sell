import { calculateSaju } from '../src/lib/saju/calculator';

const result = calculateSaju({
  name: '소현태',
  gender: '남',
  birthYear: 1971,
  birthMonth: 1,
  birthDay: 1,
  birthHour: 0,
  birthMinute: 30,
  isLunar: false,
});

console.log(JSON.stringify(result, null, 2));
