import React, { useState } from 'react';
import { MessageSquare, Send, X, HelpCircle } from 'lucide-react';
import { useWaaSStore } from '../../store/waasStore';

export function HumanInputPanel() {
  const { humanInputQueue, provideHumanInput } = useWaaSStore();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isMinimized, setIsMinimized] = useState(false);

  const handleResponseChange = (requestId: string, response: string) => {
    setResponses(prev => ({ ...prev, [requestId]: response }));
  };

  const handleSubmitResponse = (requestId: string) => {
    const response = responses[requestId];
    if (response?.trim()) {
      provideHumanInput(requestId, response);
      setResponses(prev => {
        const newResponses = { ...prev };
        delete newResponses[requestId];
        return newResponses;
      });
    }
  };

  if (humanInputQueue.length === 0) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-[#0c7ff2] hover:bg-[#0a6fd1] text-white font-medium py-3 px-4 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="bg-white text-[#0c7ff2] px-2 py-1 rounded text-sm font-semibold">
            {humanInputQueue.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-[#d4dce2] rounded-lg shadow-xl overflow-hidden z-30">
      <div className="bg-[#f8fafc] px-4 py-3 border-b border-[#d4dce2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0c7ff2]" />
            <h3 className="text-[#101518] font-medium">Human Input Required</h3>
            <span className="bg-[#dc2626] text-white text-xs px-2 py-1 rounded-full">
              {humanInputQueue.length}
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[#5c748a] hover:text-[#101518] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {humanInputQueue.map((request) => (
          <div key={request.id} className="p-4 border-b border-[#d4dce2] last:border-b-0">
            <div className="mb-3">
              <div className="text-sm text-[#5c748a] mb-1">From: {request.agentName}</div>
              <div className="text-[#101518] font-medium">{request.question}</div>
            </div>

            <div className="space-y-2">
              <textarea
                value={responses[request.id] || ''}
                onChange={(e) => handleResponseChange(request.id, e.target.value)}
                placeholder="Enter your response..."
                className="w-full p-2 bg-white text-[#101518] border border-[#d4dce2] rounded focus:border-[#0c7ff2] focus:outline-none text-sm resize-none"
                rows={3}
              />
              <button
                onClick={() => handleSubmitResponse(request.id)}
                disabled={!responses[request.id]?.trim()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0c7ff2] hover:bg-[#0a6fd1] disabled:bg-[#d4dce2] disabled:cursor-not-allowed text-white rounded text-sm transition-colors font-medium"
              >
                <Send className="w-3 h-3" />
                Send Response
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}