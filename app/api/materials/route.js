import { pool } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const res = await pool.query(
    "SELECT * FROM materials WHERE project_id=$1",
    [projectId]
  );

  return Response.json(res.rows);
}

export async function POST(req) {
  const body = await req.json();

  const res = await pool.query(
    "INSERT INTO materials (project_id, naam, aantal, inkoopprijs) VALUES ($1,$2,$3,$4)",
    [body.project_id, body.naam, body.aantal, body.inkoopprijs]
  );

  return Response.json({ ok: true });
}
