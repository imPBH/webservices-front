import { Building2 } from "lucide-react";
import { Container } from "../ui/Container";
import { NAV_LINKS } from "../../data/site";
import { useStore } from "../../store/store";
import { useLogout } from "../../api/auth/auth";

export function Header() {
  const loggedIn = useStore((s) => s.isLoggedIn);
  const logout = useLogout();

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
          {!loggedIn ? (
            <>
              <a
                href="/login"
                className="text-sm text-slate-300 hover:text-white"
              >
                Se connecter
              </a>
              <a
                href="/register"
                className="text-sm text-slate-300 hover:text-white"
              >
                Créer un compte
              </a>
            </>
          ) : (
            <button
              onClick={() => logout.mutate()}
              className="text-sm text-slate-300 hover:text-white"
            >
              Se déconnecter
            </button>
          )}
        </nav>
      </Container>
    </header>
  );
}
