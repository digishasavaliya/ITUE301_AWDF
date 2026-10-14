import { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Thanks ${name || 'there'}! Your message has been captured successfully.`);
  };

  return (
    <section className="page-section" aria-labelledby="contact-title">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Let&apos;s connect</h2>
        <p>Share your idea, ask a question, or explore collaboration opportunities.</p>
      </div>

      <div className="contact-grid">
        <form className="section-card contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>

          <label>
            Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength="180" rows="6" placeholder="Write your message here..." />
          </label>

          <div className="form-meta">
            <span>{message.length}/180 characters</span>
            <button type="button" className="btn btn-secondary" onClick={() => setShowHelp((value) => !value)}>
              {showHelp ? 'Hide Help' : 'Show Help'}
            </button>
          </div>

          {showHelp && (
            <div className="help-box">
              <p>Tip: Keep your message concise and mention the purpose of your project or feedback.</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>

        <aside className="section-card contact-preview">
          <p className="eyebrow">Live Preview</p>
          <h3>{name || 'Your Name'}</h3>
          <p>{email || 'your@email.com'}</p>
          <div className="preview-message">
            <p>{message || 'Your message will appear here in real time.'}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Contact;
