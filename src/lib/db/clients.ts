import { getSQL } from './neon';

export interface SavedClient {
  id: string;
  name: string;
  gender: '남' | '여';
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  calendar_type: string;
  time_mode: string;
  time_idx: number;
  raw_json: unknown;
  created_at: string;
  updated_at: string;
}

export async function listClients(): Promise<SavedClient[]> {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, name, gender, birth_year, birth_month, birth_day,
           birth_hour, birth_minute, calendar_type, time_mode, time_idx,
           updated_at
    FROM saved_clients
    ORDER BY updated_at DESC
  `;
  return rows as unknown as SavedClient[];
}

export async function getClient(id: string): Promise<SavedClient | null> {
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM saved_clients WHERE id = ${id}
  `;
  return (rows[0] as unknown as SavedClient) ?? null;
}

export async function createClient(data: {
  name: string;
  gender: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  calendar_type: string;
  time_mode: string;
  time_idx: number;
  raw_json: unknown;
}): Promise<SavedClient> {
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO saved_clients (name, gender, birth_year, birth_month, birth_day,
      birth_hour, birth_minute, calendar_type, time_mode, time_idx, raw_json)
    VALUES (${data.name}, ${data.gender}, ${data.birth_year}, ${data.birth_month},
      ${data.birth_day}, ${data.birth_hour}, ${data.birth_minute},
      ${data.calendar_type}, ${data.time_mode}, ${data.time_idx},
      ${JSON.stringify(data.raw_json)})
    RETURNING *
  `;
  return rows[0] as unknown as SavedClient;
}

export async function updateClientJson(id: string, rawJson: unknown): Promise<void> {
  const sql = getSQL();
  await sql`
    UPDATE saved_clients
    SET raw_json = ${JSON.stringify(rawJson)}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteClient(id: string): Promise<void> {
  const sql = getSQL();
  await sql`DELETE FROM saved_clients WHERE id = ${id}`;
}
