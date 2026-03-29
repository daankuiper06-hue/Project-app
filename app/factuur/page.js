"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function Factuur() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects);
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/materials?projectId=${selected}`)
      .then(r => r.json())
      .then(setMaterials);
  }, [selected]);

  const sub = materials.reduce((s,m)=>s+m.inkoopprijs*m.aantal,0);
  const btw = sub * 0.21;

  return (
    <main style={{ padding: 20 }}>
      <NavBar />

      <button onClick={()=>window.print()}>Print</button>

      <select onChange={(e)=>setSelected(e.target.value)}>
        <option>kies project</option>
        {projects.map(p=>(
          <option key={p.id} value={p.id}>{p.naam}</option>
        ))}
      </select>

      {materials.map(m=>(
        <div key={m.id}>
          {m.naam} - {m.aantal} x €{m.inkoopprijs}
        </div>
      ))}

      <hr />

      <p>Subtotaal: €{sub}</p>
      <p>BTW: €{btw}</p>
      <h2>Totaal: €{sub+btw}</h2>
    </main>
  );
}
