"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [naam, setNaam] = useState("");
  const [klant, setKlant] = useState("");

  async function load() {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ naam, klant }),
    });

    setNaam("");
    setKlant("");
    load();
  }

  return (
    <main style={{ padding: 20 }}>
      <NavBar />

      <h1>Projecten</h1>

      <input placeholder="Naam" value={naam} onChange={(e)=>setNaam(e.target.value)} />
      <input placeholder="Klant" value={klant} onChange={(e)=>setKlant(e.target.value)} />

      <button onClick={add}>+ toevoegen</button>

      {projects.map(p => (
        <div key={p.id}>{p.naam}</div>
      ))}
    </main>
  );
}
