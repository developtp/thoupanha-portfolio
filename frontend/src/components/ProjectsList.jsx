import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TECH_PRESETS, getTechIcon } from '../utils/techIcons';

const API_URL = 'http://localhost:5000/api';

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const ProjectCard = ({ project, index }) => {
  const { ref, isRevealed } = useScrollReveal();

  // Normalize tech stack input (handles both new arrays and legacy comma-separated strings)
  let normalizedTech = [];
  if (Array.isArray(project.techStack)) {
    normalizedTech = project.techStack;
  } else if (typeof project.techStack === 'string') {
    normalizedTech = project.techStack.split(',').map(tech => tech.trim().toLowerCase()).filter(Boolean);
  }

  const formattedNumber = (index + 1).toString().padStart(2, '0');

  // Use the stored category label; fall back gracefully for old documents without the field
  const category = project.category || (normalizedTech.includes('react') ? 'Web App' : 'Full Stack Project');

  return (
    <div
      ref={ref}
      className={`project-card reveal ${isRevealed ? 'active' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="project-image-wrapper">
        <span className="project-number" aria-hidden="true">{formattedNumber}</span>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`Screenshot of ${project.title}`}
            className="project-image"
            loading="lazy"
            decoding="async"
            width="400"
            height="220"
          />
        ) : (
          <div className="project-image-placeholder">No Image Available</div>
        )}
      </div>
      
      <div className="project-info">
        <span className="project-category">{category}</span>
        <h3>{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {normalizedTech.length > 0 && (
          <div className="tech-pills">
            {normalizedTech.map(techId => {
              const preset = TECH_PRESETS.find(p => p.id === techId);
              const name = preset ? preset.name : techId;
              const color = preset ? preset.color : 'currentColor';
              return (
                <span key={techId} className="tech-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color, display: 'inline-flex', alignItems: 'center' }} aria-hidden="true">
                    {getTechIcon(techId, 12)}
                  </span>
                  {name}
                </span>
              );
            })}
          </div>
        )}

        <div className="project-actions-row" style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
          {project.repoLink && (
            <a 
              href={project.repoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
              aria-label={`View GitHub repository for ${project.title}`}
            >
              <GitHubIcon /> GitHub
            </a>
          )}
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary" 
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
              aria-label={`Visit live demo for ${project.title}`}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (projects.length === 0) return <p>No projects found. Add some in the Admin dashboard!</p>;

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectsList;
