import { pool } from "../../../../../lib/db";

export async function PUT(req, { params }) {
  const id = Number(params.id);
  const body = await req.json();

  const res = await pool.query(
    `UPDATE materials
     SET naam = $1,
         aantal = $2,
         inkoopprijs = $3,
         btw = $4
     WHERE id = $5
     RETURNING *`,
    [body.naam, body.aantal, body.inkoopprijs, body.btw, id]
  );

  return Response.json(res.rows[0]);
}

export async function DELETE(_, { params }) {
  const id = Number(params.id);
  await pool.query("DELETE FROM materials WHERE id = $1", [id]);
  return Response.json({ ok: true });
}
