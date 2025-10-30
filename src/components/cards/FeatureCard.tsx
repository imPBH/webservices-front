import { motion } from "framer-motion";
import type { Feature } from "../../types";

export function FeatureCard({
  feature,
  delay = 0,
}: {
  feature: Feature;
  delay?: number;
}) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-cyan-400/90 to-sky-500/90 p-2 text-slate-950 shadow-cyan-500/30">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{feature.title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-300">{feature.desc}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-300/90">
        {feature.points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
