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

export default function FactuurPage() {
  const [data, setData] = useState(getLegeData());

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) {
      setData(JSON.parse(opgeslagen));
    }
  }, []);

  const project =
    data.projecten.find((p) => p.id === data.activeProjectId) || null;

  const berekening = useMemo(() => {
    if (!project) return { subtotaal: 0, btw: 0, totaal: 0 };

    const margeFactor = 1 + Number(data.margePercentage || 0) / 100;

    const subtotaal = (project.materialen || []).reduce((sum, item) => {
      const verkoop =
        Number(item.inkoopprijs || 0) * margeFactor * Number(item.aantal || 0);
      return sum + verkoop;
    }, 0);

    const btw = subtotaal * 0.21;
    const totaal = subtotaal + btw;

    return { subtotaal, btw, totaal };
  }, [project, data.margePercentage]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        
        {/* NAVIGATIE */}
        <nav style={styles.navBar}>
          <a href="/" style={styles.navLink}>Overzicht</a>
          <a href="/project" style={styles.navLink}>Projecten</a>
          <a href="/calculatie" style={styles.navLink}>Calculatie</a>
          <a href="/factuur" style={styles.navLinkActive}>Factuur</a>
        </nav>

        {!project ? (
          <div style={styles.card}>
            Kies eerst een project
          </div>
        ) : (
          <>
            <div style={styles.toolbar}>
              <button onClick={() => window.print()} style={styles.printButton}>
                Print / PDF
              </button>
            </div>

            <div style={styles.paper}>
              
              {/* HEADER (alleen wat jij wil) */}
              <div style={styles.header}>
                <div>
                  <h2 style={styles.title}>{project.naam}</h2>
                  <p style={styles.text}>Klant: {project.klant}</p>
                  <p style={styles.text}>
                    Datum: {new Date().toLocaleDateString("nl-NL")}
                  </p>
                </div>
              </div>

              {/* MATERIALEN */}
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Omschrijving</th>
                    <th style={styles.th}>Aantal</th>
                    <th style={styles.th}>Prijs p.s.</th>
                    <th style={styles.th}>Subtotaal</th>
                  </tr>
                </thead>
                <tbody>
                  {(project.materialen || []).length === 0 ? (
                    <tr>
                      <td colSpan="4" style={styles.td}>
                        Geen materialen
                      </td>
                    </tr>
                  ) : (
                    project.materialen.map((item, index) => {
                      const verkoop =
                        Number(item.inkoopprijs || 0) *
                        (1 + Number(data.margePercentage || 0) / 100);

                      const totaal =
                        verkoop * Number(item.aantal || 0);

                      return (
                        <tr key={index}>
                          <td style={styles.td}>{item.product}</td>
                          <td style={styles.td}>{item.aantal}</td>
                          <td style={styles.td}>{euro(verkoop)}</td>
                          <td style={styles.td}>{euro(totaal)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* TOTALEN */}
              <div style={styles.totalBox}>
                <div style={styles.row}>
                  <span>Subtotaal</span>
                  <strong>{euro(berekening.subtotaal)}</strong>
                </div>

                <div style={styles.row}>
                  <span>BTW (21%)</span>
                  <strong>{euro(berekening.btw)}</strong>
                </div>

                <div style={{ ...styles.row, ...styles.total }}>
                  <span>Totaal</span>
                  <strong>{euro(berekening.totaal)}</strong>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px 16px",
    background: "#eef2f6",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  navBar: {
    display: "flex",
    gap: "12px",
    background: "#fff",
    padding: "12px",
    borderRadius: "16px",
    marginBottom: "24px",
  },
  navLink: {
    textDecoration: "none",
    color: "#111827",
    padding: "10px",
    borderRadius: "10px",
  },
  navLinkActive: {
    background: "#111827",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
  },

  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },

  printButton: {
    background: "#111827",
    color: "#fff",
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
  },

  paper: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },

  text: {
    margin: "4px 0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },

  totalBox: {
    marginTop: "20px",
    maxWidth: "300px",
    marginLeft: "auto",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  total: {
    borderTop: "1px solid #000",
    paddingTop: "10px",
    fontSize: "18px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
};
