"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";

function euro(value) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

function calcProject(project) {
  const margeFactor = 1 + Number(project.marge_percentage || 0) / 100;

  const materialenOmzet = (project.materialen || []).reduce((sum, item) => {
    const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
    return sum + verkoopPerStuk * Number(item.aantal || 0);
  }, 0);

  const materialenWinst = (project.materialen || []).reduce((sum, item) => {
    const verkoopPerStuk = Number(item.inkoopprijs || 0) * margeFactor;
    return (
      sum +
      (verkoopPerStuk - Number(item.inkoopprijs || 0)) * Number(item.aantal || 0)
    );
  }, 0);

  const arbeidOmzet = (project.arbeid || []).reduce((sum, item) => {
    return sum + Number(item.uren || 0) * Number(item.tarief || 0);
  }, 0);

  return {
    omzet: materialenOmzet + arbeidOmzet,
    winst: materialenWinst + arbeidOmzet,
  };
}

export default function HomePage() {
  const [projects, setProjects] = useState([]);

  async function loadProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const stats = useMemo(() => {
    let omzet = 0;
    let winst = 0;
    let lopend = 0;
    let verstuurd = 0;
    let betaald = 0;

    projects.forEach((project) => {
      const calc = calcProject(project);
      omzet += calc.omzet;
      winst += calc.winst;

      if (project.status === "Lopend") lopend += 1;
      if (project.status === "Verstuurd") verstuurd += 1;
      if (project.status === "Betaald") betaald += 1;
    });

    return {
      omzet,
      winst,
      aantal: projects.length,
      lopend,
      verstuurd,
      betaald,
    };
  }, [projects]);

  return (
    <main className="page">
      <div className="container">
        <NavBar active="/" />

        <header className="hero">
          <h1 className="title">Overzicht</h1>
          <p className="subtitle">
            Projecten, omzet, winst en status in één dashboard
          </p>
        </header>

        <section className="grid-4" style={{ marginBottom: 24 }}>
          <div className="summary-card">
            <p className="summary-label">Totale omzet</p>
            <h3 className="summary-value">{euro(stats.omzet)}</h3>
          </div>

          <div className="summary-card">
            <p className="summary-label">Totale winst</p>
            <h3 className="summary-value">{euro(stats.winst)}</h3>
          </div>

          <div className="summary-card">
            <p className="summary-label">Projecten</p>
            <h3 className="summary-value">{stats.aantal}</h3>
          </div>

          <div className="summary-card">
            <p className="summary-label">Status</p>
            <h3 className="summary-value">
              {stats.lopend} / {stats.verstuurd} / {stats.betaald}
            </h3>
            <p className="subtitle" style={{ marginTop: 8 }}>
              Lopend / Verstuurd / Betaald
            </p>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <h2 className="card-title" style={{ marginBottom: 0 }}>
              Projecten
            </h2>
            <a href="/project" className="button" style={{ textDecoration: "none" }}>
              + Nieuw project
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="empty">Nog geen projecten aangemaakt.</div>
          ) : (
            <div className="grid-2">
              {projects.map((project) => {
                const calc = calcProject(project);

                return (
                  <div key={project.id} className="card" style={{ padding: 16 }}>
                    <div className="section-header" style={{ marginBottom: 8 }}>
                      <strong>{project.naam}</strong>
                      <span
                        className={`badge ${
                          project.status?.toLowerCase() || "lopend"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="subtitle" style={{ margin: "4px 0" }}>
                      {project.klant}
                    </p>
                    <p className="subtitle" style={{ margin: "4px 0" }}>
                      {project.datum}
                    </p>
                    <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
                      <span>Omzet: {euro(calc.omzet)}</span>
                      <span>Winst: {euro(calc.winst)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
