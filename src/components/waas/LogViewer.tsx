import React from 'react';
import { Mail } from '../../types';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';

interface LogViewerProps {
  logs: Mail[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#101518] mb-2">No Logs Yet</h3>
          <p className="text-[#5c748a]">Agent communications will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="bg-white border border-[#d4dce2] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0c7ff2]" />
              <span className="text-[#101518] font-medium">{log.subject}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#5c748a]">
              <Clock className="w-3 h-3" />
              <span>{formatTime(log.timestamp)}</span>
            </div>
          </div>
          <div className="text-sm text-[#5c748a] mb-2">
            <span className="text-[#101518]">{log.from}</span> <ArrowRight className="w-3 h-3 inline mx-1" /> <span className="text-[#101518]">{log.to}</span>
          </div>
          <div className="text-sm text-[#101518] bg-[#f8fafc] p-3 rounded">
            {typeof log.body === 'string' ? log.body : JSON.stringify(log.body, null, 2)}
          </div>
        </div>
      ))}
    </div>
  );
}