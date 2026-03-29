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

export default function Home() {
  const [data, setData] = useState(getLegeData());

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) {
      setData(JSON.parse(opgeslagen));
    }
  }, []);

  const stats = useMemo(() => {
    const margeFactor = 1 + Number(data.margePercentage || 0) / 100;

    let totaleOmzet = 0;
    let totaleWinst = 0;
    let lopend = 0;
    let verstuurd = 0;
    let betaald = 0;

    data.projecten.forEach((project) => {
      if (project.status === "Lopend") lopend++;
      if (project.status === "Verstuurd") verstuurd++;
      if (project.status === "Betaald") betaald++;

      const materiaalOmzet = (project.materialen || []).reduce((sum, item) => {
        const verkoop =
          Number(item.inkoopprijs || 0) * margeFactor * Number(item.aantal || 0);
        return sum + verkoop;
      }, 0);

      const winstMaterialen = (project.materialen || []).reduce((sum, item) => {
        const verkoop =
          Number(item.inkoopprijs || 0) * margeFactor;
        const winst =
          (verkoop - Number(item.inkoopprijs || 0)) *
          Number(item.aantal || 0);
        return sum + winst;
      }, 0);

      const arbeidOmzet = (project.arbeid || []).reduce((sum, item) => {
        return sum + Number(item.uren || 0) * Number(item.tarief || 0);
      }, 0);

      totaleOmzet += materiaalOmzet + arbeidOmzet;
      totaleWinst += winstMaterialen + arbeidOmzet;
    });

    return {
      totaleOmzet,
      totaleWinst,
      aantalProjecten: data.projecten.length,
      lopend,
      verstuurd,
      betaald,
    };
  }, [data]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <h1 style={styles.title}>D Kuiper Techniek</h1>
          <p style={styles.subtitle}>
            Overzicht van projecten, omzet en winst
          </p>
        </header>

        <nav style={styles.navBar}>
          <a href="/" style={styles.navLinkActive}>Overzicht</a>
          <a href="/projecten" style={styles.navLink}>Projecten</a>
          <a href="/calculatie" style={styles.navLink}>Calculatie</a>
          <a href="/facturen" style={styles.navLink}>Facturen</a>
        </nav>

        {/* STATS */}
        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.label}>Totale omzet</p>
            <h2 style={styles.value}>{euro(stats.totaleOmzet)}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Totale winst</p>
            <h2 style={styles.value}>{euro(stats.totaleWinst)}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Projecten</p>
            <h2 style={styles.value}>{stats.aantalProjecten}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Status</p>
            <h2 style={styles.value}>
              {stats.lopend} / {stats.verstuurd} / {stats.betaald}
            </h2>
            <p style={styles.small}>
              Lopend / Verstuurd / Betaald
            </p>
          </div>
        </section>

        {/* PROJECT OVERVIEW */}
        <section style={styles.mainCard}>
          <div style={styles.topRow}>
            <h3 style={styles.sectionTitle}>Projecten</h3>
            <a href="/projecten" style={styles.button}>
              + Nieuw project
            </a>
          </div>

          {data.projecten.length === 0 ? (
            <div style={styles.empty}>
              Nog geen projecten aangemaakt.
            </div>
          ) : (
            <div style={styles.projectList}>
              {data.projecten.map((p) => (
                <div key={p.id} style={styles.projectItem}>
                  <strong>{p.naam}</strong>
                  <div style={styles.meta}>{p.klant}</div>
                  <div style={styles.meta}>{p.startdatum}</div>
                  <div style={styles.badge}>{p.status}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  hero: { marginBottom: "24px" },
  title: { margin: 0, fontSize: "34px", fontWeight: 700 },
  subtitle: { margin: "8px 0 0 0", color: "#6b7280" },

  navBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    background: "#fff",
    padding: "12px",
    borderRadius: "16px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
  },

  label: { color: "#6b7280", fontSize: "14px" },

  value: { marginTop: "10px", fontSize: "26px", fontWeight: 700 },

  small: { fontSize: "12px", color: "#6b7280" },

  mainCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },

  sectionTitle: { margin: 0 },

  button: {
    background: "#111827",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
  },

  empty: {
    padding: "24px",
    background: "#f9fafb",
    borderRadius: "12px",
  },

  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  projectItem: {
    padding: "12px",
    borderRadius: "12px",
    background: "#f9fafb",
  },

  meta: { fontSize: "13px", color: "#6b7280" },

  badge: {
    marginTop: "6px",
    fontSize: "12px",
    background: "#e5e7eb",
    padding: "4px 8px",
    borderRadius: "8px",
  },
};
