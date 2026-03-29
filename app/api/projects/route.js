import { pool } from "../../../../lib/db";

export async function GET() {
  const projectsRes = await pool.query("SELECT * FROM projects ORDER BY id DESC");
  const materialsRes = await pool.query("SELECT * FROM materials ORDER BY id ASC");
  const laborRes = await pool.query("SELECT * FROM labor ORDER BY id ASC");

  const projects = projectsRes.rows.map((project) => ({
    ...project,
    marge_percentage: Number(project.marge_percentage || 0),
    materialen: materialsRes.rows.filter((m) => m.project_id === project.id),
    arbeid: laborRes.rows.filter((l) => l.project_id === project.id),
  }));

  return Response.json(projects);
}

export async function POST(req) {
  const body = await req.json();

  const res = await pool.query(
    `INSERT INTO projects (naam, klant, datum, status, marge_percentage)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      body.naam,
      body.klant,
      body.datum,
      body.status || "Lopend",
      body.marge_percentage ?? 20,
    ]
  );

  return Response.json(res.rows[0]);
}
