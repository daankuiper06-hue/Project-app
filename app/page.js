"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_MATERIAL = {
  omschrijving: "",
  aantal: 1,
  prijsInclBtw: 0,
  btw: 21,
};

const DEFAULT_ARBEID = {
  medewerker: "",
  datum: "",
  uren: 0,
  tarief: 25,
};

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

function berekenProject(project) {
  const materiaalOmzet = (project.materialen || []).reduce((sum, item) => {
    const aantal = Number(item.aantal || 0);
    const prijsInclBtw = Number(item.prijsInclBtw || 0);
    return sum + aantal * prijsInclBtw;
  }, 0);

  const arbeidOmzet = (project.arbeid || []).reduce((sum, item) => {
    const uren = Number(item.uren || 0);
    const tarief = Number(item.tarief || 0);
    return sum + uren * tarief;
  }, 0);

  const totaleOmzet = materiaalOmzet + arbeidOmzet;

  const winst = materiaalOmzet * 0.18 + arbeidOmzet;

  return {
    materiaalOmzet,
    arbeidOmzet,
    totaleOmzet,
    winst,
  };
}

export default function Home() {
  const [projecten, setProjecten] = useState([]);
  const [showNieuwProject, setShowNieuwProject] = useState(false);
  const [actiefProjectId, setActiefProjectId] = useState(null);

  const [nieuwNaam, setNieuwNaam] = useState("");
  const [nieuwKlant, setNieuwKlant] = useState("");
  const [nieuwDatum, setNieuwDatum] = useState("");
  const [nieuwStatus, setNieuwStatus] = useState("Lopend");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("project-app-data-v1");
    if (opgeslagen) {
      const parsed = JSON.parse(opgeslagen);
      setProjecten(parsed);
      if (parsed.length > 0) {
        setActiefProjectId(parsed[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("project-app-data-v1", JSON.stringify(projecten));
  }, [projecten]);

  const actiefProject = useMemo(() => {
    return projecten.find((p) => p.id === actiefProjectId) || null;
  }, [projecten, actiefProjectId]);

  const totaalcijfers = useMemo(() => {
    let omzet = 0;
    let winst = 0;
    let betaald = 0;
    let openstaand = 0;

    projecten.forEach((p) => {
      const calc = berekenProject(p);
      omzet += calc.totaleOmzet;
      winst += calc.winst;

      if (p.status === "Betaald") betaald += 1;
      else openstaand += 1;
    });

    return { omzet, winst, betaald, openstaand };
  }, [projecten]);

  function maakNieuwProject() {
    if (!nieuwNaam.trim() || !nieuwKlant.trim() || !nieuwDatum) {
      alert("Vul projectnaam, klantnaam en startdatum in.");
      return;
    }

    const nieuwProject = {
      id: Date.now(),
      naam: nieuwNaam,
      klant: nieuwKlant,
      startdatum: nieuwDatum,
      status: nieuwStatus,
      materialen: [],
      arbeid: [],
    };

    const updated = [...projecten, nieuwProject];
    setProjecten(updated);
    setActiefProjectId(nieuwProject.id);

    setNieuwNaam("");
    setNieuwKlant("");
    setNieuwDatum("");
    setNieuwStatus("Lopend");
    setShowNieuwProject(false);
  }

  function updateProjectField(projectId, field, value) {
    setProjecten((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p))
    );
  }

  function voegMateriaalToe() {
    if (!actiefProject) return;
    setProjecten((prev) =>
      prev.map((p) =>
        p.id === actiefProject.id
          ? { ...p, materialen: [...p.materialen, { ...DEFAULT_MATERIAL }] }
          : p
      )
    );
  }

  function updateMateriaal(index, field, value) {
    if (!actiefProject) return;

    setProjecten((prev) =>
      prev.map((p) => {
        if (p.id !== actiefProject.id) return p;

        const materialen = [...p.materialen];
        materialen[index] = {
          ...materialen[index],
          [field]:
            field === "omschrijving" ? value : Number(value === "" ? 0 : value),
        };

        return { ...p, materialen };
      })
    );
  }

  function verwijderMateriaal(index) {
    if (!actiefProject) return;

    setProjecten((prev) =>
      prev.map((p) => {
        if (p.id !== actiefProject.id) return p;
        return {
          ...p,
          materialen: p.materialen.filter((_, i) => i !== index),
        };
      })
    );
  }

  function voegArbeidToe() {
    if (!actiefProject) return;
    setProjecten((prev) =>
      prev.map((p) =>
        p.id === actiefProject.id
          ? { ...p, arbeid: [...p.arbeid, { ...DEFAULT_ARBEID }] }
          : p
      )
    );
  }

  function updateArbeid(index, field, value) {
    if (!actiefProject) return;

    setProjecten((prev) =>
      prev.map((p) => {
        if (p.id !== actiefProject.id) return p;

        const arbeid = [...p.arbeid];
        arbeid[index] = {
          ...arbeid[index],
          [field]:
            field === "medewerker" || field === "datum"
              ? value
              : Number(value === "" ? 0 : value),
        };

        return { ...p, arbeid };
      })
    );
  }

  function verwijderArbeid(index) {
    if (!actiefProject) return;

    setProjecten((prev) =>
      prev.map((p) => {
        if (p.id !== actiefProject.id) return p;
        return {
          ...p,
          arbeid: p.arbeid.filter((_, i) => i !== index),
        };
      })
    );
  }

  function verwijderProject(projectId) {
    const bevestig = confirm("Weet je zeker dat je dit project wilt verwijderen?");
    if (!bevestig) return;

    const updated = projecten.filter((p) => p.id !== projectId);
    setProjecten(updated);
    setActiefProjectId(updated[0]?.id || null);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Project Dashboard</h1>
            <p style={styles.subtitle}>
              Projecten, calculaties, arbeid en facturen
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() => setShowNieuwProject(true)}
          >
            + Nieuw project
          </button>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Totale omzet</p>
            <h2 style={styles.statValue}>{euro(totaalcijfers.omzet)}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Totale winst</p>
            <h2 style={styles.statValue}>{euro(totaalcijfers.winst)}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Openstaand</p>
            <h2 style={styles.statValue}>{totaalcijfers.openstaand}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Betaald</p>
            <h2 style={styles.statValue}>{totaalcijfers.betaald}</h2>
          </div>
        </section>

        <div style={styles.mainGrid}>
          <section style={styles.sidebarCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Projecten</h3>
            </div>

            {projecten.length === 0 ? (
              <div style={styles.emptyBox}>
                Nog geen projecten. Maak je eerste project aan.
              </div>
            ) : (
              <div style={styles.projectList}>
                {projecten.map((p) => {
                  const calc = berekenProject(p);
                  const actief = actiefProjectId === p.id;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiefProjectId(p.id)}
                      style={{
                        ...styles.projectItem,
                        ...(actief ? styles.projectItemActive : {}),
                      }}
                    >
                      <div style={styles.projectItemTop}>
                        <strong style={styles.projectItemTitle}>{p.naam}</strong>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(p.status === "Betaald"
                              ? styles.statusPaid
                              : p.status === "Verstuurd"
                              ? styles.statusSent
                              : styles.statusOpen),
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div style={styles.projectMeta}>{p.klant}</div>
                      <div style={styles.projectMeta}>{p.startdatum}</div>
                      <div style={styles.projectAmounts}>
                        <span>{euro(calc.totaleOmzet)}</span>
                        <span>{euro(calc.winst)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section style={styles.contentCard}>
            {!actiefProject ? (
              <div style={styles.emptyStateLarge}>
                Selecteer een project of maak een nieuw project aan.
              </div>
            ) : (
              <>
                <div style={styles.cardHeaderRow}>
                  <div>
                    <h3 style={styles.cardTitle}>{actiefProject.naam}</h3>
                    <p style={styles.projectSubTitle}>
                      {actiefProject.klant} · {actiefProject.startdatum}
                    </p>
                  </div>

                  <div style={styles.headerButtons}>
                    <a
                      href={`/factuur?projectId=${actiefProject.id}`}
                      style={styles.linkButton}
                    >
                      Factuur
                    </a>
                    <button
                      onClick={() => verwijderProject(actiefProject.id)}
                      style={styles.deleteButton}
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>

                <section style={styles.formSection}>
                  <div style={styles.formGrid}>
                    <div>
                      <label style={styles.label}>Projectnaam</label>
                      <input
                        style={styles.input}
                        value={actiefProject.naam}
                        onChange={(e) =>
                          updateProjectField(actiefProject.id, "naam", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Klantnaam</label>
                      <input
                        style={styles.input}
                        value={actiefProject.klant}
                        onChange={(e) =>
                          updateProjectField(actiefProject.id, "klant", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Startdatum</label>
                      <input
                        type="date"
                        style={styles.input}
                        value={actiefProject.startdatum}
                        onChange={(e) =>
                          updateProjectField(
                            actiefProject.id,
                            "startdatum",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Status</label>
                      <select
                        style={styles.input}
                        value={actiefProject.status}
                        onChange={(e) =>
                          updateProjectField(actiefProject.id, "status", e.target.value)
                        }
                      >
                        <option>Lopend</option>
                        <option>Verstuurd</option>
                        <option>Betaald</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeader}>
                    <h4 style={styles.sectionTitle}>Materialen</h4>
                    <button style={styles.smallButton} onClick={voegMateriaalToe}>
                      + Materiaal
                    </button>
                  </div>

                  {actiefProject.materialen.length === 0 ? (
                    <div style={styles.emptyInner}>Nog geen materialen toegevoegd.</div>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Omschrijving</th>
                            <th style={styles.th}>Aantal</th>
                            <th style={styles.th}>Prijs p.s. incl. btw</th>
                            <th style={styles.th}>BTW %</th>
                            <th style={styles.th}>Subtotaal</th>
                            <th style={styles.th}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {actiefProject.materialen.map((item, index) => (
                            <tr key={index}>
                              <td style={styles.td}>
                                <input
                                  style={styles.tableInput}
                                  value={item.omschrijving}
                                  onChange={(e) =>
                                    updateMateriaal(index, "omschrijving", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <input
                                  type="number"
                                  style={styles.tableInput}
                                  value={item.aantal}
                                  onChange={(e) =>
                                    updateMateriaal(index, "aantal", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <input
                                  type="number"
                                  style={styles.tableInput}
                                  value={item.prijsInclBtw}
                                  onChange={(e) =>
                                    updateMateriaal(index, "prijsInclBtw", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <input
                                  type="number"
                                  style={styles.tableInput}
                                  value={item.btw}
                                  onChange={(e) =>
                                    updateMateriaal(index, "btw", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                {euro(Number(item.aantal) * Number(item.prijsInclBtw))}
                              </td>
                              <td style={styles.td}>
                                <button
                                  style={styles.removeButton}
                                  onClick={() => verwijderMateriaal(index)}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section style={styles.sectionBlock}>
                  <div style={styles.sectionHeader}>
                    <h4 style={styles.sectionTitle}>Arbeid</h4>
                    <button style={styles.smallButton} onClick={voegArbeidToe}>
                      + Arbeid
                    </button>
                  </div>

                  {actiefProject.arbeid.length === 0 ? (
                    <div style={styles.emptyInner}>Nog geen arbeid toegevoegd.</div>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Medewerker</th>
                            <th style={styles.th}>Datum</th>
                            <th style={styles.th}>Uren</th>
                            <th style={styles.th}>Tarief</th>
                            <th style={styles.th}>Subtotaal</th>
                            <th style={styles.th}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {actiefProject.arbeid.map((item, index) => (
                            <tr key={index}>
                              <td style={styles.td}>
                                <input
                                  style={styles.tableInput}
                                  value={item.medewerker}
                                  onChange={(e) =>
                                    updateArbeid(index, "medewerker", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <input
                                  type="date"
                                  style={styles.tableInput}
                                  value={item.datum}
                                  onChange={(e) =>
                                    updateArbeid(index, "datum", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <input
                                  type="number"
                                  style={styles.tableInput}
                                  value={item.uren}
                                  onChange={(e) =>
                                    updateArbeid(index, "uren", e.target.value)
                                  }
                                />
                              </td>
                              <td style={styles.td}>
                                <select
                                  style={styles.tableInput}
                                  value={item.tarief}
                                  onChange={(e) =>
                                    updateArbeid(index, "tarief", e.target.value)
                                  }
                                >
                                  <option value={20}>20</option>
                                  <option value={25}>25</option>
                                  <option value={30}>30</option>
                                  <option value={35}>35</option>
                                </select>
                              </td>
                              <td style={styles.td}>
                                {euro(Number(item.uren) * Number(item.tarief))}
                              </td>
                              <td style={styles.td}>
                                <button
                                  style={styles.removeButton}
                                  onClick={() => verwijderArbeid(index)}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section style={styles.summaryGrid}>
                  <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Omzet materialen</p>
                    <h4 style={styles.summaryValue}>
                      {euro(berekenProject(actiefProject).materiaalOmzet)}
                    </h4>
                  </div>
                  <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Omzet arbeid</p>
                    <h4 style={styles.summaryValue}>
                      {euro(berekenProject(actiefProject).arbeidOmzet)}
                    </h4>
                  </div>
                  <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Totale omzet</p>
                    <h4 style={styles.summaryValue}>
                      {euro(berekenProject(actiefProject).totaleOmzet)}
                    </h4>
                  </div>
                  <div style={styles.summaryCard}>
                    <p style={styles.summaryLabel}>Geschatte winst</p>
                    <h4 style={styles.summaryValue}>
                      {euro(berekenProject(actiefProject).winst)}
                    </h4>
                  </div>
                </section>
              </>
            )}
          </section>
        </div>
      </div>

      {showNieuwProject && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Nieuw project aanmaken</h3>

            <label style={styles.label}>Projectnaam</label>
            <input
              style={styles.input}
              value={nieuwNaam}
              onChange={(e) => setNieuwNaam(e.target.value)}
            />

            <label style={styles.label}>Klantnaam</label>
            <input
              style={styles.input}
              value={nieuwKlant}
              onChange={(e) => setNieuwKlant(e.target.value)}
            />

            <label style={styles.label}>Startdatum</label>
            <input
              type="date"
              style={styles.input}
              value={nieuwDatum}
              onChange={(e) => setNieuwDatum(e.target.value)}
            />

            <label style={styles.label}>Status</label>
            <select
              style={styles.input}
              value={nieuwStatus}
              onChange={(e) => setNieuwStatus(e.target.value)}
            >
              <option>Lopend</option>
              <option>Verstuurd</option>
              <option>Betaald</option>
            </select>

            <div style={styles.modalButtons}>
              <button style={styles.primaryButton} onClick={maakNieuwProject}>
                Opslaan
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => setShowNieuwProject(false)}
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px 16px",
    color: "#111827",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: "15px",
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: "14px",
  },
  secondaryButton: {
    background: "#fff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: "14px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  statValue: {
    margin: "8px 0 0 0",
    fontSize: "26px",
    fontWeight: 700,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
  },
  sidebarCard: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
    height: "fit-content",
  },
  contentCard: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    padding: "20px",
  },
  cardHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
  },
  projectSubTitle: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  linkButton: {
    textDecoration: "none",
    background: "#fff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 600,
    fontSize: "14px",
  },
  deleteButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 600,
    fontSize: "14px",
  },
  projectList: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  projectItem: {
    width: "100%",
    textAlign: "left",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },
  projectItemActive: {
    border: "1px solid #111827",
    background: "#f3f4f6",
  },
  projectItemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
    marginBottom: "8px",
  },
  projectItemTitle: {
    fontSize: "14px",
  },
  projectMeta: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  projectAmounts: {
    marginTop: "8px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    fontWeight: 600,
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },
  statusOpen: {
    background: "#fef3c7",
    color: "#92400e",
  },
  statusSent: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  statusPaid: {
    background: "#dcfce7",
    color: "#166534",
  },
  emptyBox: {
    padding: "24px",
    color: "#6b7280",
    fontSize: "14px",
  },
  emptyStateLarge: {
    color: "#6b7280",
    padding: "40px 0",
  },
  formSection: {
    marginBottom: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    background: "#fff",
  },
  sectionBlock: {
    marginBottom: "24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "10px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
  },
  smallButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 12px",
    fontWeight: 600,
    fontSize: "13px",
  },
  emptyInner: {
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "18px",
    color: "#6b7280",
    fontSize: "14px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  tableInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  removeButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "10px",
    padding: "8px 10px",
    fontWeight: 700,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  summaryCard: {
    background: "#f9fafb",
    borderRadius: "14px",
    padding: "16px",
  },
  summaryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
  summaryValue: {
    margin: "8px 0 0 0",
    fontSize: "22px",
    fontWeight: 700,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  modal: {
    background: "#fff",
    width: "100%",
    maxWidth: "460px",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
    fontWeight: 700,
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
};
