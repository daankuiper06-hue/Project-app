"use client";

import { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [form, setForm] = useState({
    naam: "",
    klant: "",
    datum: "",
    status: "Lopend",
    marge_percentage: 20,
  });

  async function loadProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);

    const storedActive = localStorage.getItem("activeProjectId");
    const preferredId = storedActive ? Number(storedActive) : data[0]?.id;

    if (preferredId) {
      const found = data.find((p) => p.id === preferredId) || data[0];
      if (found) {
        setActiveId(found.id);
        setForm({
          naam: found.naam,
          klant: found.klant,
          datum: String(found.datum).slice(0, 10),
          status: found.status,
          marge_percentage: Number(found.marge_percentage || 20),
        });
      }
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function selectProject(id) {
    const project = projects.find((p) => p.id === Number(id));
    if (!project) return;

    localStorage.setItem("activeProjectId", String(project.id));
    setActiveId(project.id);
    setForm({
      naam: project.naam,
      klant: project.klant,
      datum: String(project.datum).slice(0, 10),
      status: project.status,
      marge_percentage: Number(project.marge_percentage || 20),
    });
  }

  async function createProject() {
    if (!form.naam || !form.klant || !form.datum) {
      alert("Vul projectnaam, klant en datum in.");
      return;
    }

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await loadProjects();
  }

  async function saveProject() {
    if (!activeId) return;

    await fetch(`/api/projects/${activeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await loadProjects();
  }

  async function deleteProject() {
    if (!activeId) return;
    const ok = confirm("Weet je zeker dat je dit project wilt verwijderen?");
    if (!ok) return;

    await fetch(`/api/projects/${activeId}`, { method: "DELETE" });
    localStorage.removeItem("activeProjectId");
    setActiveId("");
    setForm({
      naam: "",
      klant: "",
      datum: "",
      status: "Lopend",
      marge_percentage: 20,
    });
    await loadProjects();
  }

  return (
    <main className="page">
      <div className="container">
        <NavBar active="/project" />

        <header className="hero">
          <h1 className="title">Projecten</h1>
          <p className="subtitle">Projecten aanmaken en beheren</p>
        </header>

        <div className="grid-2">
          <section className="card">
            <h2 className="card-title">Projectgegevens</h2>

            <div className="form-grid">
              <div>
                <label className="label">Projectnaam</label>
                <input
                  className="input"
                  value={form.naam}
                  onChange={(e) => setForm({ ...form, naam: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Klant</label>
                <input
                  className="input"
                  value={form.klant}
                  onChange={(e) => setForm({ ...form, klant: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Datum</label>
                <input
                  type="date"
                  className="input"
                  value={form.datum}
                  onChange={(e) => setForm({ ...form, datum: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  className="select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Lopend</option>
                  <option>Verstuurd</option>
                  <option>Betaald</option>
                </select>
              </div>

              <div>
                <label className="label">Marge materialen (%)</label>
                <input
                  type="number"
                  className="input"
                  value={form.marge_percentage}
                  onChange={(e) =>
                    setForm({ ...form, marge_percentage: Number(e.target.value || 0) })
                  }
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: 16 }}>
              <button className="button" onClick={createProject}>
                + Project aanmaken
              </button>
              <button className="button secondary" onClick={saveProject}>
                Opslaan
              </button>
              <button className="button danger" onClick={deleteProject}>
                Verwijderen
              </button>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Projectlijst</h2>

            {projects.length === 0 ? (
              <div className="empty">Nog geen projecten.</div>
            ) : (
              <div className="row" style={{ flexDirection: "column" }}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className="button secondary"
                    style={{
                      textAlign: "left",
                      justifyContent: "space-between",
                      display: "flex",
                    }}
                    onClick={() => selectProject(project.id)}
                  >
                    <span>
                      {project.naam} — {project.klant}
                    </span>
                    <span>{project.status}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
