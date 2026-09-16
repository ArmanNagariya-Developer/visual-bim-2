import { company } from '../data/company';
import { services } from '../data/services';
import Icon from './Icon';
import Corners from './Corners';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line/10 bg-black-950">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint-fine absolute inset-0 opacity-50" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-5">
            <button
              type="button"
              onClick={() => window.scrollToSection?.('home')}
              className="flex items-center gap-3"
            >
              <span className="relative flex h-10 w-10 items-center justify-center border border-sky/25 text-gold">
                <Corners size="w-2 h-2" />
                <svg
                  viewBox="0 0 32 32"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M16 3 27 9.5v13L16 29 5 22.5v-13z" />
                  <path d="M5 9.5 16 16l11-6.5M16 16v13" opacity="0.65" />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[1rem] font-semibold tracking-[0.2em] text-warm">
                  VISUAL BIM
                </span>
                <span className="label mt-1.5 text-[0.5rem] text-concrete-light" style={{ letterSpacing: '0.28em' }}>
                  DIGITAL CONSTRUCTION
                </span>
              </span>
            </button>

            <p className="mt-7 max-w-sm text-sm leading-relaxed text-concrete-light">
              “{company.tagline}”
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-concrete/80">
              {company.positioning} — Scan to BIM, Revit modeling, CAD conversion
              and as-built documentation for architecture, structure, and MEP.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={`mailto:${company.email.value}`}
                className="flex h-10 w-10 items-center justify-center border border-sky/20 text-concrete-light transition-all duration-300 hover:border-sky hover:text-gold"
                aria-label="Email Visual BIM"
              >
                <Icon name="mail" size={17} />
              </a>
              <a
                href={company.linkedin.value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-sky/20 text-concrete-light transition-all duration-300 hover:border-sky hover:text-gold"
                aria-label="Visual BIM on LinkedIn"
              >
                <Icon name="linkedin" size={17} />
              </a>
            </div>
          </div>

          {/* nav */}
          <div className="lg:col-span-3">
            <h3 className="label text-concrete-light/50">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {company.nav.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => window.scrollToSection?.(item.id)}
                    className="group flex items-center gap-2.5 text-sm text-concrete-light transition-colors duration-300 hover:text-gold"
                  >
                    <span className="h-px w-4 bg-concrete/40 transition-all duration-300 group-hover:w-7 group-hover:bg-gold" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* services */}
          <div className="lg:col-span-4">
            <h3 className="label text-concrete-light/50">Services</h3>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => window.scrollToSection?.('services')}
                    className="group flex items-center gap-2.5 text-sm text-concrete-light transition-colors duration-300 hover:text-gold"
                  >
                    <span className="label text-[0.5rem] text-concrete/60">{s.num}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-sky/25 to-transparent" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-concrete/70">
            © {year} Visual BIM. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="label text-[0.55rem] text-concrete/60">REVIT · IFC · DWG · NWD</span>
            <span className="flex items-center gap-2 label text-[0.55rem] text-concrete/60">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-gold" />
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
