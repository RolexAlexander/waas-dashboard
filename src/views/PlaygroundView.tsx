import React, { useState } from 'react';
import { useWaaSStore } from '../store/waasStore';
import { demos } from '../demos';
import { Play, Square, Trash2, Save, Download, Upload, Settings, Users, Database, Code, MessageSquare } from 'lucide-react';
import { TaskStatus } from '../types';

interface PlaygroundSession {
  id: string;
  name: string;
  organizationName: string;
  agentName: string;
  workflowName?: string;
  goal: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  results?: any;
  tasks: any[];
  logs: any[];
}

export function PlaygroundView() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState<PlaygroundSession[]>(() => {
    const saved = localStorage.getItem('playgroundSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSession, setCurrentSession] = useState<PlaygroundSession | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const [newSession, setNewSession] = useState({
    name: '',
    organizationName: '',
    agentName: '',
    workflowName: '',
    goal: ''
  });

  const { 
    startSimulation, 
    resetSimulation, 
    isSimulating, 
    simulationCompleted,
    tasks,
    logs,
    conversations,
    environments,
    events,
    setOrgConfig,
    orgConfig
  } = useWaaSStore();

  // Get available organizations and agents
  const organizations = Object.values(demos);
  const getAgentsForOrg = (orgName: string) => {
    const org = organizations.find(o => o.name === orgName);
    if (!org) return [];
    
    const agents = [];
    const extractAgents = (agentConfig: any) => {
      agents.push(agentConfig);
      if (agentConfig.subordinates) {
        agentConfig.subordinates.forEach(extractAgents);
      }
    };
    
    if (org.masterAgent) {
      extractAgents(org.masterAgent);
    }
    
    return agents;
  };

  const saveSessions = (newSessions: PlaygroundSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('playgroundSessions', JSON.stringify(newSessions));
  };

  const createSession = () => {
    if (!newSession.name || !newSession.organizationName || !newSession.goal) return;

    const session: PlaygroundSession = {
      id: Date.now().toString(),
      name: newSession.name,
      organizationName: newSession.organizationName,
      agentName: newSession.agentName,
      workflowName: newSession.workflowName,
      goal: newSession.goal,
      status: 'idle',
      createdAt: new Date(),
      tasks: [],
      logs: []
    };

    saveSessions([...sessions, session]);
    setShowCreateModal(false);
    setNewSession({ name: '', organizationName: '', agentName: '', workflowName: '', goal: '' });
  };

  const runSession = async (session: PlaygroundSession) => {
    // Load the organization config
    const org = organizations.find(o => o.name === session.organizationName);
    if (!org) return;

    setOrgConfig(org);
    setCurrentSession(session);
    
    // Update session status
    const updatedSessions = sessions.map(s => 
      s.id === session.id ? { ...s, status: 'running' as const } : s
    );
    saveSessions(updatedSessions);

    // Start simulation
    await startSimulation(session.goal);
  };

  const stopSession = () => {
    if (currentSession) {
      const updatedSessions = sessions.map(s => 
        s.id === currentSession.id 
          ? { 
              ...s, 
              status: simulationCompleted ? 'completed' : 'failed',
              results: { tasks, logs, conversations, environments, events },
              tasks,
              logs
            } 
          : s
      );
      saveSessions(updatedSessions);
    }
    
    resetSimulation();
    setCurrentSession(null);
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      saveSessions(updatedSessions);
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        resetSimulation();
      }
    }
  };

  const exportSession = (session: PlaygroundSession) => {
    const exportData = {
      ...session,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground-session-${session.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sessionData = JSON.parse(e.target?.result as string);
        const importedSession: PlaygroundSession = {
          ...sessionData,
          id: Date.now().toString(), // Generate new ID
          createdAt: new Date(),
          status: 'idle'
        };
        
        saveSessions([...sessions, importedSession]);
        setShowImportModal(false);
      } catch (error) {
        alert('Invalid session file format');
      }
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Playground</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Experiment with agents and workflows in isolated environments. Test scenarios, debug issues, and prototype new configurations safely.
            </p>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Session
              <input
                type="file"
                accept=".json"
                onChange={importSession}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              New Session
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d4dce2] px-4">
          {[
            { id: 'sessions', label: 'Sessions', icon: Play },
            { id: 'live', label: 'Live Session', icon: Settings },
            { id: 'results', label: 'Results', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0c7ff2] text-[#0c7ff2]'
                    : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'live' && currentSession && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-lg border border-[#d4dce2] p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-[#101518] font-semibold mb-1">{session.name}</h3>
                          <p className="text-[#5c748a] text-sm mb-2">{session.organizationName}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => exportSession(session)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Export session"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Delete session"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="text-[#5c748a]">Agent:</span>
                          <span className="text-[#101518] ml-1">{session.agentName || 'All agents'}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#5c748a]">Created:</span>
                          <span className="text-[#101518] ml-1">{formatDate(session.createdAt)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#5c748a]">Goal:</span>
                          <p className="text-[#101518] mt-1 line-clamp-2">{session.goal}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => runSession(session)}
                          disabled={isSimulating || session.status === 'running'}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          Run
                        </button>
                        {session.results && (
                          <button
                            onClick={() => {
                              setCurrentSession(session);
                              setActiveTab('results');
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No playground sessions</h3>
                  <p className="text-gray-500 mb-4">Create your first session to start experimenting</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Create Session
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-6">
              {currentSession ? (
                <>
                  <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-[#101518] text-lg font-semibold">{currentSession.name}</h3>
                        <p className="text-[#5c748a]">{currentSession.organizationName}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          isSimulating ? 'bg-blue-100 text-blue-800' : 
                          simulationCompleted ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {isSimulating ? 'Running' : simulationCompleted ? 'Completed' : 'Idle'}
                        </span>
                        <button
                          onClick={stopSession}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Square className="w-4 h-4" />
                          Stop
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                        <div className="text-[#5c748a] text-sm">Total Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
                        </div>
                        <div className="text-[#5c748a] text-sm">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{logs.length}</div>
                        <div className="text-[#5c748a] text-sm">Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{conversations.length}</div>
                        <div className="text-[#5c748a] text-sm">Conversations</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Task Feed */}
                  <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                    <h4 className="text-[#101518] font-semibold mb-4">Live Task Feed</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {tasks.slice(-5).reverse().map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-[#101518] font-medium text-sm line-clamp-1">{task.goal}</p>
                            <p className="text-[#5c748a] text-xs">{task.assignee}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status.toLowerCase())}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <p className="text-[#5c748a] text-center py-4">No tasks yet</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active session</h3>
                  <p className="text-gray-500">Run a session to see live monitoring here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {currentSession?.results ? (
                <>
                  <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                    <h3 className="text-[#101518] text-lg font-semibold mb-4">Session Results: {currentSession.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentSession.results.tasks?.length || 0}</div>
                        <div className="text-[#5c748a] text-sm">Total Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {currentSession.results.tasks?.filter((t: any) => t.status === TaskStatus.COMPLETED).length || 0}
                        </div>
                        <div className="text-[#5c748a] text-sm">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{currentSession.results.logs?.length || 0}</div>
                        <div className="text-[#5c748a] text-sm">Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{currentSession.results.conversations?.length || 0}</div>
                        <div className="text-[#5c748a] text-sm">Conversations</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[#101518] font-medium">Completed Tasks</h4>
                      {currentSession.results.tasks?.filter((t: any) => t.status === TaskStatus.COMPLETED).map((task: any) => (
                        <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="text-[#101518] font-medium mb-2">{task.goal}</h5>
                          <div className="text-sm text-[#5c748a] mb-2">
                            Assigned to: {task.assignee} | Duration: {
                              task.history.length > 1 
                                ? Math.round((task.history[task.history.length - 1].timestamp - task.history[0].timestamp) / 1000 / 60)
                                : 0
                            } minutes
                          </div>
                          {task.result && (
                            <div className="bg-white p-3 rounded border">
                              <pre className="text-xs text-[#101518] whitespace-pre-wrap">
                                {typeof task.result === 'string' ? task.result : JSON.stringify(task.result, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results available</h3>
                  <p className="text-gray-500">Run a session to see results here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Session</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
                  <input
                    type="text"
                    value={newSession.name}
                    onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My experiment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <select
                    value={newSession.organizationName}
                    onChange={(e) => setNewSession({ ...newSession, organizationName: e.target.value, agentName: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select organization</option>
                    {organizations.map(org => (
                      <option key={org.name} value={org.name}>{org.name}</option>
                    ))}
                  </select>
                </div>
                
                {newSession.organizationName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent (Optional)</label>
                    <select
                      value={newSession.agentName}
                      onChange={(e) => setNewSession({ ...newSession, agentName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All agents</option>
                      {getAgentsForOrg(newSession.organizationName).map(agent => (
                        <option key={agent.id} value={agent.name}>{agent.name} ({agent.role.name})</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <textarea
                    value={newSession.goal}
                    onChange={(e) => setNewSession({ ...newSession, goal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="What do you want the organization to accomplish?"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createSession}
                  disabled={!newSession.name || !newSession.organizationName || !newSession.goal}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}