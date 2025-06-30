import React from 'react';
import { Conversation } from '../../types';
import { MessageSquare, Users, Clock } from 'lucide-react';

interface ConversationViewerProps {
  conversations: Conversation[];
}

export function ConversationViewer({ conversations }: ConversationViewerProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#101518] mb-2">No Conversations Yet</h3>
          <p className="text-[#5c748a]">Agent conversations will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="bg-white border border-[#d4dce2] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0c7ff2]" />
              <h3 className="text-[#101518] font-medium">{conversation.topic}</h3>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              conversation.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {conversation.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-[#5c748a] mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{conversation.participants.join(', ')}</span>
            </div>
            <div>Initiated by: {conversation.initiator}</div>
          </div>

          {conversation.history.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs text-[#5c748a] uppercase tracking-wide">Messages</h4>
              <div className="bg-[#f8fafc] rounded p-3 max-h-40 overflow-y-auto">
                {conversation.history.map((message, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#0c7ff2] font-medium text-sm">{message.agentName}</span>
                      <span className="text-[#5c748a] text-xs">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className="text-[#101518] text-sm pl-2">{message.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}