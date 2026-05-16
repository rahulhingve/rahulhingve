import { useEffect, useState } from "react";
import { profile } from "./data";

const sections = [
  { id: "currently", label: "now" },
  { id: "music", label: "music" },
  { id: "loves", label: "taste" },
  { id: "work", label: "work" },
  { id: "contact", label: "say hi" },
];

// ─────────────────────────────────────────────────────────
// NavBar — desktop only. Sticky, glass, minimal.
// Shows scrollspy active state.
// ─────────────────────────────────────────────────────────
export default function NavBar() {
  const [activeId, setActiveId] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
      <div className="navbar-inner">
        <a href="#top" className="navbar-brand">
          <span className="navbar-brand-mark">{profile.name.charAt(0).toLowerCase()}.</span>
          <span className="navbar-brand-name">{profile.name.toLowerCase()}</span>
        </a>
        <ul className="navbar-links">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={activeId === s.id ? "is-active" : ""}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
