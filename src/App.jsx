import { useState } from "react";
import {
  FiGithub, FiLinkedin, FiMail, FiInstagram, FiTwitter,
  FiExternalLink, FiDownload, FiMapPin, FiCopy, FiCheck, FiX,
  FiHeadphones, FiArrowDown, FiHeart, FiDisc,
} from "react-icons/fi";
import { profile, currently, topMusic, playlist, loves, builderIntro, experience, projects, skills } from "./data";
import MusicPlayer from "./MusicPlayer";
import DynamicIsland from "./DynamicIsland";
import "./App.css";

export default function App() {
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      {/* ───────────────── DYNAMIC ISLAND (mobile) ───────────────── */}
      <DynamicIsland nowPlaying={nowPlaying} />

      {/* ───────────────── HERO ───────────────── */}
      <header className="hero">
        <div className="container">
          <div className="hero-wave">hey, you found me <span className="wave">👋</span></div>
          <h1 className="hero-name">i'm <span className="name-highlight">{profile.name}</span></h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="hero-bio">{profile.bio}</p>

          <div className="hero-actions">
            <a href="#music" className="link-btn link-btn-accent">
              <FiHeadphones /> press play
            </a>
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="link-btn">
              <FiInstagram /> instagram
            </a>
            <div className="email-wrapper">
              <button onClick={() => setShowEmail(!showEmail)} className="link-btn">
                <FiMail /> say hi
              </button>
              {showEmail && (
                <div className="email-popup">
                  <div className="email-popup-header">
                    <span className="email-popup-label">email</span>
                    <button className="email-popup-close" onClick={() => setShowEmail(false)}><FiX size={14} /></button>
                  </div>
                  <div className="email-popup-body">
                    <span className="email-popup-address">{profile.email}</span>
                    <button className="email-popup-copy" onClick={copyEmail}>
                      {copied ? <><FiCheck size={14} /> copied</> : <><FiCopy size={14} /> copy</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hero-scroll-hint"><FiArrowDown /> scroll</div>
        </div>
      </header>

      {/* ───────────────── CURRENTLY ───────────────── */}
      <section className="section section-currently">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">currently</h2>
            <p className="section-sub">a little snapshot of right now</p>
          </div>
          <div className="currently-grid">
            {currently.map((item) => (
              <div key={item.label} className="currently-item">
                <span className="currently-emoji">{item.emoji}</span>
                <div>
                  <div className="currently-label">{item.label}</div>
                  <div className="currently-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── TOP 5 MUSIC ───────────────── */}
      <section className="section section-music" id="music">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">
              <FiHeadphones className="title-icon" /> top 5 on repeat
            </h2>
            <p className="section-sub">
              the songs i can't stop playing this season. tap any cover to play.
            </p>
          </div>
          <MusicPlayer seeds={topMusic} onStateChange={setNowPlaying} />
        </div>
      </section>

      {/* ───────────────── PLAYLIST ───────────────── */}
      <section className="section section-playlist">
        <div className="container">
          <div className="playlist-card">
            <div className="playlist-art">
              <div className="playlist-art-disc">
                <FiHeadphones />
              </div>
            </div>
            <div className="playlist-info">
              <span className="playlist-pretitle">the full playlist</span>
              <h3 className="playlist-name">{playlist.name}</h3>
              <p className="playlist-desc">{playlist.description}</p>
              <div className="playlist-actions">
                {playlist.spotify && (
                  <a href={playlist.spotify} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-accent">
                    <FiExternalLink /> open in spotify
                  </a>
                )}
                {playlist.alac && (
                  <a href={playlist.alac} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-alac">
                    <FiDisc /> alac lossless
                  </a>
                )}
                {playlist.appleMusic && (
                  <a href={playlist.appleMusic} target="_blank" rel="noopener noreferrer" className="link-btn">
                    apple music
                  </a>
                )}
                {playlist.youtube && (
                  <a href={playlist.youtube} target="_blank" rel="noopener noreferrer" className="link-btn">
                    youtube
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── THINGS I LOVE ───────────────── */}
      <section className="section section-loves">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">
              <FiHeart className="title-icon" /> things i love
            </h2>
            <p className="section-sub">a tiny window into my taste</p>
          </div>
          <div className="loves-grid">
            {loves.map((group) => (
              <div key={group.category} className="loves-group">
                <h3 className="loves-category">{group.category}</h3>
                <ul className="loves-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── BUILDER (portfolio, secondary) ───────────────── */}
      <section className="section section-builder" id="work">
        <div className="container">
          <div className="builder-intro">
            <span className="builder-badge">also</span>
            <h2 className="section-title builder-title">{builderIntro.heading}</h2>
            <p className="builder-text">{builderIntro.text}</p>
            <p className="builder-role">
              <span className="builder-role-label">{builderIntro.role}</span> · {builderIntro.shortBio}
            </p>
            <div className="builder-actions">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-btn">
                <FiGithub /> github
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-btn">
                <FiLinkedin /> linkedin
              </a>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-accent">
                <FiDownload /> resume
              </a>
            </div>
          </div>

          {/* Experience */}
          <div className="builder-block">
            <h3 className="builder-block-title">experience</h3>
            <div className="experience-list">
              {experience.map((exp) => (
                <div key={exp.role + exp.company} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h4 className="experience-role">{exp.role}</h4>
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

          {/* Projects */}
          <div className="builder-block">
            <h3 className="builder-block-title">things i've built</h3>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.title} className="project-card">
                  <div className="project-header">
                    <h4 className="project-title">{project.title}</h4>
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

          {/* Skills */}
          <div className="builder-block">
            <h3 className="builder-block-title">stack & tools</h3>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="skill-group">
                  <h4 className="skill-category">{category}</h4>
                  <div className="skill-tags">
                    {items.map((skill) => (
                      <span key={skill} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER / CONTACT ───────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <h3 className="footer-cta">say hi, i don't bite.</h3>
              <p className="footer-sub">
                <FiMapPin size={13} /> {profile.location}
              </p>
            </div>
            <div className="footer-socials">
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href={`mailto:${profile.email}`} aria-label="Email"><FiMail /></a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>made with chai & late nights · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
