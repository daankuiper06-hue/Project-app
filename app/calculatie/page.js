"use client";

import { useState } from "react";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

export default function CalculatiePage() {
  const [regels, setRegels] = useState([
    {
      omschrijving: "",
      aantal: 1,
      inkoopPrijs: 0,
      marge: 20,
      btw: 21,
    },
  ]);

  function updateRegel(index, field, value) {
    const copy = [...regels];
    copy[index][field] =
      field === "omschrijving" ? value : Number(value === "" ? 0 : value);
    setRegels(copy);
  }

  function voegRegelToe() {
    setRegels([
      ...regels,
      {
        omschrijving: "",
        aantal: 1,
        inkoopPrijs: 0,
        marge: 20,
        btw: 21,
      },
    ]);
  }

  function verwijderRegel(index) {
    setRegels(regels.filter((_, i) => i !== index));
  }

  const totalen = regels.reduce(
    (sum, r) => {
      const verkoopPrijs = Number(r.inkoopPrijs) * (1 + Number(r.marge) / 100);
      const subtotaal = Number(r.aantal) * verkoopPrijs;
      const winst = Number(r.aantal) * (verkoopPrijs - Number(r.inkoopPrijs));

      sum.omzet += subtotaal;
      sum.winst += winst;
      return sum;
    },
    { omzet: 0, winst: 0 }
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Calculatie</h1>
            <p style={styles.subtitle}>Materialen, marge, btw en winst</p>
          </div>
          <div style={styles.headerButtons}>
            <button style={styles.primaryButton} onClick={voegRegelToe}>
              + Regel
            </button>
            <a href="/" style={styles.backButton}>← Terug</a>
          </div>
        </header>

        <section style={styles.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Omschrijving</th>
                  <th style={styles.th}>Aantal</th>
                  <th style={styles.th}>Inkoop p.s.</th>
                  <th style={styles.th}>Marge %</th>
                  <th style={styles.th}>BTW %</th>
                  <th style={styles.th}>Verkoop p.s.</th>
                  <th style={styles.th}>Subtotaal</th>
                  <th style={styles.th}>Winst</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {regels.map((regel, index) => {
                  const verkoopPrijs =
                    Number(regel.inkoopPrijs) * (1 + Number(regel.marge) / 100);
                  const subtotaal = Number(regel.aantal) * verkoopPrijs;
                  const winst =
                    Number(regel.aantal) *
                    (verkoopPrijs - Number(regel.inkoopPrijs));

                  return (
                    <tr key={index}>
                      <td style={styles.td}>
                        <input
                          style={styles.input}
                          value={regel.omschrijving}
                          onChange={(e) =>
                            updateRegel(index, "omschrijving", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={regel.aantal}
                          onChange={(e) =>
                            updateRegel(index, "aantal", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={regel.inkoopPrijs}
                          onChange={(e) =>
                            updateRegel(index, "inkoopPrijs", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={regel.marge}
                          onChange={(e) =>
                            updateRegel(index, "marge", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          style={styles.input}
                          value={regel.btw}
                          onChange={(e) =>
                            updateRegel(index, "btw", e.target.value)
                          }
                        />
                      </td>
                      <td style={styles.td}>{euro(verkoopPrijs)}</td>
                      <td style={styles.td}>{euro(subtotaal)}</td>
                      <td style={styles.td}>{euro(winst)}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.removeButton}
                          onClick={() => verwijderRegel(index)}
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

          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span>Totale omzet</span>
              <strong>{euro(totalen.omzet)}</strong>
            </div>
            <div style={styles.totalRow}>
              <span>Totale winst</span>
              <strong>{euro(totalen.winst)}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  headerButtons: { display: "flex", gap: 10, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { margin: "6px 0 0 0", color: "#6b7280" },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 600,
  },
  backButton: {
    textDecoration: "none",
    background: "#fff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "950px",
  },
  th: {
    textAlign: "left",
    padding: 12,
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #d1d5db",
  },
  removeButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    fontWeight: 700,
  },
  totalBox: {
    marginTop: 20,
    marginLeft: "auto",
    maxWidth: 320,
    background: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
};
