import { pool } from "@/lib/db";

export async function GET() {
  const res = await pool.query("SELECT * FROM projects ORDER BY id DESC");
  return Response.json(res.rows);
}

export async function POST(req) {
  const body = await req.json();

  const res = await pool.query(
    "INSERT INTO projects (naam, klant, datum) VALUES ($1,$2,$3) RETURNING *",
    [body.naam, body.klant, new Date()]
  );

  return Response.json(res.rows[0]);
}
