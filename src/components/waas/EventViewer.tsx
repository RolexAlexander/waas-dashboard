import React from 'react';
import { Event } from '../../types';
import { Settings, Clock } from 'lucide-react';

interface EventViewerProps {
  events: Event[];
}

export function EventViewer({ events }: EventViewerProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#101518] mb-2">No Events Yet</h3>
          <p className="text-[#5c748a]">System events will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={index} className="bg-white border border-[#d4dce2] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#0c7ff2]" />
              <span className="text-[#101518] font-medium">{event.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#5c748a]">
              <Clock className="w-3 h-3" />
              <span>{formatTime(event.timestamp)}</span>
            </div>
          </div>
          
          {event.data && (
            <div className="bg-[#f8fafc] rounded p-3">
              <pre className="text-[#101518] text-sm overflow-x-auto">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}