"use client";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

export default function FactuurPage() {
  let project = null;

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const projectId = Number(params.get("projectId"));
    const opgeslagen = localStorage.getItem("project-app-data-v1");
    const projecten = opgeslagen ? JSON.parse(opgeslagen) : [];
    project = projecten.find((p) => p.id === projectId) || null;
  }

  if (!project) {
    return (
      <main style={styles.page}>
        <div style={styles.paper}>
          <h1 style={styles.title}>Factuur</h1>
          <p style={styles.text}>Geen project gevonden.</p>
          <a href="/" style={styles.backButton}>← Terug naar dashboard</a>
        </div>
      </main>
    );
  }

  const materiaalSubtotaal = (project.materialen || []).reduce((sum, item) => {
    return sum + Number(item.aantal || 0) * Number(item.prijsInclBtw || 0);
  }, 0);

  const arbeidSubtotaal = (project.arbeid || []).reduce((sum, item) => {
    return sum + Number(item.uren || 0) * Number(item.tarief || 0);
  }, 0);

  const btwBedrag = materiaalSubtotaal * 0.21;
  const totaalFactuur = materiaalSubtotaal + arbeidSubtotaal;

  return (
    <main style={styles.page}>
      <div style={styles.toolbar}>
        <a href="/" style={styles.backButton}>← Terug</a>
        <button onClick={() => window.print()} style={styles.printButton}>
          Afdrukken / PDF
        </button>
      </div>

      <div style={styles.paper}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.invoiceTitle}>FACTUUR</h1>
            <p style={styles.muted}>Factuurnummer: {project.id}</p>
            <p style={styles.muted}>Project: {project.naam}</p>
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
            <p style={styles.text}>{project.klant}</p>
            <p style={styles.text}>Startdatum: {project.startdatum}</p>
            <p style={styles.text}>Status: {project.status}</p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Factuurgegevens</h3>
            <p style={styles.text}>
              Datum: {new Date().toLocaleDateString("nl-NL")}
            </p>
            <p style={styles.text}>Betalingstermijn: 14 dagen</p>
          </div>
        </section>

        <h3 style={styles.blockTitle}>Materialen</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Omschrijving</th>
              <th style={styles.th}>Aantal</th>
              <th style={styles.th}>Prijs p.s. incl. btw</th>
              <th style={styles.th}>BTW %</th>
              <th style={styles.th}>Subtotaal</th>
            </tr>
          </thead>
          <tbody>
            {(project.materialen || []).length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="5">Geen materialen toegevoegd</td>
              </tr>
            ) : (
              project.materialen.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.omschrijving}</td>
                  <td style={styles.td}>{item.aantal}</td>
                  <td style={styles.td}>{euro(item.prijsInclBtw)}</td>
                  <td style={styles.td}>{item.btw}%</td>
                  <td style={styles.td}>
                    {euro(Number(item.aantal) * Number(item.prijsInclBtw))}
                  </td>
                </tr>
              ))
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
            {(project.arbeid || []).length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="5">Geen arbeid toegevoegd</td>
              </tr>
            ) : (
              project.arbeid.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.medewerker}</td>
                  <td style={styles.td}>{item.datum}</td>
                  <td style={styles.td}>{item.uren}</td>
                  <td style={styles.td}>{euro(item.tarief)}</td>
                  <td style={styles.td}>
                    {euro(Number(item.uren) * Number(item.tarief))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={styles.totalBox}>
          <div style={styles.totalRow}>
            <span>Materialen incl. btw</span>
            <strong>{euro(materiaalSubtotaal)}</strong>
          </div>
          <div style={styles.totalRow}>
            <span>Arbeid</span>
            <strong>{euro(arbeidSubtotaal)}</strong>
          </div>
          <div style={styles.totalRow}>
            <span>BTW over materialen</span>
            <strong>{euro(btwBedrag)}</strong>
          </div>
          <div style={{ ...styles.totalRow, ...styles.totalFinal }}>
            <span>Totaal factuur</span>
            <strong>{euro(totaalFactuur)}</strong>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eef2f6",
    padding: "24px 16px",
    color: "#111827",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },
  toolbar: {
    maxWidth: "1000px",
    margin: "0 auto 16px auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  backButton: {
    background: "#fff",
    border: "1px solid #d1d5db",
    color: "#111827",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    fontWeight: 600,
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
    maxWidth: "1000px",
    margin: "0 auto",
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
    maxWidth: "380px",
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
