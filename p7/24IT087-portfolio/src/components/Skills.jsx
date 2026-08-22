function Skills({ skillList }) {
  return (
    <section id="skills" className="section-card">
      <h2>Skills</h2>

      <div className="skill-grid">
        {skillList.map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Skills;