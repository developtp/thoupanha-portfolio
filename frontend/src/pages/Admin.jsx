import React, { useState, useEffect, useRef } from 'react';
import { TECH_PRESETS, getTechIcon } from '../utils/techIcons';
import { API_URL } from '../config/api';

const GitHubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const Admin = () => {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loginError, setLoginError] = useState('');

  const [projects, setProjects]   = useState([]);
  const [messages, setMessages]   = useState([]);
  
  const [projForm, setProjForm]   = useState({ 
    title: '', 
    description: '', 
    category: 'Full Stack Project',
    techStack: [], 
    imageUrl: '', 
    link: '', 
    repoLink: '' 
  });
  const [editingProjId, setEditingProjId] = useState(null);
  const [dragActive, setDragActive]       = useState(false);

  const [skills, setSkills]           = useState([]);
  const [skillInput, setSkillInput]   = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillEditVal, setSkillEditVal]     = useState('');

  const [social, setSocial] = useState({ github: '', linkedin: '', instagram: '' });
  const [socialStatus, setSocialStatus] = useState('');

  // Theme logic
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Facts states
  const [facts, setFacts] = useState([]);
  const [factForm, setFactForm] = useState({ icon: '', headline: '', description: '' });
  const [editingFactId, setEditingFactId] = useState(null);

  // Profile states
  const [profile, setProfile] = useState({ heroTitle: '', heroSubtitle: '', bioIntro: '' });
  const [profileStatus, setProfileStatus] = useState('');

  // Auto focus first PIN box
  useEffect(() => {
    if (!token) {
      document.getElementById('pin-input-0')?.focus();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchMessages();
      fetchSkills();
      fetchSocial();
      fetchFacts();
      fetchProfile();
    }
  }, [token]);

  const fetchFacts = async () => {
    try {
      const res = await fetch(`${API_URL}/facts`);
      if (res.ok) setFacts(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`);
      if (res.ok) setProfile(await res.json());
    } catch (err) { console.error(err); }
  };

  // Auth helper headers builder
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

  // Fetchers

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

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_URL}/skills`);
      if (res.ok) setSkills(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchSocial = async () => {
    try {
      const res = await fetch(`${API_URL}/social`);
      if (res.ok) setSocial(await res.json());
    } catch (err) { console.error(err); }
  };

  // Login Operations

  const handlePinChange = (val, idx) => {
    if (val && !/^[0-9]$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    // Auto-advance
    if (val && idx < 5) {
      document.getElementById(`pin-input-${idx + 1}`)?.focus();
    }
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

  // Project CRUD

  const handleProjChange = (e) => setProjForm({ ...projForm, [e.target.name]: e.target.value });

  const processImageFile = (file) => {
    if (file.size > 3 * 1024 * 1024) {
      alert("File size exceeds 3MB limit.");
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjForm(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSocialChange = (e) => setSocial({ ...social, [e.target.name]: e.target.value });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleTechToggle = (techId) => {
    const isSelected = projForm.techStack.includes(techId);
    let newTechStack;
    if (isSelected) {
      newTechStack = projForm.techStack.filter(id => id !== techId);
    } else {
      newTechStack = [...projForm.techStack, techId];
    }
    setProjForm(prev => ({ ...prev, techStack: newTechStack }));
  };

  const isFormValid = () => {
    if (!projForm.title.trim()) return false;
    if (!projForm.description.trim()) return false;
    if (!projForm.imageUrl) return false;
    const urlPattern = /^https?:\/\/.+/;
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
      const res = await fetch(url, { 
        method, 
        headers: getAuthHeaders(), 
        body: JSON.stringify(projForm) 
      });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setProjForm({ title: '', description: '', category: 'Full Stack Project', techStack: [], imageUrl: '', link: '', repoLink: '' });
        setEditingProjId(null);
        fetchProjects();
      }
    } catch (err) { console.error(err); }
  };

  const handleProjEdit = (p) => {
    let finalStack = [];
    if (Array.isArray(p.techStack)) {
      finalStack = p.techStack;
    } else if (typeof p.techStack === 'string') {
      finalStack = p.techStack.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    }

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

  // Skill Actions

  const handleSkillAdd = async (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    try {
      const res = await fetch(`${API_URL}/skills`, { 
        method: 'POST', 
        headers: getAuthHeaders(), 
        body: JSON.stringify({ name: skillInput.trim() }) 
      });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setSkillInput('');
        fetchSkills();
      }
    } catch (err) { console.error(err); }
  };

  const handleSkillEditSave = async (id) => {
    if (!skillEditVal.trim()) return;
    try {
      const res = await fetch(`${API_URL}/skills/${id}`, { 
        method: 'PUT', 
        headers: getAuthHeaders(), 
        body: JSON.stringify({ name: skillEditVal.trim() }) 
      });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setEditingSkillId(null);
        setSkillEditVal('');
        fetchSkills();
      }
    } catch (err) { console.error(err); }
  };

  const handleSkillDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`${API_URL}/skills/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (handleResponseError(res)) return;
      if (res.ok) fetchSkills();
    } catch (err) { console.error(err); }
  };

  // Social Actions

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/social`, { 
        method: 'PUT', 
        headers: getAuthHeaders(), 
        body: JSON.stringify(social) 
      });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setSocialStatus('Saved ✓');
        setTimeout(() => setSocialStatus(''), 2500);
      }
    } catch (err) {
      setSocialStatus('Error');
    }
  };

  // Fact CRUD

  const handleFactChange = (e) => setFactForm({ ...factForm, [e.target.name]: e.target.value });

  const handleFactSubmit = async (e) => {
    e.preventDefault();
    if (!factForm.headline.trim() || !factForm.description.trim()) return;

    const method = editingFactId ? 'PUT' : 'POST';
    const url    = editingFactId ? `${API_URL}/facts/${editingFactId}` : `${API_URL}/facts`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(factForm)
      });
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
    setFactForm({
      icon: fact.icon || '',
      headline: fact.headline,
      description: fact.description
    });
  };

  const handleFactDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fact card?')) return;
    try {
      const res = await fetch(`${API_URL}/facts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (handleResponseError(res)) return;
      if (res.ok) fetchFacts();
    } catch (err) { console.error(err); }
  };

  const handleFactReorder = async (currentIndex, direction) => {
    const newFacts = [...facts];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= newFacts.length) return;

    // Swap elements locally
    const temp = newFacts[currentIndex];
    newFacts[currentIndex] = newFacts[targetIndex];
    newFacts[targetIndex] = temp;

    setFacts(newFacts);

    try {
      const ids = newFacts.map(f => f._id);
      const res = await fetch(`${API_URL}/facts/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids })
      });
      if (handleResponseError(res)) return;
      if (!res.ok) fetchFacts();
    } catch (err) {
      console.error(err);
      fetchFacts();
    }
  };

  // Profile Actions

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profile)
      });
      if (handleResponseError(res)) return;
      if (res.ok) {
        setProfileStatus('Saved ✓');
        setTimeout(() => setProfileStatus(''), 2500);
      }
    } catch (err) {
      console.error(err);
      setProfileStatus('Error');
    }
  };

  // Login Screen Render
  if (!token) {
    return (
      <div className="login-screen-backdrop">
        {/* Theme toggle in top-right corner of the login backdrop */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10001 }}
        >
          <span className={`theme-toggle-wrapper ${theme}`}>
            <svg className="theme-icon sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg className="theme-icon moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>
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

  // Live Preview Computations
  const previewTitle    = projForm.title.trim() || 'Ghost Task Manager App';
  const previewCategory = projForm.category.trim() || 'Full Stack Project';
  const previewDesc     = projForm.description.trim() || 'Provide a compelling description of what this application does, its core capabilities, and which engineering paradigms it satisfies.';
  const previewNumber   = editingProjId
    ? (projects.findIndex(p => p._id === editingProjId) + 1).toString().padStart(2, '0')
    : (projects.length + 1).toString().padStart(2, '0');

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
            <span className={`theme-toggle-wrapper ${theme}`}>
              <svg className="theme-icon sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg className="theme-icon moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </button>
          <button onClick={handleLogout} className="btn-secondary">Log Out</button>
          <a href="/" className="btn-secondary">← Back to Site</a>
        </div>
      </nav>

      {/* Row 1: Profile Settings (Hero & Bio intro) */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        {/* Left Side: Profile Form */}
        <div className="admin-left">
          <h2>Profile Settings (Hero & Bio)</h2>
          <form onSubmit={handleProfileSubmit} className="admin-form">
            <label htmlFor="profile-hero-title">Hero Title</label>
            <input 
              id="profile-hero-title" 
              type="text" 
              name="heroTitle" 
              placeholder="e.g. Hi, I'm <span class='highlight'>Thou Panha</span>" 
              value={profile.heroTitle} 
              onChange={handleProfileChange} 
              required
            />

            <label htmlFor="profile-hero-subtitle">Hero Subtitle</label>
            <input 
              id="profile-hero-subtitle" 
              type="text" 
              name="heroSubtitle" 
              placeholder="e.g. A Software Engineering Student" 
              value={profile.heroSubtitle} 
              onChange={handleProfileChange} 
              required
            />

            <label htmlFor="profile-bio-intro">Bio Caption (About Section)</label>
            <textarea 
              id="profile-bio-intro" 
              name="bioIntro" 
              placeholder="Provide the introductory caption for the About section." 
              value={profile.bioIntro} 
              onChange={handleProfileChange} 
              required
              rows={4}
            />

            <div className="admin-actions">
              <button type="submit" className="btn-primary">Save Profile Settings</button>
              {profileStatus && <span className="admin-status">{profileStatus}</span>}
            </div>
          </form>
        </div>

        {/* Right Side: Tips and formatting guidelines */}
        <div className="admin-right">
          <h2>Formatting Guide</h2>
          <div className="glass-modal" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              You can style text in the Hero and Bio elements using safe HTML markup:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <strong>Accent Color:</strong> Wrap text in <code>&lt;span class="highlight"&gt;text&lt;/span&gt;</code> to apply the theme's orange gradient.
              </li>
              <li>
                <strong>Bold Text:</strong> Wrap text in <code>&lt;strong&gt;text&lt;/strong&gt;</code> to make it bold.
              </li>
              <li>
                <strong>Underlined Text:</strong> Wrap text in <code>&lt;u&gt;text&lt;/u&gt;</code> to draw an underline.
              </li>
              <li>
                <strong>Italics:</strong> Wrap text in <code>&lt;em&gt;text&lt;/em&gt;</code> for slanted typography.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Row 2: About Fact Cards CRUD */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        {/* Left: Add/Edit Fact Form */}
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
                  onClick={() => {
                    setEditingFactId(null);
                    setFactForm({ icon: '', headline: '', description: '' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: List of existing fact cards with reorder */}
        <div className="admin-right">
          <h2>About Fact Cards</h2>
          <div className="admin-projects">
            {facts.length === 0 ? <p>No fact cards added yet.</p> : null}
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
                  {/* Reordering Up/Down controls */}
                  <button
                    type="button"
                    onClick={() => handleFactReorder(index, 'up')}
                    disabled={index === 0}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '32px' }}
                    aria-label="Move fact card up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFactReorder(index, 'down')}
                    disabled={index === facts.length - 1}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: '32px' }}
                    aria-label="Move fact card down"
                  >
                    ↓
                  </button>
                  
                  <button onClick={() => handleFactEdit(fact)} className="btn-edit">Edit</button>
                  <button onClick={() => handleFactDelete(fact._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Skills list */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        <div className="admin-left">
          <h2>Skills List</h2>
          <form onSubmit={handleSkillAdd} className="admin-form">
            <label htmlFor="skill-name">Skill Name *</label>
            <input
              id="skill-name"
              type="text"
              placeholder="e.g. React"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              required
            />
            <div className="admin-actions">
              <button type="submit" className="btn-primary">Add Skill</button>
            </div>
          </form>
        </div>

        <div className="admin-right">
          <h2>Current Skills</h2>
          <div className="admin-projects">
            {skills.length === 0 ? <p>No skills added yet.</p> : null}
            {skills.map(skill => (
              <div key={skill._id} className="admin-project-card">
                {editingSkillId === skill._id ? (
                  <div className="admin-inline-edit" style={{ width: '100%' }}>
                    <label htmlFor={`skill-edit-${skill._id}`} className="sr-only">Edit skill name</label>
                    <input
                      id={`skill-edit-${skill._id}`}
                      type="text"
                      value={skillEditVal}
                      onChange={e => setSkillEditVal(e.target.value)}
                      autoFocus
                    />
                    <div className="admin-actions" style={{ marginTop: '0.5rem' }}>
                      <button onClick={() => handleSkillEditSave(skill._id)} className="btn-edit">Save</button>
                      <button onClick={() => { setEditingSkillId(null); setSkillEditVal(''); }} className="btn-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>{skill.name}</span>
                    <div className="admin-actions">
                      <button onClick={() => { setEditingSkillId(skill._id); setSkillEditVal(skill.name); }} className="btn-edit">Edit</button>
                      <button onClick={() => handleSkillDelete(skill._id)} className="btn-delete">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Projects Management */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        {/* Left Side: Create/Edit Project Form */}
        <div className="admin-left">
          <h2>{editingProjId ? 'Edit Project Details' : 'Create New Project'}</h2>
          
          <form onSubmit={handleProjSubmit} className="admin-form">
            
            {/* Section: Basic Info */}
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

            {/* Section: Media & Upload */}
            <fieldset className="form-section">
              <legend>Project Image *</legend>
              
              <div 
                className={`drag-drop-area ${dragActive ? 'drag-active' : ''} ${projForm.imageUrl ? 'has-preview' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {projForm.imageUrl ? (
                  <div className="upload-preview-container">
                    <img src={projForm.imageUrl} alt="Preview of uploaded screenshot" className="upload-preview-thumb" />
                    <label htmlFor="proj-file-replace" className="btn-secondary upload-replace-btn">Replace Image</label>
                    <input 
                      id="proj-file-replace" 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleFileChange} 
                      className="sr-only" 
                    />
                  </div>
                ) : (
                  <div className="drag-drop-prompt">
                    <p>Drag and drop your screenshot here, or</p>
                    <label htmlFor="proj-file" className="btn-secondary">Browse files</label>
                    <input 
                      id="proj-file" 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleFileChange} 
                      className="sr-only" 
                    />
                    <small className="upload-limit-info">JPG, PNG, or WEBP (Max 3MB)</small>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Section: Tech Stack Chip Grid */}
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
                      <span className="chip-logo-wrapper" style={{ color: tech.color }}>
                        {getTechIcon(tech.id)}
                      </span>
                      <span className="chip-name-label">{tech.name}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Section: Repository & Live links */}
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
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!isFormValid()}
              >
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

        {/* Right Side: Real-time Preview Panel & Project List */}
        <div className="admin-right">
          <h2>Live Project Card Preview</h2>
          <div className="preview-pane-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="project-card active">
              <div className="project-image-wrapper">
                <span className="project-number">{previewNumber}</span>
                {projForm.imageUrl ? (
                  <img src={projForm.imageUrl} alt={`Preview of card for ${previewTitle}`} className="project-image" />
                ) : (
                  <div className="project-image-placeholder">Choose/drag a screenshot to preview image</div>
                )}
              </div>
              <div className="project-info">
                <span className="project-category">{previewCategory}</span>
                <h3 style={{ margin: '0.5rem 0' }}>{previewTitle}</h3>
                <p className="project-desc">{previewDesc}</p>
                
                {projForm.techStack.length > 0 && (
                  <div className="tech-pills">
                    {projForm.techStack.map(techId => {
                      const found = TECH_PRESETS.find(p => p.id === techId);
                      const name = found ? found.name : techId;
                      const color = found ? found.color : '#fff';
                      return (
                        <span key={techId} className="tech-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color, display: 'inline-flex', alignItems: 'center' }}>
                            {getTechIcon(techId, 12)}
                          </span>
                          {name}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="preview-buttons-row" style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  {projForm.repoLink && (
                    <a href={projForm.repoLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <GitHubIcon /> GitHub
                    </a>
                  )}
                  {projForm.link && (
                    <a href={projForm.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2>List of Projects</h2>
              <div className="admin-projects" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {projects.length === 0 ? <p>No projects added yet.</p> : null}
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
        </div>
      </div>

      {/* Row 5: Social Connections & Contact Messages */}
      <div className="admin-content" style={{ marginTop: '2rem' }}>
        <div className="admin-left">
          <h2>Social Connections</h2>
          <form onSubmit={handleSocialSubmit} className="admin-form">
            <label htmlFor="social-github"><GitHubIcon /> GitHub URL</label>
            <input id="social-github" type="url" name="github" placeholder="https://github.com/username" value={social.github} onChange={handleSocialChange} />

            <label htmlFor="social-linkedin"><LinkedInIcon /> LinkedIn URL</label>
            <input id="social-linkedin" type="url" name="linkedin" placeholder="https://linkedin.com/in/username" value={social.linkedin} onChange={handleSocialChange} />

            <label htmlFor="social-instagram"><InstagramIcon /> Instagram URL</label>
            <input id="social-instagram" type="url" name="instagram" placeholder="https://instagram.com/username" value={social.instagram} onChange={handleSocialChange} />

            <div className="admin-actions">
              <button type="submit" className="btn-primary">Save URLs</button>
              {socialStatus && <span className="admin-status">{socialStatus}</span>}
            </div>
          </form>
        </div>

        <div className="admin-right">
          <h2>Contact Messages</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {messages.length === 0 ? <p>No messages received yet.</p> : null}
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
    </div>
  );
};

export default Admin;
