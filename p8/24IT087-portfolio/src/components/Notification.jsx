function Notification({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <div className={`notification notification--${notification.type}`} role="status" aria-live="polite">
      {notification.message}
    </div>
  );
}

export default Notification;