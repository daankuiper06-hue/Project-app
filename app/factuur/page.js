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

export default function FacturenPage() {
  const [data, setData] = useState(getLegeData());

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) {
      setData(JSON.parse(opgeslagen));
    }
  }, []);

  const actiefProject =
    data.projecten.find((p) => p.id === data.activeProjectId) || null;

  const totaal = useMemo(() => {
    if (!actiefProject) return { materialen: 0, arbeid: 0, totaal: 0 };

    const margeFactor = 1 + Number(data.margePercentage || 0) / 100;

    const materialen = (actiefProject.materialen || []).reduce((sum, item) => {
      const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
      return sum + verkoopPerStuk * Number(item.aantal || 0);
    }, 0);

    const arbeid = (actiefProject.arbeid || []).reduce((sum, item) => {
      return sum + Number(item.uren || 0) * Number(item.tarief || 0);
    }, 0);

    return {
      materialen,
      arbeid,
      totaal: materialen + arbeid,
    };
  }, [actiefProject, data.margePercentage]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.navBar}>
          <a href="/" style={styles.navLink}>Overzicht</a>
          <a href="/projecten" style={styles.navLink}>Projecten</a>
          <a href="/calculatie" style={styles.navLink}>Calculatie</a>
          <a href="/facturen" style={styles.navLinkActive}>Facturen</a>
        </nav>

        {!actiefProject ? (
          <section style={styles.paper}>
            <h1 style={styles.title}>Factuur</h1>
            <p style={styles.text}>Kies eerst een actief project.</p>
          </section>
        ) : (
          <>
            <div style={styles.toolbar}>
              <button onClick={() => window.print()} style={styles.printButton}>
                Afdrukken / PDF
              </button>
            </div>

            <section style={styles.paper}>
              <header style={styles.header}>
                <div>
                  <h1 style={styles.invoiceTitle}>FACTUUR</h1>
                  <p style={styles.muted}>Project: {actiefProject.naam}</p>
                  <p style={styles.muted}>
                    Datum: {new Date().toLocaleDateString("nl-NL")}
                  </p>
                </div>

                <div style={styles.companyBlock}>
                  <h2 style={styles.companyName}>D Kuiper Techniek</h2>
                  <p style={styles.muted}>Elektra & installaties</p>
                  <p style={styles.muted}>KvK: nog invullen</p>
                  <p style={styles.muted}>BTW: nog invullen</p>
                </div>
              </header>

              <section style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <h3 style={styles.infoTitle}>Klant</h3>
                  <p style={styles.text}>{actiefProject.klant}</p>
                  <p style={styles.text}>Startdatum: {actiefProject.startdatum}</p>
                  <p style={styles.text}>Status: {actiefProject.status}</p>
                </div>

                <div style={styles.infoBox}>
                  <h3 style={styles.infoTitle}>Factuurgegevens</h3>
                  <p style={styles.text}>Betalingstermijn: 14 dagen</p>
                  <p style={styles.text}>Marge materialen: {data.margePercentage}%</p>
                </div>
              </section>

              <h3 style={styles.blockTitle}>Materialen</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Omschrijving</th>
                    <th style={styles.th}>Aantal</th>
                    <th style={styles.th}>Verkoopprijs p.s.</th>
                    <th style={styles.th}>Subtotaal</th>
                  </tr>
                </thead>
                <tbody>
                  {(actiefProject.materialen || []).length === 0 ? (
                    <tr>
                      <td style={styles.td} colSpan="4">Geen materialen toegevoegd</td>
                    </tr>
                  ) : (
                    actiefProject.materialen.map((item, index) => {
                      const verkoopPerStuk =
                        Number(item.inkoopprijs || 0) *
                        (1 + Number(data.margePercentage || 0) / 100);

                      return (
                        <tr key={index}>
                          <td style={styles.td}>{item.product}</td>
                          <td style={styles.td}>{item.aantal}</td>
                          <td style={styles.td}>{euro(verkoopPerStuk)}</td>
                          <td style={styles.td}>
                            {euro(verkoopPerStuk * Number(item.aantal || 0))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <h3 style={styles.blockTitle}>Arbeid</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Medewerker</th>
                    <th style={styles.th}>Datum</th>
                    <th style={styles.th}>Uren</th>
                    <th style={styles.th}>Tarief</th>
                    <th style={styles.th}>Subtotaal</th>
                  </tr>
                </thead>
                <tbody>
                  {(actiefProject.arbeid || []).length === 0 ? (
                    <tr>
                      <td style={styles.td} colSpan="5">Geen arbeid toegevoegd</td>
                    </tr>
                  ) : (
                    actiefProject.arbeid.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{item.medewerker}</td>
                        <td style={styles.td}>{item.datum}</td>
                        <td style={styles.td}>{item.uren}</td>
                        <td style={styles.td}>{euro(item.tarief)}</td>
                        <td style={styles.td}>
                          {euro(Number(item.uren || 0) * Number(item.tarief || 0))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div style={styles.totalBox}>
                <div style={styles.totalRow}>
                  <span>Materialen</span>
                  <strong>{euro(totaal.materialen)}</strong>
                </div>
                <div style={styles.totalRow}>
                  <span>Arbeid</span>
                  <strong>{euro(totaal.arbeid)}</strong>
                </div>
                <div style={{ ...styles.totalRow, ...styles.totalFinal }}>
                  <span>Totaal factuur</span>
                  <strong>{euro(totaal.totaal)}</strong>
                </div>
              </div>
            </section>
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
    maxWidth: "1100px",
    margin: "0 auto",
  },
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
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "16px",
  },
  printButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
  paper: {
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  title: {
    marginTop: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  invoiceTitle: {
    margin: 0,
    fontSize: "36px",
    fontWeight: 800,
  },
  companyBlock: {
    textAlign: "right",
  },
  companyName: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  muted: {
    margin: "4px 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },
  infoBox: {
    background: "#f9fafb",
    padding: "18px",
    borderRadius: "12px",
  },
  infoTitle: {
    marginTop: 0,
    marginBottom: "10px",
    fontSize: "15px",
    fontWeight: 700,
  },
  blockTitle: {
    marginTop: "24px",
    marginBottom: "12px",
    fontSize: "18px",
  },
  text: {
    margin: "4px 0",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "24px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f3f4f6",
    borderBottom: "1px solid #d1d5db",
    fontSize: "13px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  totalBox: {
    marginLeft: "auto",
    maxWidth: "360px",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "16px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "15px",
  },
  totalFinal: {
    borderTop: "1px solid #d1d5db",
    paddingTop: "12px",
    marginTop: "12px",
    fontSize: "18px",
  },
};
