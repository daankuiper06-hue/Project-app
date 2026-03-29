"use client";

import { useEffect, useMemo, useState } from "react";

function euro(bedrag) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(bedrag || 0));
}

function getProjecten() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("project-app-data-v2");
  return raw ? JSON.parse(raw) : [];
}

function saveProjecten(projecten) {
  localStorage.setItem("project-app-data-v2", JSON.stringify(projecten));
}

function berekenProject(project) {
  const materialen = project.materialen || [];
  const arbeid = project.arbeid || [];

  const materiaalOmzet = materialen.reduce((sum, item) => {
    return sum + Number(item.aantal || 0) * Number(item.verkoopPrijs || 0);
  }, 0);

  const arbeidOmzet = arbeid.reduce((sum, item) => {
    return sum + Number(item.uren || 0) * Number(item.tarief || 0);
  }, 0);

  const winstMaterialen = materialen.reduce((sum, item) => {
    const aantal = Number(item.aantal || 0);
    const inkoop = Number(item.inkoopPrijs || 0);
    const verkoop = Number(item.verkoopPrijs || 0);
    return sum + aantal * (verkoop - inkoop);
  }, 0);

  return {
    omzet: materiaalOmzet + arbeidOmzet,
    winst: winstMaterialen + arbeidOmzet,
  };
}

export default function Home() {
  const [projecten, setProjecten] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [naam, setNaam] = useState("");
  const [klant, setKlant] = useState("");
  const [datum, setDatum] = useState("");
  const [status, setStatus] = useState("Lopend");

  useEffect(() => {
    setProjecten(getProjecten());
  }, []);

  const totals = useMemo(() => {
    let omzet = 0;
    let winst = 0;
    let betaald = 0;
    let openstaand = 0;

    projecten.forEach((p) => {
      const calc = berekenProject(p);
      omzet += calc.omzet;
      winst += calc.winst;
      if (p.status === "Betaald") betaald += 1;
      else openstaand += 1;
    });

    return { omzet, winst, betaald, openstaand };
  }, [projecten]);

  function maakProject() {
    if (!naam.trim() || !klant.trim() || !datum) {
      alert("Vul projectnaam, klantnaam en datum in.");
      return;
    }

    const nieuw = {
      id: Date.now().toString(),
      naam,
      klant,
      datum,
      status,
      materialen: [],
      arbeid: [],
    };

    const updated = [...projecten, nieuw];
    setProjecten(updated);
    saveProjecten(updated);

    setNaam("");
    setKlant("");
    setDatum("");
    setStatus("Lopend");
    setShowModal(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Overzicht</h1>
            <p style={styles.subtitle}>Projecten, omzet, winst en status</p>
          </div>

          <button style={styles.primaryButton} onClick={() => setShowModal(true)}>
            + Nieuw project
          </button>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.card}>
            <p style={styles.label}>Totale omzet</p>
            <h2 style={styles.value}>{euro(totals.omzet)}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.label}>Totale winst</p>
            <h2 style={styles.value}>{euro(totals.winst)}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.label}>Openstaand</p>
            <h2 style={styles.value}>{totals.openstaand}</h2>
          </div>
          <div style={styles.card}>
            <p style={styles.label}>Betaald</p>
            <h2 style={styles.value}>{totals.betaald}</h2>
          </div>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Projecten</h3>
          </div>

          {projecten.length === 0 ? (
            <div style={styles.empty}>Nog geen projecten. Maak je eerste project aan.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Project</th>
                    <th style={styles.th}>Klant</th>
                    <th style={styles.th}>Datum</th>
                    <th style={styles.th}>Omzet</th>
                    <th style={styles.th}>Winst</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {projecten.map((p) => {
                    const calc = berekenProject(p);

                    return (
                      <tr key={p.id}>
                        <td style={styles.tdStrong}>{p.naam}</td>
                        <td style={styles.td}>{p.klant}</td>
                        <td style={styles.td}>{p.datum}</td>
                        <td style={styles.td}>{euro(calc.omzet)}</td>
                        <td style={styles.td}>{euro(calc.winst)}</td>
                        <td style={styles.td}>{p.status}</td>
                        <td style={styles.td}>
                          <a href={`/project?id=${p.id}`} style={styles.linkButton}>
                            Openen
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Nieuw project</h3>

            <input
              style={styles.input}
              placeholder="Projectnaam"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Klantnaam"
              value={klant}
              onChange={(e) => setKlant(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
            />
            <select
              style={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Lopend</option>
              <option>Verstuurd</option>
              <option>Betaald</option>
            </select>

            <div style={styles.modalButtons}>
              <button style={styles.primaryButton} onClick={maakProject}>
                Opslaan
              </button>
              <button style={styles.secondaryButton} onClick={() => setShowModal(false)}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: "24px 16px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  label: { margin: 0, color: "#6b7280", fontSize: 14 },
  value: { margin: "8px 0 0 0", fontSize: 26 },
  tableCard: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  tableHeader: { padding: 18, borderBottom: "1px solid #e5e7eb" },
  tableTitle: { margin: 0 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: 12,
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
  },
  td: { padding: 12, borderBottom: "1px solid #f1f5f9", fontSize: 14 },
  tdStrong: {
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    fontWeight: 600,
  },
  empty: { padding: 40, textAlign: "center", color: "#6b7280" },
  linkButton: {
    textDecoration: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 12px",
    fontWeight: 600,
    fontSize: 13,
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 600,
  },
  secondaryButton: {
    background: "#fff",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 600,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 460,
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  modalTitle: { margin: 0, marginBottom: 8 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #d1d5db",
  },
  modalButtons: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 },
};
