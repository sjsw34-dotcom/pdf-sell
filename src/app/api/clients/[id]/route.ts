import { NextRequest, NextResponse } from 'next/server';
import { getClient, deleteClient, updateClientJson } from '@/lib/db/clients';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const client = await getClient(id);
    if (!client) return NextResponse.json({ error: '고객 없음' }, { status: 404 });
    return NextResponse.json({ client });
  } catch (e) {
    console.error('getClient error:', e);
    return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { rawJson } = await req.json();
    await updateClientJson(id, rawJson);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('updateClient error:', e);
    return NextResponse.json({ error: '업데이트 실패' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('deleteClient error:', e);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
}
