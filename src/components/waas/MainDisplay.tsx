import React, { useState } from 'react';
import { Mail, Task, Conversation, EnvironmentState, Event } from '../../types';
import { TaskBoard } from './TaskBoard';
import { LogViewer } from './LogViewer';
import { ConversationViewer } from './ConversationViewer';
import { EnvironmentViewer } from './EnvironmentViewer';
import { EventViewer } from './EventViewer';
import { List, MessageSquare, Users, Database, Settings } from 'lucide-react';

interface MainDisplayProps {
  tasks: Task[];
  logs: Mail[];
  conversations: Conversation[];
  environments: Record<string, EnvironmentState>;
  events: Event[];
}

export function MainDisplay({ tasks, logs, conversations, environments, events }: MainDisplayProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'logs' | 'conversations' | 'environments' | 'events'>('tasks');

  const tabs = [
    { id: 'tasks' as const, label: 'Tasks', count: tasks.length, icon: List },
    { id: 'logs' as const, label: 'Logs', count: logs.length, icon: MessageSquare },
    { id: 'conversations' as const, label: 'Conversations', count: conversations.length, icon: Users },
    { id: 'environments' as const, label: 'Environments', count: Object.keys(environments).length, icon: Database },
    { id: 'events' as const, label: 'Events', count: events.length, icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-[#d4dce2] bg-[#f8fafc]">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#0c7ff2] text-[#0c7ff2]'
                    : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'tasks' && <TaskBoard tasks={tasks} />}
        {activeTab === 'logs' && <LogViewer logs={logs} />}
        {activeTab === 'conversations' && <ConversationViewer conversations={conversations} />}
        {activeTab === 'environments' && <EnvironmentViewer environments={environments} />}
        {activeTab === 'events' && <EventViewer events={events} />}
      </div>
    </div>
  );
}