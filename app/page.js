export default function Home() {
  const projecten = [];

  const totaleOmzet = 0;
  const totaleWinst = 0;
  const openstaand = 0;
  const betaald = 0;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Overzicht</h1>
            <p style={styles.subtitle}>
              Projecten, omzet, winst en status in één overzicht
            </p>
          </div>

          <button style={styles.primaryButton}>
            + Nieuw project
          </button>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Totale omzet</p>
            <h2 style={styles.statValue}>€ {totaleOmzet.toFixed(2)}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Totale winst</p>
            <h2 style={styles.statValue}>€ {totaleWinst.toFixed(2)}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Openstaand</p>
            <h2 style={styles.statValue}>{openstaand}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Betaald</p>
            <h2 style={styles.statValue}>{betaald}</h2>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Projecten</h3>
          </div>

          {projecten.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📁</div>
              <h4 style={styles.emptyTitle}>Nog geen projecten</h4>
              <p style={styles.emptyText}>
                Maak je eerste project aan om hier je overzicht te zien.
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Project</th>
                    <th style={styles.th}>Klant</th>
                    <th style={styles.th}>Startdatum</th>
                    <th style={styles.th}>Omzet</th>
                    <th style={styles.th}>Winst</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projecten.map((project, index) => (
                    <tr key={index}>
                      <td style={styles.tdStrong}>{project.naam}</td>
                      <td style={styles.td}>{project.klant}</td>
                      <td style={styles.td}>{project.startdatum}</td>
                      <td style={styles.td}>{project.omzet}</td>
                      <td style={styles.td}>{project.winst}</td>
                      <td style={styles.td}>{project.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f6f8",
    padding: "24px 16px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: "#111827",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
  },
  primaryButton: {
    backgroundColor: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  statValue: {
    margin: "10px 0 0 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  tableTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },
  emptyState: {
    padding: "56px 24px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "34px",
    marginBottom: "12px",
  },
  emptyTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
  },
  emptyText: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
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
    padding: "14px 20px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#374151",
  },
  tdStrong: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },
};
