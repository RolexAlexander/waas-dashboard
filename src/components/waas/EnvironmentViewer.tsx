import React from 'react';
import { EnvironmentState } from '../../types';
import { Database } from 'lucide-react';

interface EnvironmentViewerProps {
  environments: Record<string, EnvironmentState>;
}

export function EnvironmentViewer({ environments }: EnvironmentViewerProps) {
  const envEntries = Object.entries(environments);

  if (envEntries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#101518] mb-2">No Environments</h3>
          <p className="text-[#5c748a]">Environment states will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {envEntries.map(([envId, state]) => (
        <div key={envId} className="bg-white border border-[#d4dce2] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[#0c7ff2]" />
            <h3 className="text-[#101518] font-medium">{envId}</h3>
          </div>
          
          <div className="bg-[#f8fafc] rounded p-3">
            <pre className="text-[#101518] text-sm overflow-x-auto">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}