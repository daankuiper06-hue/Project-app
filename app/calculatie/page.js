"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dkuiper_app_data_v1";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

function getLegeData() {
  return {
    activeProjectId: null,
    margePercentage: 20,
    projecten: [],
  };
}

export default function CalculatiePage() {
  const [data, setData] = useState(getLegeData());
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) {
      setData(JSON.parse(opgeslagen));
    }
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (geladen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, geladen]);

  const actiefProject =
    data.projecten.find((p) => p.id === data.activeProjectId) || null;

  function kiesProject(id) {
    setData((prev) => ({ ...prev, activeProjectId: id }));
  }

  function updateMarge(value) {
    setData((prev) => ({
      ...prev,
      margePercentage: Number(value || 0),
    }));
  }

  function voegMateriaalToe() {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) =>
        p.id === actiefProject.id
          ? {
              ...p,
              materialen: [
                ...(p.materialen || []),
                {
                  product: "",
                  aantal: 1,
                  inkoopprijs: 0,
                  btw: 21,
                },
              ],
            }
          : p
      ),
    }));
  }

  function updateMateriaal(index, field, value) {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) => {
        if (p.id !== actiefProject.id) return p;

        const materialen = [...(p.materialen || [])];
        materialen[index] = {
          ...materialen[index],
          [field]:
            field === "product" ? value : Number(value === "" ? 0 : value),
        };

        return { ...p, materialen };
      }),
    }));
  }

  function verwijderMateriaal(index) {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) =>
        p.id === actiefProject.id
          ? {
              ...p,
              materialen: (p.materialen || []).filter((_, i) => i !== index),
            }
          : p
      ),
    }));
  }

  function voegArbeidToe() {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) =>
        p.id === actiefProject.id
          ? {
              ...p,
              arbeid: [
                ...(p.arbeid || []),
                {
                  medewerker: "",
                  datum: "",
                  uren: 0,
                  tarief: 25,
                },
              ],
            }
          : p
      ),
    }));
  }

  function updateArbeid(index, field, value) {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) => {
        if (p.id !== actiefProject.id) return p;

        const arbeid = [...(p.arbeid || [])];
        arbeid[index] = {
          ...arbeid[index],
          [field]:
            field === "medewerker" || field === "datum"
              ? value
              : Number(value === "" ? 0 : value),
        };

        return { ...p, arbeid };
      }),
    }));
  }

  function verwijderArbeid(index) {
    if (!actiefProject) return;

    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) =>
        p.id === actiefProject.id
          ? {
              ...p,
              arbeid: (p.arbeid || []).filter((_, i) => i !== index),
            }
          : p
      ),
    }));
  }

  const totalen = useMemo(() => {
    if (!actiefProject) {
      return {
        materiaalOmzet: 0,
        winstMaterialen: 0,
        arbeidOmzet: 0,
        totaleOmzet: 0,
        totaleWinst: 0,
      };
    }

    const margeFactor = 1 + Number(data.margePercentage || 0) / 100;

    const materiaalOmzet = (actiefProject.materialen || []).reduce((sum, item) => {
      const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      return sum + verkoopPerStuk * Number(item.aantal || 0);
    }, 0);

    const winstMaterialen = (actiefProject.materialen || []).reduce((sum, item) => {
      const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      const winst = (verkoopPerStuk - Number(item.inkoopprijs || 0)) * Number(item.aantal || 0);
      return sum + winst;
    }, 0);

    const arbeidOmzet = (actiefProject.arbeid || []).reduce((sum, item) => {
      return sum + Number(item.uren || 0) * Number(item.tarief || 0);
    }, 0);

    return {
      materiaalOmzet,
      winstMaterialen,
      arbeidOmzet,
      totaleOmzet: materiaalOmzet + arbeidOmzet,
      totaleWinst: winstMaterialen + arbeidOmzet,
    };
  }, [actiefProject, data.margePercentage]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.navBar}>
          <a href="/" style={styles.navLink}>Overzicht</a>
          <a href="/projecten" style={styles.navLink}>Projecten</a>
          <a href="/calculatie" style={styles.navLinkActive}>Calculatie</a>
          <a href="/facturen" style={styles.navLink}>Facturen</a>
        </nav>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Calculatie</h1>
            <p style={styles.subtitle}>Materialen, arbeid en marge berekenen</p>
          </div>
        </div>

        <section style={styles.card}>
          <div style={styles.topGrid}>
            <div>
              <label style={styles.label}>Actief project</label>
              <select
                style={styles.input}
                value={data.activeProjectId || ""}
                onChange={(e) => kiesProject(Number(e.target.value))}
              >
                <option value="">Kies project</option>
                {data.projecten.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.naam}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Marge materialen (%)</label>
              <input
                type="number"
                style={styles.input}
                value={data.margePercentage}
                onChange={(e) => updateMarge(e.target.value)}
              />
            </div>
          </div>
        </section>

        {!actiefProject ? (
          <section style={styles.card}>
            <div style={styles.empty}>
              Kies eerst een project op de projectenpagina of selecteer hierboven een project.
            </div>
          </section>
        ) : (
          <>
            <section style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Materialen</h2>
                <button style={styles.primaryButton} onClick={voegMateriaalToe}>
                  + Materiaal
                </button>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Aantal</th>
                      <th style={styles.th}>Inkoopprijs p.s.</th>
                      <th style={styles.th}>BTW %</th>
                      <th style={styles.th}>Verkoopprijs p.s.</th>
                      <th style={styles.th}>Winst €</th>
                      <th style={styles.th}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(actiefProject.materialen || []).map((item, index) => {
                      const verkoopPerStuk =
                        Number(item.inkoopprijs || 0) *
                        (1 + Number(data.margePercentage || 0) / 100);

                      const winstEuro =
                        (verkoopPerStuk - Number(item.inkoopprijs || 0)) *
                        Number(item.aantal || 0);

                      return (
                        <tr key={index}>
                          <td style={styles.td}>
                            <input
                              style={styles.inputSmall}
                              value={item.product}
                              onChange={(e) =>
                                updateMateriaal(index, "product", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.inputSmall}
                              value={item.aantal}
                              onChange={(e) =>
                                updateMateriaal(index, "aantal", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.inputSmall}
                              value={item.inkoopprijs}
                              onChange={(e) =>
                                updateMateriaal(index, "inkoopprijs", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.inputSmall}
                              value={item.btw}
                              onChange={(e) =>
                                updateMateriaal(index, "btw", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>{euro(verkoopPerStuk)}</td>
                          <td style={styles.td}>{euro(winstEuro)}</td>
                          <td style={styles.td}>
                            <button
                              style={styles.deleteButton}
                              onClick={() => verwijderMateriaal(index)}
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

            <section style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Arbeid</h2>
                <button style={styles.primaryButton} onClick={voegArbeidToe}>
                  + Arbeid
                </button>
              </div>

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
                    {(actiefProject.arbeid || []).map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>
                          <input
                            style={styles.inputSmall}
                            value={item.medewerker}
                            onChange={(e) =>
                              updateArbeid(index, "medewerker", e.target.value)
                            }
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="date"
                            style={styles.inputSmall}
                            value={item.datum}
                            onChange={(e) =>
                              updateArbeid(index, "datum", e.target.value)
                            }
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            style={styles.inputSmall}
                            value={item.uren}
                            onChange={(e) =>
                              updateArbeid(index, "uren", e.target.value)
                            }
                          />
                        </td>
                        <td style={styles.td}>
                          <select
                            style={styles.inputSmall}
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
                          {euro(Number(item.uren || 0) * Number(item.tarief || 0))}
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.deleteButton}
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
            </section>

            <section style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Omzet materialen</p>
                <h3 style={styles.summaryValue}>{euro(totalen.materiaalOmzet)}</h3>
              </div>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Winst materialen</p>
                <h3 style={styles.summaryValue}>{euro(totalen.winstMaterialen)}</h3>
              </div>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Omzet arbeid</p>
                <h3 style={styles.summaryValue}>{euro(totalen.arbeidOmzet)}</h3>
              </div>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Totale omzet</p>
                <h3 style={styles.summaryValue}>{euro(totalen.totaleOmzet)}</h3>
              </div>
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Totale winst</p>
                <h3 style={styles.summaryValue}>{euro(totalen.totaleWinst)}</h3>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1300px", margin: "0 auto" },
  navBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    background: "#fff",
    padding: "12px",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  navLink: {
    textDecoration: "none",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
  navLinkActive: {
    textDecoration: "none",
    color: "#fff",
    background: "#111827",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
  header: { marginBottom: "24px" },
  title: { margin: 0, fontSize: "32px", fontWeight: 700 },
  subtitle: { margin: "8px 0 0 0", color: "#6b7280" },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
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
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  sectionTitle: { margin: 0, fontSize: "20px", fontWeight: 700 },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 600,
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    color: "#6b7280",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  inputSmall: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  deleteButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "10px",
    padding: "8px 10px",
    fontWeight: 700,
  },
  empty: {
    padding: "24px",
    background: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  summaryCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  summaryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
  summaryValue: {
    margin: "8px 0 0 0",
    fontSize: "24px",
    fontWeight: 700,
  },
};
