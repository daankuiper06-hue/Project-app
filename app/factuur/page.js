"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "../../../components/NavBar";

function euro(value) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

export default function FactuurPage() {
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [project, setProject] = useState(null);

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
        setProject(found);
      }
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function selectProject(id) {
    const found = projects.find((p) => p.id === Number(id));
    if (!found) return;

    localStorage.setItem("activeProjectId", String(found.id));
    setActiveId(found.id);
    setProject(found);
  }

  const totals = useMemo(() => {
    if (!project) return { subtotaal: 0, btw: 0, totaal: 0 };

    const margeFactor = 1 + Number(project.marge_percentage || 0) / 100;

    const subtotaal = (project.materialen || []).reduce((sum, item) => {
      const prijsPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      return sum + prijsPerStuk * Number(item.aantal || 0);
    }, 0);

    const btw = subtotaal * 0.21;

    return {
      subtotaal,
      btw,
      totaal: subtotaal + btw,
    };
  }, [project]);

  return (
    <main className="page">
      <div className="container">
        <NavBar active="/factuur" />

        <header className="hero">
          <h1 className="title">Factuur</h1>
          <p className="subtitle">Alleen materialen, btw en totaal</p>
        </header>

        <section className="card" style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div>
              <label className="label">Project</label>
              <select
                className="select"
                value={activeId || ""}
                onChange={(e) => selectProject(e.target.value)}
              >
                <option value="">Kies project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.naam}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "end" }}>
              <button className="button" onClick={() => window.print()}>
                Print / PDF
              </button>
            </div>
          </div>
        </section>

        {!project ? (
          <section className="card">
            <div className="empty">Kies eerst een project.</div>
          </section>
        ) : (
          <section className="print-paper">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>{project.naam}</h2>
              <p className="subtitle" style={{ marginTop: 8 }}>
                Klant: {project.klant}
              </p>
              <p className="subtitle" style={{ marginTop: 4 }}>
                Datum: {String(project.datum).slice(0, 10)}
              </p>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Omschrijving</th>
                    <th>Aantal</th>
                    <th>Prijs p.s.</th>
                    <th>Subtotaal</th>
                  </tr>
                </thead>
                <tbody>
                  {(project.materialen || []).length === 0 ? (
                    <tr>
                      <td colSpan="4">Geen materialen toegevoegd.</td>
                    </tr>
                  ) : (
                    project.materialen.map((item) => {
                      const margeFactor =
                        1 + Number(project.marge_percentage || 0) / 100;
                      const prijsPerStuk =
                        Number(item.inkoopprijs || 0) * margeFactor;
                      const subtotaal =
                        prijsPerStuk * Number(item.aantal || 0);

                      return (
                        <tr key={item.id}>
                          <td>{item.naam}</td>
                          <td>{item.aantal}</td>
                          <td>{euro(prijsPerStuk)}</td>
                          <td>{euro(subtotaal)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="total-box" style={{ marginTop: 24 }}>
              <div className="total-row">
                <span>Subtotaal</span>
                <strong>{euro(totals.subtotaal)}</strong>
              </div>
              <div className="total-row">
                <span>BTW bedrag</span>
                <strong>{euro(totals.btw)}</strong>
              </div>
              <div className="total-row final">
                <span>Totaal</span>
                <strong>{euro(totals.totaal)}</strong>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
