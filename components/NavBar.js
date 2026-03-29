export default function NavBar() {
  return (
    <nav style={nav}>
      <a href="/">Overzicht</a>
      <a href="/project">Projecten</a>
      <a href="/calculatie">Calculatie</a>
      <a href="/factuur">Factuur</a>
    </nav>
  );
}

const nav = {
  display: "flex",
  gap: "16px",
  background: "#fff",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "20px",
};
