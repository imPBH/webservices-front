import { motion } from "framer-motion";
import { ShieldCheck, BatteryCharging, Wifi } from "lucide-react";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";
import { STATS } from "../../data/site";
import { Stat } from "../ui/Stat";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-20 sm:pt-24">
      {/* Background gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-20%] h-[40rem] bg-[radial-gradient(60rem_60rem_at_top,theme(colors.cyan.500/.25),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-[-30%] h-[50rem] bg-[radial-gradient(55rem_55rem_at_bottom_right,theme(colors.sky.500/.2),transparent_70%)]" />
      </div>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge>
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Parking, Nutrition, Recettes & Alertes — temps réel
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Une ville plus fluide et plus saine, grâce à une plateforme
              unique.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300">
              Supervisez vos parkings et accompagnez vos habitants avec des
              services nutrition/recettes intégrés. Données fiables, décisions
              rapides, impact mesurable.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
              >
                Voir les fonctionnalités
              </a>
            </div>
            <div className="flex items-center gap-6 pt-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> RGPD by design
              </div>
              <div className="flex items-center gap-2">
                <BatteryCharging className="h-4 w-4" /> Sobriété énergétique
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" /> Edge & Cloud
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
              {/* Simple KPI grid */}
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((s) => (
                  <Stat key={s.label} value={s.value} label={s.label} />
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">
                KPIs simulés — connexion capteurs, API recettes & moteur
                nutritionnel
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
