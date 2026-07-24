// RepoList Component for Practical 3

// A dictionary to supply custom descriptions for repositories repo-wise (Requirement: custom descriptions)
const REPO_DESCRIPTIONS = {
  '24IT087-portfolio': 'A modern, responsive student portfolio website built using React, Vite, and CSS, featuring dynamic API integrations.',
  'basic_python': 'A collection of fundamental Python programming exercises, scripts, and basic programming concepts.',
};

/**
 * RepoList Component
 * Renders a list of GitHub repositories or a fallback message if no repositories are found.
 * 
 * Props:
 * - repos: Array of repository objects fetched from GitHub API
 */
function RepoList({ repos }) {
  // Requirement 14: Handle the situation where the search returns no repositories.
  if (repos.length === 0) {
    return (
      <div className="api-state" role="status" aria-live="polite">
        <p>No repositories found.</p>
      </div>
    );
  }

  return (
    <div className="repo-list">
      {repos.map((repo) => {
        // Look up the repo-wise custom description or fall back to a default description
        const repoDescription = repo.description || REPO_DESCRIPTIONS[repo.name] || 'A public code repository containing academic practical works.';

        return (
          // Requirement 13: Display each repository as a card
          <article key={repo.id} className="repo-card">
            <div className="repo-card__header">
              {/* Requirement 9: Repository name */}
              <h4>{repo.name}</h4>
              {/* Requirement 9: Star count using stargazers_count */}
              <span className="repo-stars">⭐ {repo.stargazers_count}</span>
            </div>
            <p>{repoDescription}</p>
            {/* Requirement 9: Repository URL / View Repository button */}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary repo-link"
            >
              View Repository
            </a>
          </article>
        );
      })}
    </div>
  );
}

export default RepoList;
