import { FEATURES } from "../../data/site";
import { FeatureCard } from "../cards/FeatureCard";
import { Container } from "../ui/Container";

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quatre services, une seule expérience
          </h2>
          <p className="mt-3 text-slate-300">
            Parking, nutrition, recettes et alertes citoyennes : une plateforme
            modulaire, simple à déployer.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} delay={i * 0.05} />
          ))}
        </div>
      </Container>
    </section>
  );
}
