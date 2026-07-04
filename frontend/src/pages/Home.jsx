import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import ProjectsList from '../components/ProjectsList';
import ContactForm from '../components/ContactForm';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { API_URL } from '../config/api';

const RevealWrapper = ({ children, delay = 0, className = '' }) => {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${isRevealed ? 'active' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [skills, setSkills] = useState([]);
  const [facts, setFacts] = useState([]);
  const [profile, setProfile] = useState({
    heroTitle: "Hi, I'm <span class=\"highlight\">Thou Panha</span>",
    heroSubtitle: "A Software Engineering Student",
    bioIntro: "I am just a software engineering student who likes to play video games, watch movies, and learn new things. "
  });
  
  // Easter egg states
  const [copyrightClicks, setCopyrightClicks] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const rafRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch skills, facts, and profile from API so they stay in sync with admin changes
  useEffect(() => {
    fetch(`${API_URL}/skills`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Could not load skills:', err));

    fetch(`${API_URL}/facts`)
      .then(res => res.json())
      .then(data => setFacts(data))
      .catch(err => console.error('Could not load facts:', err));

    fetch(`${API_URL}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Could not load profile settings:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const totalScroll   = document.documentElement.scrollTop;
        const windowHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress      = windowHeight > 0 ? totalScroll / windowHeight : 0;

        setHasScrolled(totalScroll > 50);
        setScrollProgress(progress);
        document.documentElement.style.setProperty('--scroll-y', `${totalScroll}px`);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Grace-period flag: Escape is blocked for 350ms after the modal first renders
  // so tail-end clicks from spam-clicking the copyright text can't instantly dismiss it
  const escapeLocked = useRef(false);

  // Focus trap + Escape handler for easter egg modal
  useEffect(() => {
    if (!showAdminModal) return;

    // Lock Escape for 350ms after mount
    escapeLocked.current = true;
    const unlockTimer = setTimeout(() => {
      escapeLocked.current = false;
    }, 350);

    const focusableElements = modalRef.current?.querySelectorAll('a, button');
    const firstElement = focusableElements?.[0];
    const lastElement  = focusableElements?.[focusableElements.length - 1];

    const handleKeydown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
      // Only close via Escape after grace period — not during the spam-click burst
      if (e.key === 'Escape' && !escapeLocked.current) {
        setShowAdminModal(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    // Move focus into the modal immediately so keyboard users aren't stranded
    firstElement?.focus();

    return () => {
      clearTimeout(unlockTimer);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [showAdminModal]);

  // No handleBackdropClick — this popup deliberately has NO click-outside-to-close.
  // Accidental extra clicks after the copyright spam-click must not dismiss it.
  // Close only via: Cancel button | Escape key (after grace period).


  return (
    <div className="home-container">
      <div className="bg-texture" aria-hidden="true" />
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />
      <Navbar />

      <header className="hero section-dark" id="hero">
        <div className="bg-grid" aria-hidden="true" />
        <div className="glow-container" aria-hidden="true">
          <div className="glow-blob" style={{ top: '10%', left: '-5%', width: '500px', height: '500px' }} />
          <div className="glow-blob" style={{ bottom: '-10%', right: '-5%', width: '400px', height: '400px' }} />
        </div>

        <div className="hero-content">
          <RevealWrapper delay={0}>
            <h1 dangerouslySetInnerHTML={{ __html: profile.heroTitle }} />
          </RevealWrapper>
          <RevealWrapper delay={150}>
            <p dangerouslySetInnerHTML={{ __html: profile.heroSubtitle }} />
          </RevealWrapper>
          <RevealWrapper delay={300}>
            <a href="#projects" className="btn-primary">View My Work</a>
          </RevealWrapper>
        </div>

        <div className={`scroll-indicator ${hasScrolled ? 'fade-out' : ''}`} aria-hidden="true">
          <span>Scroll to explore</span>
          <div className="bounce-arrow">↓</div>
        </div>
      </header>

      <section className="about-section section-alt" id="about">
        <div className="section-content relative-z">
          <RevealWrapper>
            <h2>About Me</h2>
            <p className="about-intro" dangerouslySetInnerHTML={{ __html: profile.bioIntro }} />
          </RevealWrapper>

          <div className="fact-cards-grid">
            {facts.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>No facts added yet. Add them in the Admin dashboard!</p>
            ) : (
              facts.map((fact, index) => (
                <RevealWrapper key={fact._id} delay={(index + 1) * 100}>
                  <div className="fact-card" tabIndex="0">
                    <div className="fact-front">
                      {fact.icon && <span className="fact-icon">{fact.icon}</span>}
                      <h4>{fact.headline}</h4>
                    </div>
                    <div className="fact-back">
                      <p>{fact.description}</p>
                    </div>
                  </div>
                </RevealWrapper>
              ))
            )}
          </div>

          {skills.length > 0 && (
            <RevealWrapper delay={400} className="mt-4">
              <h3>Skills</h3>
              <ul className="skills-list">
                {skills.map((skill, index) => (
                  <li
                    key={skill._id}
                    className="skill-pill"
                    style={{ transitionDelay: `${(index * 80) + 400}ms` }}
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </RevealWrapper>
          )}
        </div>
      </section>

      <section className="projects-section section-dark" id="projects">
        <div className="glow-container" aria-hidden="true">
          <div className="glow-blob" style={{ top: '20%', right: '10%', width: '600px', height: '600px' }} />
        </div>
        <div className="section-content relative-z">
          <RevealWrapper><h2>My Projects</h2></RevealWrapper>
          <ProjectsList />
        </div>
      </section>

      <section className="contact-section section-alt" id="contact">
        <div className="section-content relative-z">
          <RevealWrapper><h2>Contact Me</h2></RevealWrapper>
          <ContactForm />
        </div>
      </section>

      <footer>
        <p 
          onClick={() => {
            const nextCount = copyrightClicks + 1;
            setCopyrightClicks(nextCount);
            if (nextCount >= 5) {
              setShowAdminModal(true);
              setCopyrightClicks(0);
            }
          }}
          style={{ userSelect: 'none' }}
        >
          &copy; {new Date().getFullYear()} Thou Panha. All rights reserved.
        </p>
      </footer>

      {showAdminModal && (
        /* No onClick on the backdrop — close only via Cancel button or Escape key */
        <div className="modal-backdrop">
          <div className="glass-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Secret Route Access</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>Do you want to navigate to the hidden administrative control panel?</p>
            <div className="modal-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowAdminModal(false)}>Cancel</button>
              <a href="/admin" className="btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center' }}>Confirm</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
