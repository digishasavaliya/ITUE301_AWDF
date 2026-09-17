import { useEffect, useState } from 'react';

function PageLoader({ label = 'Loading page...' }) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!showLoader) {
    return null;
  }

  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="page-loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default PageLoader;
