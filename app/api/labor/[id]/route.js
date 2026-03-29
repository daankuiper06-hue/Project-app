import { pool } from "../../../../../lib/db";

export async function PUT(req, { params }) {
  const id = Number(params.id);
  const body = await req.json();

  const res = await pool.query(
    `UPDATE labor
     SET medewerker = $1,
         datum = $2,
         uren = $3,
         tarief = $4
     WHERE id = $5
     RETURNING *`,
    [body.medewerker, body.datum || null, body.uren, body.tarief, id]
  );

  return Response.json(res.rows[0]);
}

export async function DELETE(_, { params }) {
  const id = Number(params.id);
  await pool.query("DELETE FROM labor WHERE id = $1", [id]);
  return Response.json({ ok: true });
}
