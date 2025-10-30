export type Feature = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  points: string[];
};

export type UseCase = {
  id: string;
  badge: string;
  title: string;
  desc: string;
};

export type FAQItem = {
  q: string;
  a: string;
};
