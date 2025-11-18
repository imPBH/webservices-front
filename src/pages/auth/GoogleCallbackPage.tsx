import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Container } from "../../components/ui/Container";
import { useStore } from "../../store/store";
import type { LoginResponse } from "../../api/auth/auth.types";

const AUTH_SERVICE_URL: string = import.meta.env.VITE_AUTH_SERVICE_URL;

export default function GoogleCallbackPage() {
  const location = useLocation();
  const search = location.search;

  const setLoggedIn = useStore((state) => state.setLoggedIn);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const setUsername = useStore((state) => state.setUsername);
  const setEmail = useStore((state) => state.setEmail);
  const setRole = useStore((state) => state.setRole);

  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authWithGoogle() {
      try {
        const url = new URL("/auth/google/callback" + search, AUTH_SERVICE_URL);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          let message = "Erreur lors de la connexion avec Google.";
          try {
            const data = (await res.json()) as { message?: string };
            if (data?.message) {
              message = data.message;
            }
          } catch {
            console.error("Error while logging in with Google");
          }
          setError(message);
          return;
        }

        const data = (await res.json()) as LoginResponse;

        setAccessToken(data.token.accessToken);
        setRefreshToken(data.token.refreshToken);
        setUsername(data.token.user.username);
        setEmail(data.token.user.email);
        setRole(data.token.user.role);
        setLoggedIn(true);

        setIsDone(true);
      } catch (err) {
        console.error(err);
        setError("Erreur réseau lors de la connexion avec Google.");
      }
    }

    authWithGoogle();
  }, [
    search,
    setAccessToken,
    setEmail,
    setLoggedIn,
    setRefreshToken,
    setRole,
    setUsername,
  ]);

  if (isDone && !error) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <Container className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-slate-900/60 p-8 shadow-lg shadow-slate-900/50">
          <h1 className="mb-4 text-center text-xl font-semibold text-slate-100">
            Connexion avec Google
          </h1>
          {!error ? (
            <p className="text-center text-sm text-slate-300">
              Connexion en cours, merci de patienter…
            </p>
          ) : (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
