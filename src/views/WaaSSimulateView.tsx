import React, { useState } from 'react';
import { useWaaSStore } from '../store/waasStore';
import { AnalyticsOverlay } from '../components/waas/AnalyticsOverlay';
import { HumanInputPanel } from '../components/waas/HumanInputPanel';
import OrganizationGraph from '../components/waas/OrganizationGraph';
import { Play, Square, BarChart3, Trash2, Users, Database, MessageSquare, Settings, Clock, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { TaskStatus } from '../types';

export function WaaSSimulateView() {
  const { 
    tasks, 
    logs, 
    conversations, 
    environments, 
    events, 
    showAnalytics, 
    orgConfig,
    isSimulating,
    simulationCompleted,
    thinkingAgentId,
    startSimulation,
    resetSimulation,
    toggleAnalytics,
    clearPersistentState
  } = useWaaSStore();
  
  const [goalInput, setGoalInput] = React.useState('Create a short, three-chapter children\'s storybook about a brave mouse who learns to fly.');
  const [activeTab, setActiveTab] = React.useState<'tasks' | 'logs' | 'conversations' | 'environments' | 'events' | 'graph'>('tasks');

  const handleStartSimulation = async () => {
    if (!goalInput.trim()) return;
    await startSimulation(goalInput);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case TaskStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Play className="w-4 h-4 text-blue-500" />;
      case TaskStatus.BLOCKED:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case TaskStatus.AWAITING_INPUT:
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-50 border-green-200 text-green-800';
      case TaskStatus.FAILED:
        return 'bg-red-50 border-red-200 text-red-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case TaskStatus.BLOCKED:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case TaskStatus.AWAITING_INPUT:
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const exportData = (type: 'tasks' | 'logs' | 'conversations' | 'environments' | 'events') => {
    let data;
    let filename;
    
    switch (type) {
      case 'tasks':
        data = tasks;
        filename = 'tasks';
        break;
      case 'logs':
        data = logs;
        filename = 'logs';
        break;
      case 'conversations':
        data = conversations;
        filename = 'conversations';
        break;
      case 'environments':
        data = environments;
        filename = 'environments';
        break;
      case 'events':
        data = events;
        filename = 'events';
        break;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waas-${filename}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Simulation</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Run autonomous workforce simulations and monitor agent performance
            </p>
          </div>
        </div>

        <div className="flex h-[calc(100vh-200px)] gap-4">
          {/* Control Panel */}
          <div className="w-80 bg-white border border-[#d4dce2] rounded-xl p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#101518] mb-2">Control Panel</h2>
              <p className="text-[#5c748a] text-sm">Configure and run simulations</p>
            </div>

            {/* Organization Info */}
            <div className="mb-6 p-4 bg-[#f8fafc] rounded-lg border border-[#d4dce2]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#0c7ff2] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#101518] font-medium">Current Organization</h3>
                </div>
              </div>
              <p className="text-[#101518] text-sm font-medium">{orgConfig.name}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#5c748a]">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{orgConfig.masterAgent ? countAgents(orgConfig.masterAgent) : 0} agents</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>{orgConfig.environments.length} environments</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{orgConfig.sopLibrary?.length || 0} SOPs</span>
                </div>
              </div>
            </div>

            {/* Goal Input */}
            <div className="mb-6">
              <label className="block text-[#101518] font-medium mb-2">Simulation Goal</label>
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Enter your goal for the organization..."
                className="w-full p-3 bg-white text-[#101518] rounded-lg border border-[#d4dce2] focus:border-[#0c7ff2] focus:outline-none resize-none"
                rows={4}
                disabled={isSimulating}
              />
            </div>

            {/* Control Buttons */}
            <div className="space-y-3 mb-6">
              {!isSimulating && !simulationCompleted && (
                <button
                  onClick={handleStartSimulation}
                  disabled={!goalInput.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0c7ff2] hover:bg-[#0a6fd1] disabled:bg-[#d4dce2] disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                >
                  <Play className="w-4 h-4" />
                  Start Simulation
                </button>
              )}

              {(isSimulating || simulationCompleted) && (
                <button
                  onClick={resetSimulation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg transition-colors font-medium"
                >
                  <Square className="w-4 h-4" />
                  Reset Simulation
                </button>
              )}

              <button
                onClick={toggleAnalytics}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                  showAnalytics 
                    ? 'bg-[#059669] hover:bg-[#047857] text-white' 
                    : 'bg-white hover:bg-[#f1f5f9] text-[#5c748a] border border-[#d4dce2]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="mt-auto pt-6 border-t border-[#d4dce2]">
              <h3 className="text-[#dc2626] font-medium mb-3 text-sm">Danger Zone</h3>
              <button
                onClick={clearPersistentState}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] rounded-lg transition-colors text-sm border border-[#fecaca]"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white border border-[#d4dce2] rounded-xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-[#d4dce2] bg-[#f8fafc]">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'tasks'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Tasks
                  {tasks.length > 0 && (
                    <span className="ml-2 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                      {tasks.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'logs'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Communication Log
                  {logs.length > 0 && (
                    <span className="ml-2 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                      {logs.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'conversations'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Conversations
                  {conversations.length > 0 && (
                    <span className="ml-2 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                      {conversations.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('environments')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'environments'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Environments
                  {Object.keys(environments).length > 0 && (
                    <span className="ml-2 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                      {Object.keys(environments).length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'events'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Events
                  {events.length > 0 && (
                    <span className="ml-2 bg-[#e7edf4] text-[#5c748a] px-2 py-1 rounded-full text-xs">
                      {events.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('graph')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === 'graph'
                      ? 'border-[#0c7ff2] text-[#0c7ff2]'
                      : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Organization Graph
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                    <button
                      onClick={() => exportData('tasks')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border border-[#d4dce2] rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-[#101518] font-medium mb-2 line-clamp-2">{task.goal}</h3>
                              <div className="flex items-center gap-4 text-sm text-[#5c748a]">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{task.assignee || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(task.history[0]?.timestamp || Date.now())}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              {task.status.replace('_', ' ')}
                            </span>
                            {task.retries > 0 && (
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                Retries: {task.retries}
                              </span>
                            )}
                          </div>

                          {/* Task Result */}
                          {task.result && task.status === TaskStatus.COMPLETED && (
                            <div className="mt-3 pt-3 border-t border-[#d4dce2]">
                              <h4 className="text-xs font-medium text-[#5c748a] mb-2">Result</h4>
                              <div className="text-xs text-[#101518] bg-[#f8fafc] p-2 rounded max-h-32 overflow-y-auto">
                                {typeof task.result === 'string' 
                                  ? task.result 
                                  : JSON.stringify(task.result, null, 2)
                                }
                              </div>
                            </div>
                          )}

                          {/* Task History */}
                          {task.history.length > 1 && (
                            <div className="mt-3 pt-3 border-t border-[#d4dce2]">
                              <h4 className="text-xs font-medium text-[#5c748a] mb-2">Recent Updates</h4>
                              <div className="space-y-1">
                                {task.history.slice(-2).map((entry, index) => (
                                  <div key={index} className="text-xs text-[#5c748a]">
                                    <span className="font-medium">{formatTime(entry.timestamp)}:</span> {entry.message}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 flex items-center justify-center h-64">
                        <div className="text-center">
                          <Clock className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
                          <h3 className="text-xl font-medium text-[#101518] mb-2">No Tasks Yet</h3>
                          <p className="text-[#5c748a]">Start a simulation to see tasks appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Communication Logs</h3>
                    <button
                      onClick={() => exportData('logs')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log.id} className="bg-white border border-[#d4dce2] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#0c7ff2]" />
                            <span className="text-[#101518] font-medium">{log.subject}</span>
                          </div>
                          <div className="text-xs text-[#5c748a]">
                            {formatTime(log.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-[#5c748a] mb-2">
                          From: <span className="text-[#101518]">{log.from}</span> → To: <span className="text-[#101518]">{log.to}</span>
                        </div>
                        <div className="text-sm text-[#101518] bg-[#f8fafc] p-3 rounded">
                          {typeof log.body === 'string' ? log.body : JSON.stringify(log.body, null, 2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#101518] mb-2">No Logs Yet</h3>
                        <p className="text-[#5c748a]">Agent communications will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'conversations' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
                    <button
                      onClick={() => exportData('conversations')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
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
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Users className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#101518] mb-2">No Conversations Yet</h3>
                        <p className="text-[#5c748a]">Agent conversations will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'environments' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Environments</h3>
                    <button
                      onClick={() => exportData('environments')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  {Object.entries(environments).length > 0 ? (
                    Object.entries(environments).map(([envId, state]) => (
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
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Database className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#101518] mb-2">No Environments</h3>
                        <p className="text-[#5c748a]">Environment states will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                    <button
                      onClick={() => exportData('events')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  {events.length > 0 ? (
                    events.map((event, index) => (
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
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Settings className="w-16 h-16 text-[#d4dce2] mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#101518] mb-2">No Events Yet</h3>
                        <p className="text-[#5c748a]">System events will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'graph' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Organization Graph</h3>
                    <div className="text-sm text-gray-500">
                      {thinkingAgentId && (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          Currently active: {thinkingAgentId}
                        </span>
                      )}
                    </div>
                  </div>
                  <OrganizationGraph />
                </div>
              )}
            </div>
          </div>
        </div>

        {showAnalytics && <AnalyticsOverlay />}
        <HumanInputPanel />
      </div>
    </div>
  );
}

// Helper function to count agents in hierarchy
const countAgents = (agentConfig: any): number => {
  let count = 1;
  if (agentConfig.subordinates) {
    count += agentConfig.subordinates.reduce((sum: number, sub: any) => sum + countAgents(sub), 0);
  }
  return count;
};