"use client";

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <h1 style={styles.title}>D Kuiper Techniek</h1>
          <p style={styles.subtitle}>
            Projecten, calculaties en facturen in één systeem
          </p>
        </header>

        <nav style={styles.navBar}>
          <a href="/" style={styles.navLinkActive}>Overzicht</a>
          <a href="/projecten" style={styles.navLink}>Projecten</a>
          <a href="/calculatie" style={styles.navLink}>Calculatie</a>
          <a href="/facturen" style={styles.navLink}>Facturen</a>
        </nav>

        <section style={styles.cards}>
          <a href="/projecten" style={styles.card}>
            <h2 style={styles.cardTitle}>Projecten</h2>
            <p style={styles.cardText}>
              Projecten aanmaken, wijzigen en status beheren
            </p>
          </a>

          <a href="/calculatie" style={styles.card}>
            <h2 style={styles.cardTitle}>Calculatie</h2>
            <p style={styles.cardText}>
              Materialen, arbeid, marge en totalen berekenen
            </p>
          </a>

          <a href="/facturen" style={styles.card}>
            <h2 style={styles.cardTitle}>Facturen</h2>
            <p style={styles.cardText}>
              Factuur bekijken, afdrukken en opslaan als PDF
            </p>
          </a>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px 16px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  hero: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: 700,
  },
  subtitle: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
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
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    textDecoration: "none",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "8px",
    fontSize: "20px",
  },
  cardText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
};
