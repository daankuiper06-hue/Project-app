"use client";

import { useState } from "react";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

export default function CalculatiePage() {
  const [materialen, setMaterialen] = useState([
    { product: "", aantal: 1, inkoop: 0, marge: 20, btw: 21 },
  ]);

  const [arbeid, setArbeid] = useState([
    { medewerker: "", datum: "", uren: 0, tarief: 25 },
  ]);

  function updateMateriaal(index, field, value) {
    const nieuw = [...materialen];
    nieuw[index][field] = field === "product" ? value : Number(value || 0);
    setMaterialen(nieuw);
  }

  function addMateriaal() {
    setMaterialen([
      ...materialen,
      { product: "", aantal: 1, inkoop: 0, marge: 20, btw: 21 },
    ]);
  }

  function removeMateriaal(index) {
    setMaterialen(materialen.filter((_, i) => i !== index));
  }

  function updateArbeid(index, field, value) {
    const nieuw = [...arbeid];
    nieuw[index][field] =
      field === "medewerker" || field === "datum" ? value : Number(value || 0);
    setArbeid(nieuw);
  }

  function addArbeid() {
    setArbeid([...arbeid, { medewerker: "", datum: "", uren: 0, tarief: 25 }]);
  }

  function removeArbeid(index) {
    setArbeid(arbeid.filter((_, i) => i !== index));
  }

  const materiaalTotaal = materialen.reduce((sum, item) => {
    const verkoopPerStuk = Number(item.inkoop) * (1 + Number(item.marge) / 100);
    return sum + verkoopPerStuk * Number(item.aantal);
  }, 0);

  const winstMateriaal = materialen.reduce((sum, item) => {
    const verkoopPerStuk = Number(item.inkoop) * (1 + Number(item.marge) / 100);
    const winstPerStuk = verkoopPerStuk - Number(item.inkoop);
    return sum + winstPerStuk * Number(item.aantal);
  }, 0);

  const arbeidTotaal = arbeid.reduce((sum, item) => {
    return sum + Number(item.uren) * Number(item.tarief);
  }, 0);

  const totaalOmzet = materiaalTotaal + arbeidTotaal;
  const totaleWinst = winstMateriaal + arbeidTotaal;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Calculatie</h1>
            <p style={styles.subtitle}>
              Materialen, arbeid, marge en totalen
            </p>
          </div>
          <a href="/" style={styles.backButton}>← Terug</a>
        </div>

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Materialen</h2>
            <button style={styles.primaryButton} onClick={addMateriaal}>
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
                  <th style={styles.th}>Marge %</th>
                  <th style={styles.th}>BTW %</th>
                  <th style={styles.th}>Verkoopprijs p.s.</th>
                  <th style={styles.th}>Winst €</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {materialen.map((item, index) => {
                  const verkoopPerStuk =
                    Number(item.inkoop) * (1 + Number(item.marge) / 100);
                  const winstEuro =
                    (verkoopPerStuk - Number(item.inkoop)) * Number(item.aantal);

                  return (
                    <tr key={index}>
                      <td style={styles.td}>
                        <input
                          style={styles.input}
                          value={item.product}
                          onChange={(e) =>
                            updateMateriaal(index, "product", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={item.aantal}
                          onChange={(e) =>
                            updateMateriaal(index, "aantal", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={item.inkoop}
                          onChange={(e) =>
                            updateMateriaal(index, "inkoop", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={item.marge}
                          onChange={(e) =>
                            updateMateriaal(index, "marge", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
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
                          style={styles.removeButton}
                          onClick={() => removeMateriaal(index)}
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
            <button style={styles.primaryButton} onClick={addArbeid}>
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
                {arbeid.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <input
                        style={styles.input}
                        value={item.medewerker}
                        onChange={(e) =>
                          updateArbeid(index, "medewerker", e.target.value)
                        }
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="date"
                        style={styles.input}
                        value={item.datum}
                        onChange={(e) =>
                          updateArbeid(index, "datum", e.target.value)
                        }
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        style={styles.input}
                        value={item.uren}
                        onChange={(e) =>
                          updateArbeid(index, "uren", e.target.value)
                        }
                      />
                    </td>
                    <td style={styles.td}>
                      <select
                        style={styles.input}
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
                        onClick={() => removeArbeid(index)}
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
            <h3 style={styles.summaryValue}>{euro(materiaalTotaal)}</h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Winst materialen</p>
            <h3 style={styles.summaryValue}>{euro(winstMateriaal)}</h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Omzet arbeid</p>
            <h3 style={styles.summaryValue}>{euro(arbeidTotaal)}</h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Totale omzet</p>
            <h3 style={styles.summaryValue}>{euro(totaalOmzet)}</h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Totale winst</p>
            <h3 style={styles.summaryValue}>{euro(totaleWinst)}</h3>
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1300px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  title: { margin: 0, fontSize: "32px", fontWeight: 700 },
  subtitle: { margin: "8px 0 0 0", color: "#6b7280" },
  backButton: {
    textDecoration: "none",
    color: "#111827",
    background: "#fff",
    border: "1px solid #d1d5db",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
  },
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
  input: {
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
