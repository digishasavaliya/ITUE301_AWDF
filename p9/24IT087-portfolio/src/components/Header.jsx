function Header({ name, themeColor, role }) {
  return (
    <header
      className="hero-card"
      style={{
        background: `linear-gradient(135deg, ${themeColor}, #111827)`,
      }}
    >
      <div className="hero-content">
        <p className="eyebrow">Portfolio</p>
        <h1>{name}</h1>
        <p className="hero-role">{role}</p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>
          <a href="#about" className="btn btn-secondary">
            About Me
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;