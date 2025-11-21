import type { ReactNode } from 'react';

interface ServiceLayoutProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function ServiceLayout({ title, description, actions, children }: ServiceLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-600">{description}</p>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
