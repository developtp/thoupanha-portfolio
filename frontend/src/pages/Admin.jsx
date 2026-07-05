import React, { useState, useEffect } from 'react';
import { TECH_PRESETS, getTechIcon } from '../utils/techIcons';
import { API_URL } from '../config/api';

const Admin = () => {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loginError, setLoginError] = useState('');

  const [projects, setProjects] = useState([]);
  const [messages, setMessages]  = useState([]);

  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    category: 'Full Stack Project',
    techStack: [],
    imageUrl: '',
    link: '',
    repoLink: ''
  });
  const [editingProjId, setEditingProjId] = useState(null);

  const [facts, setFacts]               = useState([]);
  const [factForm, setFactForm]         = useState({ icon: '', headline: '', description: '' });
  const [editingFactId, setEditingFactId] = useState(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) document.getElementById('pin-input-0')?.focus();
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchMessages();
      fetchFacts();
    }
  }, [token]);

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const handleResponseError = (res) => {
    if (res.status === 401) {
      sessionStorage.removeItem('adminToken');
      setToken('');
      setLoginError('Session expired. Please log in again.');
      return true;
    }
    return false;
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages`, { headers: getAuthHeaders() });
      if (handleResponseError(res)) return;
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchFacts = async () => {
    try {
      const res = await fetch(`${API_URL}/facts`);
      if (res.ok) setFacts(await res.json());
    } catch (err) { console.error(err); }
  };

  // ── Login ─────────────────────────────────────────────────────────────────

  const handlePinChange = (val, idx) => {
    if (val && !/^[0-9]$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    if (val && idx < 5) document.getElementById(`pin-input-${idx + 1}`)?.focus();
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newPin = [...pin];
      if (pin[idx]) {
        newPin[idx] = '';
        setPin(newPin);
      } else if (idx > 0) {
        newPin[idx - 1] = '';
        setPin(newPin);
        document.getElementById(`pin-input-${idx - 1}`)?.focus();
      }
      e.preventDefault();
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length < 6) return;
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setLoginError('');
      } else {
        setLoginError(data.message || 'Invalid PIN');
        setPin(['', '', '', '', '', '']);
        document.getElementById('pin-input-0')?.focus();
      }
    } catch (err) {
      setLoginError('Error connecting to server.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setPin(['', '', '', '', '', '']);
    setLoginError('');
  };

  // ── Project CRUD ──────────────────────────────────────────────────────────

  const handleProjChange = (e) => setProjForm({ ...projForm, [e.target.name]: e.target.value });

  const handleTechToggle = (techId) => {
    const isSelected = projForm.techStack.includes(techId);
    const newTechStack = isSelected
      ? projForm.techStack.filter(id => id !== techId)
      : [...projForm.techStack, techId];
    setProjForm(prev => ({ ...prev, techStack: newTechStack }));
  };

  const isFormValid = () => {
    if (!projForm.title.trim() || !projForm.description.trim()) return false;
    const urlPattern = /^https?:\/\/.+/;
    if (projForm.imageUrl && !urlPattern.test(projForm.imageUrl)) return false;
    if (projForm.link && !urlPattern.test(projForm.link)) return false;
    if (projForm.repoLink && !urlPattern.test(projForm.repoLink)) return false;
    return true;
  };

  const handleProjSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    const method = editingProjId ? 'PUT' : 'POST';
    const url    = editingProjId ? `${API_URL}/projects/${editingProjId}` : `${API_URL}/projects`;
    try {
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(projForm) });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setProjForm({ title: '', description: '', category: 'Full Stack Project', techStack: [], imageUrl: '', link: '', repoLink: '' });
        setEditingProjId(null);
        fetchProjects();
      }
    } catch (err) { console.error(err); }
  };

  const handleProjEdit = (p) => {
    let finalStack = Array.isArray(p.techStack)
      ? p.techStack
      : (p.techStack || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    setProjForm({
      title: p.title || '',
      description: p.description || '',
      category: p.category || 'Full Stack Project',
      techStack: finalStack,
      imageUrl: p.imageUrl || '',
      link: p.link || '',
      repoLink: p.repoLink || ''
    });
    setEditingProjId(p._id);
  };

  const handleProjDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (handleResponseError(res)) return;
      if (res.ok) fetchProjects();
    } catch (err) { console.error(err); }
  };

  // ── Fact CRUD ─────────────────────────────────────────────────────────────

  const handleFactChange = (e) => setFactForm({ ...factForm, [e.target.name]: e.target.value });

  const handleFactSubmit = async (e) => {
    e.preventDefault();
    if (!factForm.headline.trim() || !factForm.description.trim()) return;
    const method = editingFactId ? 'PUT' : 'POST';
    const url    = editingFactId ? `${API_URL}/facts/${editingFactId}` : `${API_URL}/facts`;
    try {
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(factForm) });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setFactForm({ icon: '', headline: '', description: '' });
        setEditingFactId(null);
        fetchFacts();
      }
    } catch (err) { console.error(err); }
  };

  const handleFactEdit = (fact) => {
    setEditingFactId(fact._id);
    setFactForm({ icon: fact.icon || '', headline: fact.headline, description: fact.description });
  };

  const handleFactDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fact card?')) return;
    try {
      const res = await fetch(`${API_URL}/facts/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (handleResponseError(res)) return;
      if (res.ok) fetchFacts();
    } catch (err) { console.error(err); }
  };

  const handleFactReorder = async (currentIndex, direction) => {
    const newFacts = [...facts];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= newFacts.length) return;
    [newFacts[currentIndex], newFacts[targetIndex]] = [newFacts[targetIndex], newFacts[currentIndex]];
    setFacts(newFacts);
    try {
      const res = await fetch(`${API_URL}/facts/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: newFacts.map(f => f._id) })
      });
      if (handleResponseError(res)) return;
      if (!res.ok) fetchFacts();
    } catch (err) { console.error(err); fetchFacts(); }
  };

  // ── Theme SVG helpers ─────────────────────────────────────────────────────

  const ThemeToggleContent = () => (
    <span className={`theme-toggle-wrapper ${theme}`}>
      <svg className="theme-icon sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg className="theme-icon moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </span>
  );

  // ── Login Screen ──────────────────────────────────────────────────────────

  if (!token) {
    return (
      <div className="login-screen-backdrop">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10001 }}
        >
          <ThemeToggleContent />
        </button>

        <div className="login-card glass-modal">
          <h1 id="login-title">Admin Authorization</h1>
          <p className="login-subtitle">Enter your 6-digit security PIN to access the database tools.</p>
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="pin-boxes-container">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  id={`pin-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={e => handlePinChange(e.target.value, idx)}
                  onKeyDown={e => handlePinKeyDown(e, idx)}
                  aria-label={`PIN Digit ${idx + 1}`}
                  className="pin-box"
                  required
                />
              ))}
            </div>
            {loginError && <p className="login-error-text" role="alert">{loginError}</p>}
            <button type="submit" className="btn-primary w-full" style={{ marginTop: '1.5rem' }}>
              Authorize Session
            </button>
          </form>
          <a href="/" className="login-back-link">← Return to Public Portfolio</a>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h1>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            style={{ width: '38px', height: '38px' }}
          >
            <ThemeToggleContent />
          </button>
          <button onClick={handleLogout} className="btn-secondary">Log Out</button>
          <a href="/" className="btn-secondary">← Back to Site</a>
        </div>
      </nav>

      {/* ── Section 1: About Fact Cards ── */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        <div className="admin-left">
          <h2>{editingFactId ? 'Edit Fact Card' : 'Add New Fact Card'}</h2>
          <form onSubmit={handleFactSubmit} className="admin-form">
            <label htmlFor="fact-icon">Icon Emoji (Optional)</label>
            <input
              id="fact-icon"
              type="text"
              name="icon"
              placeholder="e.g. 🎓"
              value={factForm.icon}
              onChange={handleFactChange}
            />

            <label htmlFor="fact-headline">Headline / Front text *</label>
            <input
              id="fact-headline"
              type="text"
              name="headline"
              placeholder="e.g. Computer Science"
              value={factForm.headline}
              onChange={handleFactChange}
              required
            />

            <label htmlFor="fact-description">Description / Back text *</label>
            <textarea
              id="fact-description"
              name="description"
              placeholder="Provide a detailed description displayed on card hover/flip."
              value={factForm.description}
              onChange={handleFactChange}
              required
              rows={4}
            />

            <div className="admin-actions">
              <button type="submit" className="btn-primary">
                {editingFactId ? 'Save Fact' : 'Add Fact'}
              </button>
              {editingFactId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setEditingFactId(null); setFactForm({ icon: '', headline: '', description: '' }); }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-right">
          <h2>About Fact Cards</h2>
          <div className="admin-projects">
            {facts.length === 0 && <p>No fact cards added yet.</p>}
            {facts.map((fact, index) => (
              <div key={fact._id} className="admin-project-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {fact.icon && <span style={{ fontSize: '1.5rem' }}>{fact.icon}</span>}
                  <div>
                    <h3 style={{ margin: 0, textAlign: 'left' }}>{fact.headline}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      {fact.description.length > 60 ? fact.description.slice(0, 60) + '...' : fact.description}
                    </p>
                  </div>
                </div>
                <div className="admin-actions" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleFactReorder(index, 'up')}
                    disabled={index === 0}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '32px' }}
                    aria-label="Move fact card up"
                  >↑</button>
                  <button
                    type="button"
                    onClick={() => handleFactReorder(index, 'down')}
                    disabled={index === facts.length - 1}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '32px' }}
                    aria-label="Move fact card down"
                  >↓</button>
                  <button onClick={() => handleFactEdit(fact)} className="btn-edit">Edit</button>
                  <button onClick={() => handleFactDelete(fact._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Projects Management ── */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        <div className="admin-left">
          <h2>{editingProjId ? 'Edit Project Details' : 'Create New Project'}</h2>

          <form onSubmit={handleProjSubmit} className="admin-form">
            <fieldset className="form-section">
              <legend>Basic Info</legend>

              <label htmlFor="proj-title">Project Title *</label>
              <input
                id="proj-title"
                type="text"
                name="title"
                placeholder="e.g. Task Manager App"
                value={projForm.title}
                onChange={handleProjChange}
                required
              />

              <label htmlFor="proj-desc">Description *</label>
              <textarea
                id="proj-desc"
                name="description"
                placeholder="Provide a brief paragraph describing functionality, challenges solved, etc."
                value={projForm.description}
                onChange={handleProjChange}
                required
              />

              <label htmlFor="proj-category">Category Label</label>
              <input
                id="proj-category"
                type="text"
                name="category"
                placeholder="e.g. Full Stack Project, Web App, Mobile App"
                value={projForm.category}
                onChange={handleProjChange}
              />
            </fieldset>

            <fieldset className="form-section">
              <legend>Project Image</legend>
              <label htmlFor="proj-image-url">Image URL (optional)</label>
              <input
                id="proj-image-url"
                type="url"
                name="imageUrl"
                placeholder="https://example.com/screenshot.png"
                value={projForm.imageUrl}
                onChange={handleProjChange}
              />
              {projForm.imageUrl && !/^https?:\/\/.+/.test(projForm.imageUrl) && (
                <span className="error-text" style={{ marginBottom: '1rem' }}>URL must start with http:// or https://</span>
              )}
            </fieldset>

            <fieldset className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <legend style={{ float: 'left', border: 'none', padding: '0 0.5rem', margin: 0 }}>Technologies Used</legend>
                <button
                  type="button"
                  className="btn-clear-selection"
                  onClick={() => setProjForm(prev => ({ ...prev, techStack: [] }))}
                  aria-label="Clear all selected technologies"
                >
                  Clear Selection
                </button>
              </div>
              <p className="field-info-text">Select all technologies that apply to compile this project's stack list:</p>
              <div className="presets-chip-grid">
                {TECH_PRESETS.map((tech) => {
                  const isSelected = projForm.techStack.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      className={`tech-preset-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTechToggle(tech.id)}
                      style={isSelected ? { '--chip-accent': tech.color } : {}}
                      aria-pressed={isSelected}
                    >
                      <span className="chip-logo-wrapper" style={{ color: tech.color }}>{getTechIcon(tech.id)}</span>
                      <span className="chip-name-label">{tech.name}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Deployment Links</legend>

              <label htmlFor="proj-repo-link">GitHub Repo URL</label>
              <input
                id="proj-repo-link"
                type="url"
                name="repoLink"
                placeholder="https://github.com/username/project"
                value={projForm.repoLink}
                onChange={handleProjChange}
              />
              {projForm.repoLink && !/^https?:\/\/.+/.test(projForm.repoLink) && (
                <span className="error-text" style={{ marginBottom: '1rem' }}>URL must start with http:// or https://</span>
              )}

              <label htmlFor="proj-live-link">Live Demo URL</label>
              <input
                id="proj-live-link"
                type="url"
                name="link"
                placeholder="https://project.amplifyapp.com"
                value={projForm.link}
                onChange={handleProjChange}
              />
              {projForm.link && !/^https?:\/\/.+/.test(projForm.link) && (
                <span className="error-text" style={{ marginBottom: '1rem' }}>URL must start with http:// or https://</span>
              )}
            </fieldset>

            <div className="admin-actions">
              <button type="submit" className="btn-primary" disabled={!isFormValid()}>
                {editingProjId ? 'Save Changes' : 'Create Project'}
              </button>
              {editingProjId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingProjId(null);
                    setProjForm({ title: '', description: '', category: 'Full Stack Project', techStack: [], imageUrl: '', link: '', repoLink: '' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-right">
          <h2>List of Projects</h2>
          <div className="admin-projects">
            {projects.length === 0 && <p>No projects added yet.</p>}
            {projects.map(p => (
              <div key={p._id} className="admin-project-card">
                <h3 style={{ fontSize: '0.95rem' }}>{p.title}</h3>
                <div className="admin-actions">
                  <button onClick={() => handleProjEdit(p)} className="btn-edit">Edit</button>
                  <button onClick={() => handleProjDelete(p._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Contact Messages ── */}
      <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
        <h2>Contact Messages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {messages.length === 0 && <p>No messages received yet.</p>}
          {messages.map(msg => (
            <div key={msg._id} className="message-card">
              <p><strong>{msg.name}</strong> ({msg.email})</p>
              <p>{msg.message}</p>
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
