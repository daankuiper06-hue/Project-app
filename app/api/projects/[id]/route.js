import { pool } from "../../../../../lib/db";

export async function PUT(req, { params }) {
  const id = Number(params.id);
  const body = await req.json();

  const res = await pool.query(
    `UPDATE projects
     SET naam = $1,
         klant = $2,
         datum = $3,
         status = $4,
         marge_percentage = $5
     WHERE id = $6
     RETURNING *`,
    [
      body.naam,
      body.klant,
      body.datum,
      body.status,
      body.marge_percentage ?? 20,
      id,
    ]
  );

  return Response.json(res.rows[0]);
}

export async function DELETE(_, { params }) {
  const id = Number(params.id);
  await pool.query("DELETE FROM projects WHERE id = $1", [id]);
  return Response.json({ ok: true });
}
