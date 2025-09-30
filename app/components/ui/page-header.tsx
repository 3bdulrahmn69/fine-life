'use client';

import { FiPlus } from 'react-icons/fi';
import { ReactNode } from 'react';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  customActions?: ReactNode;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  actionButton,
  customActions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-accent/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-foreground">
            {title}
          </h1>
          <p className="text-primary-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {customActions ||
        (actionButton && (
          <button
            onClick={actionButton.onClick}
            className="inline-flex items-center px-4 py-2 bg-primary-accent text-primary-accent-foreground rounded-lg hover:bg-primary-accent/90 transition-colors font-medium"
          >
            {actionButton.icon && (
              <span className="mr-2">{actionButton.icon}</span>
            )}
            {actionButton.label}
          </button>
        ))}
    </div>
  );
}
