import { NextRequest, NextResponse } from 'next/server';
import { listClients, createClient } from '@/lib/db/clients';

export async function GET() {
  try {
    const clients = await listClients();
    return NextResponse.json({ clients });
  } catch (e) {
    console.error('listClients error:', e);
    return NextResponse.json({ error: 'DB 조회 실패' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, birthYear, birthMonth, birthDay,
            birthHour, birthMinute, calendarType, timeMode, timeIdx, rawJson } = body;

    if (!name || !gender || !birthYear) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
    }

    const client = await createClient({
      name,
      gender,
      birth_year: birthYear,
      birth_month: birthMonth,
      birth_day: birthDay,
      birth_hour: birthHour,
      birth_minute: birthMinute,
      calendar_type: calendarType || 'solar',
      time_mode: timeMode || 'jijin',
      time_idx: timeIdx ?? 0,
      raw_json: rawJson,
    });

    return NextResponse.json({ client });
  } catch (e) {
    console.error('createClient error:', e);
    return NextResponse.json({ error: '저장 실패' }, { status: 500 });
  }
}
