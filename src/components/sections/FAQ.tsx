import { FAQ } from "../../data/site";
import { Container } from "../ui/Container";

export function FAQSection() {
  return (
    <section id="faq" className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold">
            Questions fréquentes
          </h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {FAQ.map((f, i) => (
              <details key={i} className="group p-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-left text-base font-semibold">
                  {f.q}
                  <span className="ml-4 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
                    {i + 1}
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
