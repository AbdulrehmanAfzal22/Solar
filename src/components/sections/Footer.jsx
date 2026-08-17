import useReveal from '../../hooks/useReveal';
import './Footer.css';

const columns = [
  {
    title: 'Services',
    links: ['Residential Solar', 'Commercial & Industrial', 'Battery Storage', 'Financing'],
  },
  {
    title: 'Company',
    links: ['About', 'Projects', 'Careers', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['How It Works', 'Blog', 'FAQ', 'Get a Quote'],
  },
];

export default function Footer() {
  const [ref, isIn] = useReveal(0.1);

  return (
    <footer className={`footer reveal ${isIn ? 'is-in' : ''}`} ref={ref}>
      <div className="section__inner footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo-mark" aria-hidden="true" />
            <span className="footer__logo-name">Solara</span>
          </div>

          <div className="footer__columns">
            {columns.map((col) => (
              <div className="footer__column" key={col.title}>
                <p className="footer__column-title">{col.title}</p>
                {col.links.map((link) => (
                  <a href="#" className="footer__link" key={link}>{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} Solara Energy. All rights reserved.</p>
          <div className="footer__socials">
            {['X', 'IG', 'IN'].map((s) => (
              <a href="#" className="footer__social" key={s}>{s}</a>
            ))}
          </div>
          <div className="footer__legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Warranty</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
