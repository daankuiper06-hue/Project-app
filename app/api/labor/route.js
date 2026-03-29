import { pool } from "../../../../lib/db";

export async function POST(req) {
  const body = await req.json();

  const res = await pool.query(
    `INSERT INTO labor (project_id, medewerker, datum, uren, tarief)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      body.project_id,
      body.medewerker || "",
      body.datum || null,
      body.uren ?? 0,
      body.tarief ?? 25,
    ]
  );

  return Response.json(res.rows[0]);
}
