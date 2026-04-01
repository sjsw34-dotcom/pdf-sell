import { calculateSaju } from '../src/lib/saju/calculator';
const r = calculateSaju({ name:'정수정', gender:'여', birthYear:1991, birthMonth:10, birthDay:22, birthHour:10, birthMinute:30, isLunar:false });
console.log('강약:', r.pillar.data[0][10]);
console.log('음양:', r.yinyang.data[0].slice(0,2).join(', '));
console.log('오행:', r.yinyang.data[0].slice(2,7).join(', '));
console.log('십신:', r.yinyang.data[0].slice(8).join(', '));
console.log('용신:', r.yongsin.data.map(d => d[0]).join(', '));
console.log('사주:', r.pillar.data.map(p => p[1]+p[2]).join(' '));
