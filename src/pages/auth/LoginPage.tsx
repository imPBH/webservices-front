import { useState } from "react";
import { Link, Navigate } from "react-router";
import { useLogin } from "../../api/auth/auth";
import { Container } from "../../components/ui/Container";

export default function LoginPage() {
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({
      email,
      password,
    });
  }

  if (login.isSuccess) {
    return <Navigate replace to="/" />;
  }

  const pending = login.isPending;
  const error = login?.error;
  console.log(error);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Container className="py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:ring focus:ring-cyan-500/30"
              />
            </div>
            {error &&
              error.errors.map((errorMsg) => (
                <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-300 mt-5 mb-5">
                  {errorMsg.message}
                </p>
              ))}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-500 disabled:opacity-60 mt-5 mb-5"
            >
              {pending ? "Connexion…" : "Se connecter"}
            </button>
            <p className="text-center text-sm text-slate-400">
              Pas de compte ?{" "}
              <Link to="/register" className="text-cyan-400 hover:underline">
                Créer un compte
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}
