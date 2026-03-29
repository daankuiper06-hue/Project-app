"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dkuiper_app_data_v1";

function getLegeProjectenData() {
  return {
    activeProjectId: null,
    margePercentage: 20,
    projecten: [],
  };
}

export default function ProjectenPage() {
  const [data, setData] = useState(getLegeProjectenData());
  const [geladen, setGeladen] = useState(false);

  const [nieuwProject, setNieuwProject] = useState({
    naam: "",
    klant: "",
    startdatum: "",
    status: "Lopend",
  });

  useEffect(() => {
    const opgeslagen = localStorage.getItem(STORAGE_KEY);
    if (opgeslagen) {
      setData(JSON.parse(opgeslagen));
    }
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (geladen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, geladen]);

  function maakProjectAan() {
    if (!nieuwProject.naam || !nieuwProject.klant || !nieuwProject.startdatum) {
      alert("Vul projectnaam, klantnaam en startdatum in.");
      return;
    }

    const project = {
      id: Date.now(),
      naam: nieuwProject.naam,
      klant: nieuwProject.klant,
      startdatum: nieuwProject.startdatum,
      status: nieuwProject.status,
      materialen: [],
      arbeid: [],
    };

    setData((prev) => ({
      ...prev,
      activeProjectId: project.id,
      projecten: [...prev.projecten, project],
    }));

    setNieuwProject({
      naam: "",
      klant: "",
      startdatum: "",
      status: "Lopend",
    });
  }

  function verwijderProject(id) {
    const ok = confirm("Weet je zeker dat je dit project wilt verwijderen?");
    if (!ok) return;

    setData((prev) => {
      const nieuweProjecten = prev.projecten.filter((p) => p.id !== id);
      return {
        ...prev,
        activeProjectId: nieuweProjecten[0]?.id || null,
        projecten: nieuweProjecten,
      };
    });
  }

  function setActief(id) {
    setData((prev) => ({
      ...prev,
      activeProjectId: id,
    }));
  }

  function updateProject(id, field, value) {
    setData((prev) => ({
      ...prev,
      projecten: prev.projecten.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  }

  const actiefProject =
    data.projecten.find((p) => p.id === data.activeProjectId) || null;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.navBar}>
          <a href="/" style={styles.navLink}>Overzicht</a>
          <a href="/projecten" style={styles.navLinkActive}>Projecten</a>
          <a href="/calculatie" style={styles.navLink}>Calculatie</a>
          <a href="/facturen" style={styles.navLink}>Facturen</a>
        </nav>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Projecten</h1>
            <p style={styles.subtitle}>Projecten aanmaken en beheren</p>
          </div>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Nieuw project</h2>

            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Projectnaam</label>
                <input
                  style={styles.input}
                  value={nieuwProject.naam}
                  onChange={(e) =>
                    setNieuwProject({ ...nieuwProject, naam: e.target.value })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Klantnaam</label>
                <input
                  style={styles.input}
                  value={nieuwProject.klant}
                  onChange={(e) =>
                    setNieuwProject({ ...nieuwProject, klant: e.target.value })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Startdatum</label>
                <input
                  type="date"
                  style={styles.input}
                  value={nieuwProject.startdatum}
                  onChange={(e) =>
                    setNieuwProject({
                      ...nieuwProject,
                      startdatum: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  value={nieuwProject.status}
                  onChange={(e) =>
                    setNieuwProject({ ...nieuwProject, status: e.target.value })
                  }
                >
                  <option>Lopend</option>
                  <option>Verstuurd</option>
                  <option>Betaald</option>
                </select>
              </div>
            </div>

            <button style={styles.primaryButton} onClick={maakProjectAan}>
              + Project aanmaken
            </button>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Projectlijst</h2>

            {data.projecten.length === 0 ? (
              <div style={styles.empty}>Nog geen projecten aangemaakt.</div>
            ) : (
              <div style={styles.projectList}>
                {data.projecten.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      ...styles.projectItem,
                      ...(project.id === data.activeProjectId
                        ? styles.projectItemActive
                        : {}),
                    }}
                  >
                    <div
                      style={styles.projectItemContent}
                      onClick={() => setActief(project.id)}
                    >
                      <strong>{project.naam}</strong>
                      <div style={styles.meta}>{project.klant}</div>
                      <div style={styles.meta}>{project.startdatum}</div>
                      <div style={styles.badge}>{project.status}</div>
                    </div>

                    <button
                      style={styles.deleteButton}
                      onClick={() => verwijderProject(project.id)}
                    >
                      Verwijder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {actiefProject && (
          <section style={{ ...styles.card, marginTop: 20 }}>
            <h2 style={styles.sectionTitle}>Actief project</h2>

            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Projectnaam</label>
                <input
                  style={styles.input}
                  value={actiefProject.naam}
                  onChange={(e) =>
                    updateProject(actiefProject.id, "naam", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Klantnaam</label>
                <input
                  style={styles.input}
                  value={actiefProject.klant}
                  onChange={(e) =>
                    updateProject(actiefProject.id, "klant", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Startdatum</label>
                <input
                  type="date"
                  style={styles.input}
                  value={actiefProject.startdatum}
                  onChange={(e) =>
                    updateProject(actiefProject.id, "startdatum", e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.input}
                  value={actiefProject.status}
                  onChange={(e) =>
                    updateProject(actiefProject.id, "status", e.target.value)
                  }
                >
                  <option>Lopend</option>
                  <option>Verstuurd</option>
                  <option>Betaald</option>
                </select>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
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
  header: { marginBottom: "24px" },
  title: { margin: 0, fontSize: "32px", fontWeight: 700 },
  subtitle: { margin: "8px 0 0 0", color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  sectionTitle: { marginTop: 0, marginBottom: "16px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: 600,
  },
  empty: {
    padding: "24px",
    background: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },
  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  projectItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
    background: "#f9fafb",
  },
  projectItemActive: {
    border: "1px solid #111827",
  },
  projectItemContent: {
    cursor: "pointer",
    marginBottom: "10px",
  },
  meta: {
    color: "#6b7280",
    fontSize: "13px",
    marginTop: "4px",
  },
  badge: {
    display: "inline-block",
    marginTop: "8px",
    background: "#e5e7eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },
  deleteButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "10px",
    padding: "10px 12px",
    fontWeight: 600,
  },
};
