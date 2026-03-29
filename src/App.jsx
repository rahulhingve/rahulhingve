import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiExternalLink, FiDownload, FiMapPin, FiGlobe, FiCopy, FiCheck, FiX } from "react-icons/fi";
import { profile, experience, projects, skills } from "./data";
import "./App.css";

export default function App() {
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="app">
      {/* Hero */}
      <header className="hero">
        <div className="container">
          <div className="hero-status">
            <span className="status-dot" />
            Open to opportunities
          </div>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-bio">{profile.bio}</p>
          <div className="hero-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-btn">
              <FiGithub /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-btn">
              <FiLinkedin /> LinkedIn
            </a>
            <div className="email-wrapper">
              <button onClick={() => setShowEmail(!showEmail)} className="link-btn">
                <FiMail /> Email
              </button>
              {showEmail && (
                <div className="email-popup">
                  <div className="email-popup-header">
                    <span className="email-popup-label">Email</span>
                    <button className="email-popup-close" onClick={() => setShowEmail(false)}><FiX size={14} /></button>
                  </div>
                  <div className="email-popup-body">
                    <span className="email-popup-address">{profile.email}</span>
                    <button className="email-popup-copy" onClick={handleCopyEmail}>
                      {copied ? <><FiCheck size={14} /> Copied!</> : <><FiCopy size={14} /> Copy</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-accent">
              <FiDownload /> Resume
            </a>
          </div>
        </div>
      </header>

      {/* Experience */}
      <section className="section" id="experience">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="experience-list">
            {experience.map((exp) => (
              <div key={exp.role + exp.company} className="experience-item">
                <div className="experience-header">
                  <div>
                    <h3 className="experience-role">{exp.role}</h3>
                    <p className="experience-company">
                      {exp.company}
                      {exp.client && <span className="experience-client"> · {exp.client}</span>}
                    </p>
                  </div>
                  <div className="experience-meta">
                    <span className="experience-period">{exp.period}</span>
                    {exp.location && <span className="experience-location"><FiMapPin size={11} /> {exp.location}</span>}
                  </div>
                </div>
                <ul className="experience-points">
                  {exp.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section" id="projects">
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.title} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" title="Source code">
                      <FiGithub />
                    </a>
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" title="Live demo">
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section" id="skills">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-group">
                <h3 className="skill-category">{category}</h3>
                <div className="skill-tags">
                  {items.map((skill) => (
                    <span key={skill} className="tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <span><FiMapPin size={14} /> {profile.location}</span>
              <a href={`mailto:${profile.email}`}><FiMail size={14} /> {profile.email}</a>
            </div>
            <div className="footer-socials">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" aria-label="Website"><FiGlobe /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
