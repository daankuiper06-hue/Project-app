"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";

function euro(value) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

export default function CalculatiePage() {
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

  async function saveProjectMeta(updatedProject) {
    await fetch(`/api/projects/${updatedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });
    await loadProjects();
  }

  async function addMaterial() {
    if (!project) return;

    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: project.id,
        naam: "",
        aantal: 1,
        inkoopprijs: 0,
        btw: 21,
      }),
    });

    await loadProjects();
  }

  async function updateMaterial(id, payload) {
    await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await loadProjects();
  }

  async function deleteMaterial(id) {
    await fetch(`/api/materials/${id}`, { method: "DELETE" });
    await loadProjects();
  }

  async function addLabor() {
    if (!project) return;

    await fetch("/api/labor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: project.id,
        medewerker: "",
        datum: null,
        uren: 0,
        tarief: 25,
      }),
    });

    await loadProjects();
  }

  async function updateLabor(id, payload) {
    await fetch(`/api/labor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await loadProjects();
  }

  async function deleteLabor(id) {
    await fetch(`/api/labor/${id}`, { method: "DELETE" });
    await loadProjects();
  }

  const totals = useMemo(() => {
    if (!project) {
      return {
        materialenSubtotaal: 0,
        materialenWinst: 0,
        arbeidSubtotaal: 0,
        totaleOmzet: 0,
        totaleWinst: 0,
      };
    }

    const margeFactor = 1 + Number(project.marge_percentage || 0) / 100;

    const materialenSubtotaal = (project.materialen || []).reduce((sum, item) => {
      const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      return sum + verkoopPerStuk * Number(item.aantal || 0);
    }, 0);

    const materialenWinst = (project.materialen || []).reduce((sum, item) => {
      const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      return (
        sum +
        (verkoopPerStuk - Number(item.inkoopprijs || 0)) * Number(item.aantal || 0)
      );
    }, 0);

    const arbeidSubtotaal = (project.arbeid || []).reduce((sum, item) => {
      return sum + Number(item.uren || 0) * Number(item.tarief || 0);
    }, 0);

    return {
      materialenSubtotaal,
      materialenWinst,
      arbeidSubtotaal,
      totaleOmzet: materialenSubtotaal + arbeidSubtotaal,
      totaleWinst: materialenWinst + arbeidSubtotaal,
    };
  }, [project]);

  return (
    <main className="page">
      <div className="container">
        <NavBar active="/calculatie" />

        <header className="hero">
          <h1 className="title">Calculatie</h1>
          <p className="subtitle">
            Materialen, arbeid en één margeveld voor alle materialen
          </p>
        </header>

        <section className="card" style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div>
              <label className="label">Actief project</label>
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

            {project && (
              <div>
                <label className="label">Marge materialen (%)</label>
                <input
                  type="number"
                  className="input"
                  value={project.marge_percentage}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      marge_percentage: Number(e.target.value || 0),
                    })
                  }
                  onBlur={() =>
                    saveProjectMeta({
                      ...project,
                      marge_percentage: Number(project.marge_percentage || 0),
                    })
                  }
                />
              </div>
            )}
          </div>
        </section>

        {!project ? (
          <section className="card">
            <div className="empty">Kies eerst een project.</div>
          </section>
        ) : (
          <>
            <section className="card" style={{ marginBottom: 20 }}>
              <div className="section-header">
                <h2 className="card-title" style={{ marginBottom: 0 }}>
                  Materialen
                </h2>
                <button className="button" onClick={addMaterial}>
                  + Materiaal
                </button>
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Aantal</th>
                      <th>Inkoop p.s.</th>
                      <th>BTW %</th>
                      <th>Verkoop p.s.</th>
                      <th>Winst €</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(project.materialen || []).map((item) => {
                      const margeFactor =
                        1 + Number(project.marge_percentage || 0) / 100;
                      const verkoopPerStuk =
                        Number(item.inkoopprijs || 0) * margeFactor;
                      const winstEuro =
                        (verkoopPerStuk - Number(item.inkoopprijs || 0)) *
                        Number(item.aantal || 0);

                      return (
                        <tr key={item.id}>
                          <td>
                            <input
                              className="input-small"
                              value={item.naam}
                              onChange={(e) =>
                                setProject({
                                  ...project,
                                  materialen: project.materialen.map((m) =>
                                    m.id === item.id
                                      ? { ...m, naam: e.target.value }
                                      : m
                                  ),
                                })
                              }
                              onBlur={() => updateMaterial(item.id, item)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-small"
                              value={item.aantal}
                              onChange={(e) =>
                                setProject({
                                  ...project,
                                  materialen: project.materialen.map((m) =>
                                    m.id === item.id
                                      ? { ...m, aantal: Number(e.target.value || 0) }
                                      : m
                                  ),
                                })
                              }
                              onBlur={() => updateMaterial(item.id, item)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-small"
                              value={item.inkoopprijs}
                              onChange={(e) =>
                                setProject({
                                  ...project,
                                  materialen: project.materialen.map((m) =>
                                    m.id === item.id
                                      ? {
                                          ...m,
                                          inkoopprijs: Number(e.target.value || 0),
                                        }
                                      : m
                                  ),
                                })
                              }
                              onBlur={() => updateMaterial(item.id, item)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-small"
                              value={item.btw}
                              onChange={(e) =>
                                setProject({
                                  ...project,
                                  materialen: project.materialen.map((m) =>
                                    m.id === item.id
                                      ? { ...m, btw: Number(e.target.value || 0) }
                                      : m
                                  ),
                                })
                              }
                              onBlur={() => updateMaterial(item.id, item)}
                            />
                          </td>
                          <td>{euro(verkoopPerStuk)}</td>
                          <td>{euro(winstEuro)}</td>
                          <td>
                            <button
                              className="button danger"
                              style={{ padding: "8px 10px" }}
                              onClick={() => deleteMaterial(item.id)}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card" style={{ marginBottom: 20 }}>
              <div className="section-header">
                <h2 className="card-title" style={{ marginBottom: 0 }}>
                  Arbeid
                </h2>
                <button className="button" onClick={addLabor}>
                  + Arbeid
                </button>
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medewerker</th>
                      <th>Datum</th>
                      <th>Uren</th>
                      <th>Tarief</th>
                      <th>Subtotaal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(project.arbeid || []).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            className="input-small"
                            value={item.medewerker}
                            onChange={(e) =>
                              setProject({
                                ...project,
                                arbeid: project.arbeid.map((a) =>
                                  a.id === item.id
                                    ? { ...a, medewerker: e.target.value }
                                    : a
                                ),
                              })
                            }
                            onBlur={() => updateLabor(item.id, item)}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className="input-small"
                            value={item.datum ? String(item.datum).slice(0, 10) : ""}
                            onChange={(e) =>
                              setProject({
                                ...project,
                                arbeid: project.arbeid.map((a) =>
                                  a.id === item.id ? { ...a, datum: e.target.value } : a
                                ),
                              })
                            }
                            onBlur={() => updateLabor(item.id, item)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="input-small"
                            value={item.uren}
                            onChange={(e) =>
                              setProject({
                                ...project,
                                arbeid: project.arbeid.map((a) =>
                                  a.id === item.id
                                    ? { ...a, uren: Number(e.target.value || 0) }
                                    : a
                                ),
                              })
                            }
                            onBlur={() => updateLabor(item.id, item)}
                          />
                        </td>
                        <td>
                          <select
                            className="input-small"
                            value={item.tarief}
                            onChange={(e) =>
                              setProject({
                                ...project,
                                arbeid: project.arbeid.map((a) =>
                                  a.id === item.id
                                    ? { ...a, tarief: Number(e.target.value || 0) }
                                    : a
                                ),
                              })
                            }
                            onBlur={() => updateLabor(item.id, item)}
                          >
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                            <option value={35}>35</option>
                          </select>
                        </td>
                        <td>{euro(Number(item.uren || 0) * Number(item.tarief || 0))}</td>
                        <td>
                          <button
                            className="button danger"
                            style={{ padding: "8px 10px" }}
                            onClick={() => deleteLabor(item.id)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="summary-grid">
              <div className="summary-card">
                <p className="summary-label">Omzet materialen</p>
                <h3 className="summary-value">{euro(totals.materialenSubtotaal)}</h3>
              </div>
              <div className="summary-card">
                <p className="summary-label">Winst materialen</p>
                <h3 className="summary-value">{euro(totals.materialenWinst)}</h3>
              </div>
              <div className="summary-card">
                <p className="summary-label">Omzet arbeid</p>
                <h3 className="summary-value">{euro(totals.arbeidSubtotaal)}</h3>
              </div>
              <div className="summary-card">
                <p className="summary-label">Totale omzet</p>
                <h3 className="summary-value">{euro(totals.totaleOmzet)}</h3>
              </div>
              <div className="summary-card">
                <p className="summary-label">Totale winst</p>
                <h3 className="summary-value">{euro(totals.totaleWinst)}</h3>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
