"use client";

export default function ProjectPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Project</h1>
            <p style={styles.subtitle}>Projectgegevens en status</p>
          </div>
          <a href="/" style={styles.backButton}>← Terug</a>
        </header>

        <section style={styles.card}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Projectnaam</label>
              <input style={styles.input} placeholder="Projectnaam" />
            </div>
            <div>
              <label style={styles.label}>Klantnaam</label>
              <input style={styles.input} placeholder="Klantnaam" />
            </div>
            <div>
              <label style={styles.label}>Datum</label>
              <input type="date" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Status</label>
              <select style={styles.input}>
                <option>Lopend</option>
                <option>Verstuurd</option>
                <option>Betaald</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { margin: "6px 0 0 0", color: "#6b7280" },
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 13,
    color: "#374151",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #d1d5db",
  },
};
