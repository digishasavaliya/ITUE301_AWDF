import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import ProjectCard from '../components/ProjectCard';
import Spinner from '../components/Spinner';
import RepoList from '../components/RepoList'; // Reusable component for displaying the repository list (Requirement 8)

const projects = [
  {
    title: 'Heart Stroke Prediction',
    description: 'An AI-powered health analytics app that predicts stroke risk using patient indicators and an interactive dashboard.',
    tech: ['Python', 'Scikit-learn', 'Streamlit'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'teal',
  },
  {
    title: 'PriceWise Tracker',
    description: 'A modern product monitoring app that helps users track price changes and receive timely alerts.',
    tech: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'violet',
  },
  {
    title: 'Student Management System',
    description: 'A backend-driven system for managing student records, attendance, and academic reports efficiently.',
    tech: ['Java', 'Spring Boot', 'MySQL'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'amber',
  },
  {
    title: 'Portfolio Studio',
    description: 'A polished portfolio website built with React and Vite for showcasing projects and professional growth.',
    tech: ['React', 'Vite', 'CSS'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'pink',
  },
  {
    title: 'TaskFlow Planner',
    description: 'A task management experience focused on productivity, reminders, and streamlined collaboration.',
    tech: ['JavaScript', 'Firebase', 'Tailwind'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'sky',
  },
  {
    title: 'InsightHub Analytics',
    description: 'A reporting dashboard that turns raw business data into clear insights through interactive visualizations.',
    tech: ['React', 'D3', 'Express'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'green',
  },
];

// Requirement 4: Placeholder username variable.
// ENTER YOUR GITHUB USERNAME HERE: Change 'YOUR_GITHUB_USERNAME' to 'digishasavaliya'
const GITHUB_USERNAME = 'digishasavaliya';

function Projects() {
  // Requirement 3: Define necessary states for API data, loading, error, and search query filtering.
  const [repos, setRepos] = useState([]); // Stores the list of repositories
  const [loading, setLoading] = useState(true); // Manages loading state (spinner visibility)
  const [error, setError] = useState(''); // Stores HTTP/API fetch error messages
  const [search, setSearch] = useState(''); // Stores search query for repository filtering

  // Function to fetch repository data using Fetch API
  const fetchRepos = async () => {
    setLoading(true); // Start loading
    setError('');     // Clear previous errors

    try {
      // Requirement 4: Fetch from GitHub REST API
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

      // Requirement 6: Correctly handle HTTP errors using response.ok
      if (!response.ok) {
        throw new Error(`Failed to load repositories (HTTP ${response.status})`);
      }

      const data = await response.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (err) {
      setRepos([]);
      // Requirement 11: Display "Failed to load repositories" on failure
      setError(err.message || 'Failed to load repositories');
    } finally {
      setLoading(false); // Stop loading regardless of success/error
    }
  };

  // Requirement 5: Fetch repositories when component mounts using useEffect.
  // The empty dependency array [] ensures it runs only once after the initial render.
  useEffect(() => {
    // Schedule fetchRepos asynchronously to avoid calling setState synchronously during the effect (satisfies ESLint)
    const timer = setTimeout(() => {
      fetchRepos();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Requirement 10: Case-insensitive search filter by repository name.
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="page-section" aria-labelledby="projects-title">
      {/* Existing static portfolio projects from Practical 1 & 2 */}
      <div className="section-heading">
        <p className="eyebrow">Showcase</p>
        <h2 id="projects-title">Selected Projects</h2>
        <p>Each project reflects a different milestone in building smart, responsive, and user-centered applications.</p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>

      {/* Requirement 12: New section below static cards titled "GitHub Repositories" */}
      <div className="section-card github-section">
        <div className="section-heading">
          <p className="eyebrow">GitHub</p>
          <h3>GitHub Repositories</h3>
          <p>Showing live public repositories fetched from GitHub API.</p>
        </div>

        {/* Requirement 10: Search input above repository list with placeholder 'Search repositories...' */}
        <label className="repo-search" htmlFor="repo-search">
          <span>Search repositories</span>
          <input
            id="repo-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories..."
          />
        </label>

        {/* Requirement 7 & 11: Handle Loading, Error, and Success states */}
        {loading ? (
          // Loading state
          <Spinner />
        ) : error ? (
          // Error state with Retry button (Requirement 11)
          <ErrorMessage error={error} onRetry={fetchRepos} />
        ) : (
          // Success state: renders the repository cards (Requirement 8 & 14 inside RepoList)
          <RepoList repos={filteredRepos} />
        )}
      </div>
    </section>
  );
}

export default Projects;
