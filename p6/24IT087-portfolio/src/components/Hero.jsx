import { Link } from 'react-router-dom';

function Hero({ name, role, intro, skills }) {
  return (
    <section className="hero-card">
      <div className="hero-layout">
        <div className="hero-content">
          <p className="eyebrow">Portfolio</p>
          <h1>{name}</h1>
          <p className="hero-role">{role}</p>
          <p className="hero-intro">{intro}</p>

          <div className="skill-grid hero-skill-grid">
            {skills.map((skill) => (
              <span key={skill} className="skill-pill">
                {skill}
              </span>
            ))}
          </div>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              View Projects
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Me
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="profile-avatar">DS</div>
          <div className="hero-stats">
            <div>
              <strong>6+</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong>3+</strong>
              <span>Years</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
