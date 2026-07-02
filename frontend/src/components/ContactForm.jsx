import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const API_URL = 'http://54.226.255.19:5000/api';

// SVG icons used by the social link buttons.
const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// Textarea that automatically grows with its content.
const AutoTextarea = ({ value, onChange, id, name, rows, ...rest }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      style={{ resize: 'none', overflow: 'hidden' }}
      {...rest}
    />
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [social, setSocial] = useState({ github: '', linkedin: '', instagram: '' });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const { ref, isRevealed } = useScrollReveal();

  useEffect(() => {
    fetch(`${API_URL}/social`)
      .then(res => res.json())
      .then(data => setSocial(data))
      .catch(err => console.error('Could not load social links:', err));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); triggerShake(); return; }
    setStatus('Sending...');
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.'); triggerShake();
      }
    } catch (err) {
      console.error(err); setStatus('Error connecting to server.'); triggerShake();
    }
  };

  const socialLinks = [
    { key: 'github',    href: social.github,    label: 'Visit my GitHub profile',    Icon: GitHubIcon },
    { key: 'linkedin',  href: social.linkedin,  label: 'Visit my LinkedIn profile',  Icon: LinkedInIcon },
    { key: 'instagram', href: social.instagram, label: 'Visit my Instagram profile', Icon: InstagramIcon },
  ].filter(s => s.href);

  return (
    <div
      ref={ref}
      className={`contact-layout reveal ${isRevealed ? 'active' : ''}`}
    >
      {/* Left column: intro and social links. */}
      <div className="contact-info">
        <h3>Let's build something together</h3>
        <p>Have a project in mind, or just want to connect? Fill out the form and I'll get back to you.</p>

        {socialLinks.length > 0 && (
          <div className="social-links-group">
            <span className="social-label">Find me on</span>
            <div className="social-icons-row">
              {socialLinks.map(({ key, href, label, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-icon-link"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column: contact form. */}
      <div className={`contact-form-wrapper ${shake ? 'shake' : ''}`}>
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label htmlFor="contact-name">Name</label>
            <input
              type="text" id="contact-name" name="name"
              placeholder="Your name"
              value={formData.name} onChange={handleChange}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && <span id="name-error" className="error-text" role="alert">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="contact-email">Email</label>
            <input
              type="email" id="contact-email" name="email"
              placeholder="Your email address"
              value={formData.email} onChange={handleChange}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span id="email-error" className="error-text" role="alert">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.message ? 'error' : ''}`}>
            <label htmlFor="contact-message">Message</label>
            <AutoTextarea
              id="contact-message" name="message" rows={6}
              placeholder="Write your message here..."
              value={formData.message} onChange={handleChange}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={!!errors.message}
            />
            {errors.message && <span id="message-error" className="error-text" role="alert">{errors.message}</span>}
          </div>

          <button type="submit" className="btn-primary w-full">Send Message</button>
          {status && <p className="status-message" role="status">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
