import { useEffect, useRef, useState } from 'react';
import content from '../../data/content';
import projectsData from '../../data/projects';
import './Projects.css';

const NARROW_BREAKPOINT = 560;

function titleFor(project) {
  return `${project.type} · ${project.location}`;
}

function descriptionFor(project) {
  return `${project.size} system generating ${project.output} — ${project.savings} saved annually`;
}

function prefersStatic() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= NARROW_BREAKPOINT;
}

// Crossfades between the active project's title/description whenever it
// changes — both layers render simultaneously for the transition window
// (outgoing fading 1→0, incoming fading 0→1 on the same frame) rather than
// a sequential swap, so it reads as a genuine cross, not a hard cut.
function ActiveProjectText({ project }) {
  const [state, setState] = useState({ incoming: project, outgoing: null, transitioning: false });
  const prevProjectRef = useRef(project);

  useEffect(() => {
    if (prevProjectRef.current === project) return undefined;
    const outgoing = prevProjectRef.current;
    prevProjectRef.current = project;
    setState({ incoming: project, outgoing, transitioning: false });

    const frame = requestAnimationFrame(() => {
      setState((s) => (s.incoming === project ? { ...s, transitioning: true } : s));
    });
    const clear = setTimeout(() => {
      setState((s) => (s.incoming === project ? { ...s, outgoing: null } : s));
    }, 320);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(clear);
    };
  }, [project]);

  const incomingVisible = state.outgoing == null || state.transitioning;

  return (
    <div className="projects__info-text">
      {state.outgoing && (
        <div className={`projects__info-layer projects__info-layer--out ${state.transitioning ? 'is-out' : ''}`}>
          <p className="projects__info-title">{titleFor(state.outgoing)}</p>
          <p className="projects__info-desc">{descriptionFor(state.outgoing)}</p>
        </div>
      )}
      <div className={`projects__info-layer ${incomingVisible ? 'is-visible' : ''}`}>
        <p className="projects__info-title">{titleFor(state.incoming)}</p>
        <p className="projects__info-desc">{descriptionFor(state.incoming)}</p>
      </div>
    </div>
  );
}

// Pure-transform styling per card, keyed off its position relative to the
// active index — CSS transitions (not a JS animation loop) carry the
// actual swap whenever `activeIndex` changes.
function stackCardStyle(offset) {
  if (offset === 0) {
    return { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1, zIndex: 3 };
  }
  if (offset === 1) {
    return { transform: 'translate(40px, 60px) rotate(8deg) scale(0.94)', opacity: 0.85, zIndex: 2 };
  }
  if (offset === -1) {
    return { transform: 'translate(0, -30px) rotate(-6deg) scale(1)', opacity: 0, zIndex: 1 };
  }
  if (offset > 1) {
    return { transform: 'translate(40px, 60px) rotate(8deg) scale(0.9)', opacity: 0, zIndex: 0 };
  }
  return { transform: 'translate(0, -30px) rotate(-6deg) scale(1)', opacity: 0, zIndex: 0 };
}

export default function Projects() {
  const pinRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStatic, setIsStatic] = useState(prefersStatic);

  useEffect(() => {
    function check() {
      setIsStatic(prefersStatic());
    }
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isStatic) return undefined;
    const pin = pinRef.current;
    if (!pin) return undefined;

    let ticking = false;

    // Same getBoundingClientRect-based, rAF-throttled progress math as the
    // Hero's day/night pin in App.jsx — 0 at the wrapper's top, 1 once the
    // wrapper's own extra height (beyond the sticky stage) is used up.
    function update() {
      ticking = false;
      const rect = pin.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      let p = scrollable > 0 ? -rect.top / scrollable : 0;
      p = Math.min(1, Math.max(0, p));
      const index = Math.min(projectsData.length - 1, Math.floor(p * projectsData.length));
      setActiveIndex(index);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <section className="section projects" id="projects">
        <div className="section__inner">
          <p className="eyebrow">{content.projects.eyebrow}</p>
          <h2 className="section-heading">{content.projects.headline}</h2>

          <div className="projects__static-list">
            {projectsData.map((project, i) => (
              <div className="projects__static-item" key={`${project.location}-${i}`}>
                <div
                  className="projects__static-media"
                  style={{ backgroundImage: `url(${project.image})` }}
                  aria-hidden="true"
                />
                <div className="projects__static-body">
                  <p className="projects__info-title">{titleFor(project)}</p>
                  <p className="projects__info-desc">{descriptionFor(project)}</p>
                  <div className="projects__card-stats">
                    <div><span>{project.size}</span><label>System size</label></div>
                    <div><span>{project.output}</span><label>Output</label></div>
                    <div><span>{project.savings}</span><label>Savings</label></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section projects" id="projects">
      <div className="projects__pin" ref={pinRef} style={{ height: `${projectsData.length * 100}vh` }}>
        <div className="projects__stage">
          <div className="section__inner projects__layout">
            <div className="projects__info">
              <p className="eyebrow">{content.projects.eyebrow}</p>
              <h2 className="section-heading">{content.projects.headline}</h2>
              <ActiveProjectText project={projectsData[activeIndex]} />
            </div>

            <div className="projects__stack">
              {projectsData.map((project, i) => (
                <div
                  className="projects__stack-card"
                  key={`${project.location}-${i}`}
                  style={{ backgroundImage: `url(${project.image})`, ...stackCardStyle(i - activeIndex) }}
                  aria-hidden={i !== activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
