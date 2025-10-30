import { Container } from "../ui/Container";

export function CTA() {
  return (
    <section id="cta" className="pb-20 pt-8">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 p-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">
                Prêt à connecter votre ville ?
              </h3>
              <p className="mt-2 text-slate-300">
                Planifiez une démonstration et découvrez comment déployer en
                quelques semaines.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-500"
                >
                  Réserver une démo
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
                >
                  Parler à un expert
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold">3</div>
                <div className="mt-1 text-xs text-slate-300">Services clés</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold">15 jours</div>
                <div className="mt-1 text-xs text-slate-300">POC moyen</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold">24/7</div>
                <div className="mt-1 text-xs text-slate-300">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
