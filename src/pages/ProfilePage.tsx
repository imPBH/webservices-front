import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Container } from "../components/ui/Container";
import { useStore } from "../store/store";
import { useUpdateUser } from "../api/auth/auth";
import type { ApiError, UpdateData } from "../api/auth/auth.types";

export default function ProfilePage() {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const currentUsername = useStore((s) => s.username);
  const currentEmail = useStore((s) => s.email);

  const updateUser = useUpdateUser();

  const [username, setUsername] = useState(currentUsername);
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    setUsername(currentUsername);
    setEmail(currentEmail);
  }, [currentUsername, currentEmail]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const pending = updateUser.isPending;
  const error = updateUser.error as ApiError | null;
  const success = updateUser.isSuccess;

  const hasPasswordMismatch =
    password !== "" && password !== passwordConfirmation;

  const isFormUnchanged =
    username === currentUsername &&
    email === currentEmail &&
    password === "" &&
    passwordConfirmation === "";

  const isSubmitDisabled = pending || hasPasswordMismatch || isFormUnchanged;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: UpdateData = {};

    if (username && username !== currentUsername) {
      payload.username = username;
    }

    if (email && email !== currentEmail) {
      payload.email = email;
    }

    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    updateUser.mutate(payload);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="py-12">
        <Container className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-2xl font-bold">Mon profil</h1>
            <p className="mt-1 text-sm text-slate-400">
              Modifiez vos informations personnelles et votre mot de passe.
            </p>

            {success && (
              <p className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-300">
                Profil mis à jour avec succès.
              </p>
            )}

            {error &&
              error.errors?.map((errorMsg, idx) => (
                <p
                  key={idx}
                  className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300"
                >
                  {errorMsg.message}
                </p>
              ))}

            {hasPasswordMismatch && (
              <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300">
                Les mots de passe ne correspondent pas.
              </p>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-300">
                  Nom d&apos;utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring-2"
                />
              </div>

              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Changer de mot de passe
                </p>
                <p className="mb-4 text-xs text-slate-500">
                  Laissez vide si vous ne souhaitez pas le modifier.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-300">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">
                      Confirmation du mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring-2"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="mt-4 w-full rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-cyan-400"
              >
                {pending ? "Mise à jour…" : "Enregistrer les modifications"}
              </button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
