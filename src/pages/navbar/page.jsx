// If you're on Next.js App Router, add this as the very first line: 'use client'

import { useEffect, useState } from 'react';
import './style.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar${isScrolled ? ' is-scrolled' : ''}${isOpen ? ' is-open' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-mark" aria-hidden="true"></span>
          Solara
        </a>

        <nav className="navbar__links" id="navLinks">
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#savings" onClick={closeMenu}>Savings</a>
          <a href="#reviews" onClick={closeMenu}>Reviews</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
        </nav>

        <div className="navbar__actions">
          <a href="#quote" className="navbar__cta">Get a free quote</a>
          <button
            className="navbar__toggle"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="navLinks"
            onClick={() => setIsOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}