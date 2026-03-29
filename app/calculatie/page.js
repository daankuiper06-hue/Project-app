"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function Calculatie() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [marge, setMarge] = useState(20);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects);
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/materials?projectId=${selected}`)
      .then(r => r.json())
      .then(setMaterials);
  }, [selected]);

  async function addMaterial() {
    await fetch("/api/materials", {
      method: "POST",
      body: JSON.stringify({
        project_id: selected,
        naam: "materiaal",
        aantal: 1,
        inkoopprijs: 0,
      }),
    });

    const res = await fetch(`/api/materials?projectId=${selected}`);
    setMaterials(await res.json());
  }

  return (
    <main style={{ padding: 20 }}>
      <NavBar />

      <h1>Calculatie</h1>

      <select onChange={(e)=>setSelected(e.target.value)}>
        <option>kies project</option>
        {projects.map(p=>(
          <option key={p.id} value={p.id}>{p.naam}</option>
        ))}
      </select>

      <input value={marge} onChange={(e)=>setMarge(e.target.value)} />

      <button onClick={addMaterial}>+ materiaal</button>

      {materials.map(m=>{
        const verkoop = m.inkoopprijs * (1 + marge/100);
        return <div key={m.id}>{m.naam} - €{verkoop}</div>;
      })}
    </main>
  );
}
