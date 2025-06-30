import React from 'react';
import { MoreVertical, Play, Copy, Download, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Project } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onClone: (project: Project) => void;
  onExport: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onOpen, onClone, onExport, onDelete }: ProjectCardProps) {
  const [showActions, setShowActions] = React.useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
            <StatusBadge status={project.status} />
          </div>
          
          <div className="relative ml-4">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 min-w-[160px]">
                <button
                  onClick={() => { onClone(project); setShowActions(false); }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  <span>Clone</span>
                </button>
                <button
                  onClick={() => { onExport(project); setShowActions(false); }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => { onDelete(project); setShowActions(false); }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            {project.lastRun && (
              <div className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>Last run {formatDate(project.lastRun)}</span>
              </div>
            )}
          </div>
          
          {project.metrics && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-emerald-600">
                <span className="font-medium">{project.metrics.completedTasks}</span>
                <span className="text-gray-500">tasks completed</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{formatCurrency(project.metrics.totalCost)}</span>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => onOpen(project)}
          variant="outline"
          className="w-full"
          icon={Play}
        >
          Open Project
        </Button>
      </div>
    </div>
  );
}