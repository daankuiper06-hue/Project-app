export default function NavBar({ active = "/" }) {
  return (
    <nav className="navbar">
      <a href="/" className={`navlink ${active === "/" ? "active" : ""}`}>
        Overzicht
      </a>
      <a href="/project" className={`navlink ${active === "/project" ? "active" : ""}`}>
        Projecten
      </a>
      <a
        href="/calculatie"
        className={`navlink ${active === "/calculatie" ? "active" : ""}`}
      >
        Calculatie
      </a>
      <a href="/factuur" className={`navlink ${active === "/factuur" ? "active" : ""}`}>
        Factuur
      </a>
    </nav>
  );
}
