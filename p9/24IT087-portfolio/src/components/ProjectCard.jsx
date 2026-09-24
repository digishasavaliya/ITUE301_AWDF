function ProjectCard({ title, description, tech, githubUrl, demoUrl, accent }) {
  return (
    <article className={`project-card project-card--${accent}`}>
      <div className="project-visual" aria-hidden="true">
        <div className="project-visual__bar" />
        <div className="project-visual__bar project-visual__bar--short" />
        <div className="project-visual__bar" />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <div className="tech-list">
        {tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="card-actions">
        <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
          GitHub
        </a>
        <a href={demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
          Live Demo
        </a>
      </div>
    </article>
  );
}

export default ProjectCard;
