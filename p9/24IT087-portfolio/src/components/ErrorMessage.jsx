function ErrorMessage({ error, onRetry }) {
  return (
    <div className="api-state api-state--error" role="alert">
      <p>{error}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;
