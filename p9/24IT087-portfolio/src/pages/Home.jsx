import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';

function Home() {
  const skills = ['Python', 'C++', 'JavaScript', 'React', 'Node.js', 'Machine Learning'];

  return (
    <div className="page-stack">
      <Hero
        name="Digisha Savaliya"
        role="AI/ML and Backend Developer"
        intro="I build practical solutions with a strong focus on modern web experiences, smart automation, and clean backend systems."
        skills={skills}
      />
      <About />
      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
