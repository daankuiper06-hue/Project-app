"use client";

import { useEffect, useMemo, useState } from "react";

function getProjecten() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("project-app-data-v2");
  return raw ? JSON.parse(raw) : [];
}

function saveProjecten(projecten) {
  localStorage.setItem("project-app-data-v2", JSON.stringify(projecten));
}

export default function ProjectPage() {
  const [projecten, setProjecten] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const data = getProjecten();
    setProjecten(data);

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setProject(data.find((p) => p.id === id) || null);
  }, []);

  const projectId = useMemo(() => project?.id || "", [project]);

  function updateField(field, value) {
    const updated = projecten.map((p) =>
      p.id === projectId ? { ...p, [field]: value } : p
    );
    setProjecten(updated);
    saveProjecten(updated);
    setProject(updated.find((p) => p.id === projectId));
  }

  if (!project) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Project niet gevonden</h1>
            <a href="/" style={styles.backButton}>← Terug</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Project</h1>
            <p style={styles.subtitle}>Gegevens van dit project</p>
          </div>
          <div style={styles.buttons}>
            <a href={`/calculatie?id=${project.id}`} style={styles.linkButton}>
              Calculatie
            </a>
            <a href={`/factuur?id=${project.id}`} style={styles.linkButton}>
              Factuur
            </a>
            <a href="/" style={styles.backButton}>← Terug</a>
          </div>
        </header>

        <section style={styles.card}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Projectnaam</label>
              <input
                style={styles.input}
                value={project.naam}
                onChange={(e) => updateField("naam", e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>Klantnaam</label>
              <input
                style={styles.input}
                value={project.klant}
                onChange={(e) => updateField("klant", e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>Datum</label>
              <input
                type="date"
                style={styles.input}
                value={project.datum}
                onChange={(e) => updateField("datum", e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>Status</label>
              <select
                style={styles.input}
                value={project.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
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
  buttons: { display: "flex", gap: 10, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { margin: "6px 0 0 0", color: "#6b7280" },
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
  linkButton: {
    textDecoration: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
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
};
