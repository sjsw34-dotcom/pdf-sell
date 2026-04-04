import { calculateSaju } from '../src/lib/saju/calculator';
const r1 = calculateSaju({ name:'이철규', gender:'남', birthYear:1997, birthMonth:10, birthDay:9, birthHour:22, birthMinute:30, isLunar:false });
const r2 = calculateSaju({ name:'김재관', gender:'남', birthYear:1976, birthMonth:1, birthDay:27, birthHour:8, birthMinute:30, isLunar:false });
console.log('이철규 강약:', r1.pillar.data[0][10]);
console.log('김재관 강약:', r2.pillar.data[0][10]);
