import React from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { ProjectStatus } from '../types';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  'in-progress': {
    icon: Clock,
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  draft: {
    icon: FileText,
    label: 'Draft',
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium border rounded-full',
      config.className,
      className
    )}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}