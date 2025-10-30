import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { USE_CASES } from "../../data/site";

export function UseCases() {
  return (
    <section id="cases" className="py-16">
      <Container>
        <div className="grid gap-4 lg:grid-cols-3">
          {USE_CASES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6"
            >
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {c.badge}
              </div>
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{c.desc}</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-cyan-400">
                Découvrir
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
