import { Solar, Lunar } from 'lunar-typescript';

function check(name: string, y: number, m: number, d: number, h: number, mi: number, gender: number, isLunar: boolean, isLeap: boolean) {
  let solar: Solar;
  if (isLunar) {
    const lm = isLeap ? -m : m;
    const lunar = Lunar.fromYmdHms(y, lm, d, h, mi, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(y, m, d, h, mi, 0);
  }
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const yun = ec.getYun(gender, 1);
  const daYuns = yun.getDaYun(11);
  
  console.log(`\n=== ${name} ===`);
  console.log(`yunStartYear: ${yun.getStartYear()}, yunStartMonth: ${yun.getStartMonth()}, yunStartDay: ${yun.getStartDay()}`);
  console.log(`우리 계산: ${yun.getStartYear() + (yun.getStartMonth() >= 6 ? 1 : 0)}`);
  
  for (let i = 1; i <= 3; i++) {
    const dy = daYuns[i];
    console.log(`대운${i}: ${dy.getGanZhi()}, startAge=${dy.getStartAge()}, startYear=${dy.getStartYear()}`);
  }
}

// 최인국: 1982 음력윤4월14일 인시, 남
check('최인국', 1982, 4, 14, 4, 0, 1, true, true);
// 이인구: 1983.07.20 21:48(보정후), 남
check('이인구', 1983, 7, 20, 21, 48, 1, false, false);
// 박승혁: 1972.08.08 자시(00:00), 남 → 辛일간이므로 실제 solar는 08-08 00:00
check('박승혁', 1972, 8, 8, 0, 0, 1, false, false);
