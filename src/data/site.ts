import { BellRing, Car, Salad, UtensilsCrossed } from "lucide-react";
import type { FAQItem, Feature, UseCase } from "../types";

export const NAV_LINKS = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#cases", label: "Cas d'usage" },
  { href: "#faq", label: "FAQ" },
] as const;

export const FEATURES: Feature[] = [
  {
    id: "parking",
    icon: Car,
    title: "Gestion de parking",
    desc: "Supervisez en temps réel l'occupation, tarifez dynamiquement et réduisez la congestion.",
    points: [
      "Capteurs places & comptage entrées/sorties",
      "Signalétique temps réel & guidage",
      "Tarification dynamique & rapports",
    ],
  },
  {
    id: "nutrition",
    icon: Salad,
    title: "Service nutrition",
    desc: "Conseils personnalisés basés sur les apports et les préférences locales.",
    points: [
      "Profils nutritionnels & allergies",
      "Plans de repas équilibrés",
      "Suivi des objectifs",
    ],
  },
  {
    id: "recipes",
    icon: UtensilsCrossed,
    title: "Recettes",
    desc: "Catalogue de recettes saines, filtrables par budget, saison et contraintes.",
    points: [
      "Filtres (saison, budget, CKD-friendly, etc.)",
      "Fiches détaillées & valeurs nutritionnelles",
      "Liste de courses automatique",
    ],
  },
  {
    id: "alerts",
    icon: BellRing,
    title: "Alertes citoyennes",
    desc: "Remontée d'incidents par les habitants et dispatch intelligent des équipes.",
    points: [
      "Signalements géolocalisés (voirie, propreté, éclairage)",
      "Priorisation automatique & SLA",
      "Suivi de résolution et feedback citoyen",
    ],
  },
];

export const USE_CASES: UseCase[] = [
  {
    id: "parking-occupancy",
    badge: "Parking",
    title: "Occupation en temps réel",
    desc: "Réduction du temps de recherche d'une place de 20% en centre-ville.",
  },
  {
    id: "meal-plans",
    badge: "Nutrition",
    title: "Plans de repas urbains",
    desc: "Des menus adaptés aux rythmes de vie et aux saisons locales.",
  },
  {
    id: "smart-recipes",
    badge: "Recettes",
    title: "Suggestions intelligentes",
    desc: "Recommandations selon le frigo, le budget et les objectifs santé.",
  },
  {
    id: "citizen-alerts",
    badge: "Alertes",
    title: "Signalements citoyens",
    desc: "Réception, tri et affectation des incidents avec ETA et communication.",
  },
];
export const FAQ: FAQItem[] = [
  {
    q: "Comment intégrez-vous les capteurs parking ?",
    a: "Support MQTT/HTTP, connecteurs standards (LoRaWAN/NB-IoT) et API personnalisées. Déploiement progressif par parking.",
  },
  {
    q: "Où sont hébergées les données ?",
    a: "Au choix : cloud souverain ou on‑premise. Données chiffrées, RGPD by design.",
  },
  {
    q: "Peut-on personnaliser les règles nutritionnelles ?",
    a: "Oui, via un moteur de règles (allergies, régimes thérapeutiques, budgets).",
  },
];

export const STATS = [
  { value: "1,2k", label: "capteurs parking" },
  { value: "-18%", label: "congestion" },
  { value: "98,9%", label: "uptime" },
];
