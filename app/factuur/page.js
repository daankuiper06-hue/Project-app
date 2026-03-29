"use client";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

export default function FactuurPage() {
  const regels = [
    { omschrijving: "Materiaal voorbeeld", aantal: 2, prijs: 45, btw: 21 },
    { omschrijving: "Arbeid voorbeeld", aantal: 4, prijs: 25, btw: 21 },
  ];

  const subtotaal = regels.reduce((sum, r) => sum + r.aantal * r.prijs, 0);
  const btw = subtotaal * 0.21;
  const totaal = subtotaal + btw;

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
            <p style={styles.muted}>Factuurnummer: 2026-001</p>
            <p style={styles.muted}>Datum: {new Date().toLocaleDateString("nl-NL")}</p>
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
            <h3 style={styles.infoTitle}>Factuur aan</h3>
            <p style={styles.text}>Klantnaam</p>
            <p style={styles.text}>Adres</p>
            <p style={styles.text}>Postcode Plaats</p>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Project</h3>
            <p style={styles.text}>Projectnaam</p>
            <p style={styles.text}>Werkdatum</p>
          </div>
        </section>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Omschrijving</th>
              <th style={styles.th}>Aantal</th>
              <th style={styles.th}>Prijs p.s.</th>
              <th style={styles.th}>BTW %</th>
              <th style={styles.th}>Totaal</th>
            </tr>
          </thead>
          <tbody>
            {regels.map((regel, index) => (
              <tr key={index}>
                <td style={styles.td}>{regel.omschrijving}</td>
                <td style={styles.td}>{regel.aantal}</td>
                <td style={styles.td}>{euro(regel.prijs)}</td>
                <td style={styles.td}>{regel.btw}%</td>
                <td style={styles.td}>{euro(regel.aantal * regel.prijs)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totalBox}>
          <div style={styles.totalRow}>
            <span>Subtotaal</span>
            <strong>{euro(subtotaal)}</strong>
          </div>
          <div style={styles.totalRow}>
            <span>BTW</span>
            <strong>{euro(btw)}</strong>
          </div>
          <div style={{ ...styles.totalRow, ...styles.totalFinal }}>
            <span>Totaal</span>
            <strong>{euro(totaal)}</strong>
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
