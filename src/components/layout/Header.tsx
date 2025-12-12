import { Building2, User, LogOut, Menu, X } from "lucide-react";
import { Container } from "../ui/Container";
import { NAV_LINKS } from "../../data/site";
import { useStore } from "../../store/store";
import { useLogout } from "../../api/auth/auth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router";

export function Header() {
  const loggedIn = useStore((s) => s.isLoggedIn);
  const username = useStore((s) => s.username);
  const logout = useLogout();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/60 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/20">
            <Building2 className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Ville Connectée
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {l.label}
            </NavLink>
          ))}

          {!loggedIn ? (
            <>
              <NavLink
                to="/login"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Se connecter
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 text-sm bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Créer un compte
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/parking"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Parking
              </NavLink>
              <NavLink
                to="/alerts"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Alertes
              </NavLink>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500">
                    <User className="h-4 w-4 text-slate-950" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur shadow-xl shadow-black/20 z-50"
                      >
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-slate-200">
                            {username}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Compte personnel
                          </p>
                        </div>
                        <div className="p-1">
                          <NavLink
                            to="/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Mon profil
                          </NavLink>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur"
          >
            <Container className="py-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.href}
                  to={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {l.label}
                </NavLink>
              ))}

              {!loggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Se connecter
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-center"
                  >
                    Créer un compte
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 border-t border-white/10 mt-2 pt-4">
                    <p className="text-sm font-semibold text-slate-200">
                      {username}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Compte personnel
                    </p>
                  </div>
                  <NavLink
                    to="/parking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Parking
                  </NavLink>
                  <NavLink
                    to="/alerts"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Alertes
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
