import React, { useState } from 'react';
import { Mail, Task, Conversation, EnvironmentState, Event } from '../../types';
import WaaSTaskCard from './WaaSTaskCard';
import { LogViewer } from './LogViewer';
import { ConversationViewer } from './ConversationViewer';
import { EnvironmentViewer } from './EnvironmentViewer';
import { EventViewer } from './EventViewer';
import { List, MessageSquare, Users, Briefcase, Settings } from 'lucide-react';

interface MainDisplayProps {
  tasks: Task[];
  logs: Mail[];
  conversations: Conversation[];
  environments: Record<string, EnvironmentState>;
  events: Event[];
}

type View = 'tasks' | 'environment' | 'conversations' | 'logs' | 'environment_log';

const WaaSMainDisplay: React.FC<MainDisplayProps> = ({ tasks, logs, conversations, environments, events }) => {
  const [view, setView] = useState<View>('tasks');

  const getStatusColor = (viewName: View) => {
    return view === viewName ? 'border-blue-400 text-blue-400' : 'border-transparent text-slate-400 hover:text-white';
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex p-2 border-b border-slate-700 bg-slate-800/50">
        <button 
            onClick={() => setView('tasks')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${getStatusColor('tasks')}`}
        >
            <List className="w-5 h-5" />
            Task Board
        </button>
        <button 
            onClick={() => setView('environment')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${getStatusColor('environment')}`}
        >
            <Briefcase className="w-5 h-5" />
            Environment
        </button>
        <button 
            onClick={() => setView('conversations')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${getStatusColor('conversations')}`}
        >
            <Users className="w-5 h-5" />
            Conversations
            {conversations.filter(c => c.status === 'ACTIVE').length > 0 && 
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500 text-white">
                {conversations.filter(c => c.status === 'ACTIVE').length}
              </span>
            }
        </button>
        <button 
            onClick={() => setView('logs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${getStatusColor('logs')}`}
        >
            <MessageSquare className="w-5 h-5" />
            Communication Log
        </button>
        <button 
            onClick={() => setView('environment_log')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${getStatusColor('environment_log')}`}
        >
            <Settings className="w-5 h-5" />
            Environment Log
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
        {view === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => <WaaSTaskCard key={task.id} task={task} />)}
          </div>
        )}
        {view === 'environment' && <EnvironmentViewer environments={environments} />}
        {view === 'conversations' && <ConversationViewer conversations={conversations} />}
        {view === 'logs' && <LogViewer logs={logs} />}
        {view === 'environment_log' && <EventViewer events={events} />}
      </div>
    </div>
  );
};

export default WaaSMainDisplay;