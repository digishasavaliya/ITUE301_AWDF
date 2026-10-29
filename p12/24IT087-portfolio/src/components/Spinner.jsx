function Spinner() {
  return (
    <div className="api-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Loading tasks...</p>
    </div>
  );
}

export default Spinner;
