import { Building2 } from "lucide-react";
import { Container } from "../ui/Container";
import { NavLink } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500">
            <Building2 className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-sm text-slate-400">
            © {new Date().getFullYear()} Ville Connectée
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <NavLink to="#" className="hover:text-white">
            Sécurité
          </NavLink>
          <NavLink to="#" className="hover:text-white">
            Confidentialité
          </NavLink>
          <NavLink to="#" className="hover:text-white">
            Contact
          </NavLink>
        </div>
      </Container>
    </footer>
  );
}
