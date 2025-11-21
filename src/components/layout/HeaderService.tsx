import { Building2 } from "lucide-react";
import { Container } from "../ui/Container";
import { useStore } from "../../store/store";
import { useLogout } from "../../api/auth/auth";

export function HeaderService() {
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
            Titre du service ici
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {!loggedIn ? (
            <>
              <p>Page non accessible "gestion des erreurs à ajouter ici"</p>
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
