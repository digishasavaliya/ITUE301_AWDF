import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-card">
        <div className="not-found-illustration" aria-hidden="true">
          <span className="orb" />
          <span className="panel" />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for may have moved, been removed, or never existed.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
