import { pool } from "../../../../lib/db";

export async function POST(req) {
  const body = await req.json();

  const res = await pool.query(
    `INSERT INTO materials (project_id, naam, aantal, inkoopprijs, btw)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      body.project_id,
      body.naam || "",
      body.aantal ?? 1,
      body.inkoopprijs ?? 0,
      body.btw ?? 21,
    ]
  );

  return Response.json(res.rows[0]);
}
