"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects);
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <NavBar />

      <h1>D Kuiper Techniek</h1>

      <div style={{ display: "grid", gap: 10 }}>
        {projects.map(p => (
          <div key={p.id} style={card}>
            {p.naam} - {p.klant}
          </div>
        ))}
      </div>
    </main>
  );
}

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
};
