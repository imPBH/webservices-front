import { useState } from "react";
import { Link, Navigate } from "react-router";
import { getGoogleRedirect, useRegister } from "../../api/auth/auth";
import { Container } from "../../components/ui/Container";

export default function RegisterPage() {
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate({
      username: name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  async function onGoogleLogin() {
    try {
      const { url } = await getGoogleRedirect();
      window.location.href = url;
    } catch (error) {
      console.error("Erreur lors de la redirection Google :", error);
    }
  }

  const pending = register.isPending || false;
  const error = register.error;

  const isFormComplete = !(
    name.length >= 4 &&
    password === passwordConfirmation &&
    password.length >= 8
  );

  if (register.isSuccess) {
    return <Navigate replace to="/login" state={{ registered: true }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Container className="py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-300">Nom</label>
              <input
                type="text"
                required
                value={name}
                minLength={1}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:ring focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:ring focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Mot de passe</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:ring focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">
                Confirmation du mot de passe
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:ring focus:ring-cyan-500/30"
              />
            </div>
            {error &&
              error.errors.map((errorMsg) => (
                <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300 mt-5 mb-5">
                  {errorMsg.message}
                </p>
              ))}
            {name && name.length < 4 && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300 mt-5 mb-5">
                The username field must have at least 4 characters
              </p>
            )}
            {password !== passwordConfirmation && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300 mt-5 mb-5">
                The password field and password_confirmation field must be the
                same
              </p>
            )}
            {password && password.length < 8 && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300 mt-5 mb-5">
                The password field must have at least 8 characters
              </p>
            )}
            <button
              type="submit"
              disabled={isFormComplete || pending}
              className="inline-flex cursor-pointer w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-500 disabled:opacity-60 mt-5 mb-5"
            >
              {pending ? "Création du compte…" : "S'inscrire"}
            </button>
            <p className="text-center">OU</p>
            <button
              type="button"
              onClick={onGoogleLogin}
              className="mt-5 mb-3 cursor-pointer w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
            >
              Continuer avec Google
            </button>
            <p className="text-center text-sm text-slate-400">
              Déjà inscrit ?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}
