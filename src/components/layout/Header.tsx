import { Building2, ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { NAV_LINKS } from "../../data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/60 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/20">
            <Building2 className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Ville Connectée
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="group inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-500"
        >
          Demander une démo
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>
      </Container>
    </header>
  );
}
