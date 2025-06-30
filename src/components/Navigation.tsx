import React from 'react';
import { LayoutDashboard, Building2, Play, BarChart3 } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Projects', icon: LayoutDashboard },
  { id: 'build', label: 'Build', icon: Building2 },
  { id: 'simulate', label: 'Simulate', icon: Play },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">WaaS 2.0</h1>
            <p className="text-xs text-gray-500">Workforce as a Service</p>
          </div>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}