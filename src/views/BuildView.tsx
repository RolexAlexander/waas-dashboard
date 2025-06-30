import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Users, Database, Settings, Save, Download, Upload, Trash2, Edit3 } from 'lucide-react';
import { useWaaSStore } from '../store/waasStore';
import { v4 as uuidv4 } from 'uuid';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  description: string;
  x: number;
  y: number;
  parentId?: string;
  permissions: {
    canDelegate: boolean;
    canAssignRole: boolean;
    canHire: boolean;
    canCallMeeting: boolean;
  };
}

interface Environment {
  id: string;
  name: string;
  tools: string[];
  permissions: Record<string, string[]>;
}

const ItemTypes = {
  AGENT: 'agent'
};

const DraggableAgent = ({ agent, onEdit, onDelete }: { agent: AgentNode; onEdit: (agent: AgentNode) => void; onDelete: (id: string) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.AGENT,
    item: { id: agent.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`absolute bg-white border-2 border-blue-200 rounded-lg p-4 w-64 shadow-lg cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ left: agent.x, top: agent.y }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(agent)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium text-blue-600 mb-1">{agent.role}</p>
      <p className="text-xs text-gray-600">{agent.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {agent.permissions.canDelegate && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Delegate</span>
        )}
        {agent.permissions.canHire && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Hire</span>
        )}
        {agent.permissions.canCallMeeting && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Meeting</span>
        )}
      </div>
    </div>
  );
};

const DropZone = ({ agents, onDrop, onAgentMove, onEdit, onDelete }: {
  agents: AgentNode[];
  onDrop: (x: number, y: number) => void;
  onAgentMove: (id: string, x: number, y: number) => void;
  onEdit: (agent: AgentNode) => void;
  onDelete: (id: string) => void;
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.AGENT,
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const dropZoneRect = document.getElementById('drop-zone')?.getBoundingClientRect();
      if (offset && dropZoneRect) {
        const x = offset.x - dropZoneRect.left;
        const y = offset.y - dropZoneRect.top;
        
        const existingAgent = agents.find(a => a.id === item.id);
        if (existingAgent) {
          onAgentMove(item.id, x, y);
        } else {
          onDrop(x, y);
        }
      }
    },
  }));

  return (
    <div
      id="drop-zone"
      ref={drop}
      className="relative w-full h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
    >
      {agents.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Drag agents here to build your organization</p>
            <p className="text-gray-500 text-sm">Start by adding agents from the library</p>
          </div>
        </div>
      ) : (
        agents.map(agent => (
          <DraggableAgent
            key={agent.id}
            agent={agent}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export function BuildView() {
  const { saveCustomOrganization } = useWaaSStore();
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [agents, setAgents] = useState<AgentNode[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: 'default',
      name: 'Default Environment',
      tools: ['web_search', 'create_report'],
      permissions: {}
    }
  ]);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentNode | null>(null);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);

  const [agentForm, setAgentForm] = useState({
    name: '',
    role: '',
    description: '',
    permissions: {
      canDelegate: false,
      canAssignRole: false,
      canHire: false,
      canCallMeeting: false
    }
  });

  const [envForm, setEnvForm] = useState({
    name: '',
    tools: '',
    permissions: ''
  });

  const agentTemplates = [
    { name: 'Manager', role: 'Manager', description: 'Oversees operations and coordinates teams', permissions: { canDelegate: true, canAssignRole: true, canHire: true, canCallMeeting: true } },
    { name: 'Agent', role: 'Agent', description: 'Executes tasks and provides assistance', permissions: { canDelegate: false, canAssignRole: false, canHire: false, canCallMeeting: false } },
    { name: 'Specialist', role: 'Specialist', description: 'Provides expert knowledge in specific domains', permissions: { canDelegate: false, canAssignRole: false, canHire: false, canCallMeeting: true } },
    { name: 'Coordinator', role: 'Coordinator', description: 'Facilitates communication and workflow', permissions: { canDelegate: true, canAssignRole: false, canHire: false, canCallMeeting: true } }
  ];

  const handleAddAgent = (template?: any) => {
    if (template) {
      setAgentForm({
        name: template.name,
        role: template.role,
        description: template.description,
        permissions: template.permissions
      });
    } else {
      setAgentForm({
        name: '',
        role: '',
        description: '',
        permissions: {
          canDelegate: false,
          canAssignRole: false,
          canHire: false,
          canCallMeeting: false
        }
      });
    }
    setEditingAgent(null);
    setShowAgentModal(true);
  };

  const handleEditAgent = (agent: AgentNode) => {
    setAgentForm({
      name: agent.name,
      role: agent.role,
      description: agent.description,
      permissions: agent.permissions
    });
    setEditingAgent(agent);
    setShowAgentModal(true);
  };

  const handleSaveAgent = () => {
    if (!agentForm.name || !agentForm.role) return;

    if (editingAgent) {
      setAgents(prev => prev.map(a => 
        a.id === editingAgent.id 
          ? { ...a, ...agentForm }
          : a
      ));
    } else {
      const newAgent: AgentNode = {
        id: uuidv4(),
        ...agentForm,
        x: 100,
        y: 100
      };
      setAgents(prev => [...prev, newAgent]);
    }

    setShowAgentModal(false);
    setEditingAgent(null);
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const handleAgentMove = (id: string, x: number, y: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id ? { ...agent, x, y } : agent
    ));
  };

  const handleAddEnvironment = () => {
    setEnvForm({ name: '', tools: '', permissions: '' });
    setEditingEnv(null);
    setShowEnvModal(true);
  };

  const handleSaveEnvironment = () => {
    if (!envForm.name) return;

    const newEnv: Environment = {
      id: editingEnv?.id || uuidv4(),
      name: envForm.name,
      tools: envForm.tools.split(',').map(t => t.trim()).filter(Boolean),
      permissions: envForm.permissions ? JSON.parse(envForm.permissions) : {}
    };

    if (editingEnv) {
      setEnvironments(prev => prev.map(e => e.id === editingEnv.id ? newEnv : e));
    } else {
      setEnvironments(prev => [...prev, newEnv]);
    }

    setShowEnvModal(false);
    setEditingEnv(null);
  };

  const handleSaveOrganization = () => {
    if (!orgName || agents.length === 0) return;

    // Convert agents to hierarchical structure (simplified - assumes first agent is master)
    const masterAgent = agents[0];
    const subordinates = agents.slice(1);

    const orgConfig = {
      id: uuidv4(),
      name: orgName,
      description: orgDescription,
      status: 'active' as const,
      agents: agents.length,
      tasks: 0,
      totalCost: 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      isDemo: false,
      config: {
        name: orgName,
        llmConfig: {
          provider: 'gemini' as const,
          model: 'gemini-2.5-flash-preview-04-17' as const,
        },
        environments: environments.map(env => ({
          id: env.id,
          initialState: { data: {} },
          tools: env.tools,
          permissions: env.permissions
        })),
        masterAgent: {
          id: masterAgent.id,
          name: masterAgent.name,
          role: { name: masterAgent.role, description: masterAgent.description },
          permissions: masterAgent.permissions,
          environmentId: environments[0]?.id || 'default',
          memory: [],
          subordinates: subordinates.map(sub => ({
            id: sub.id,
            name: sub.name,
            role: { name: sub.role, description: sub.description },
            permissions: sub.permissions,
            environmentId: environments[0]?.id || 'default',
            memory: [],
          }))
        },
        sopLibrary: []
      }
    };

    saveCustomOrganization(orgConfig);
    
    // Reset form
    setOrgName('');
    setOrgDescription('');
    setAgents([]);
    setEnvironments([{
      id: 'default',
      name: 'Default Environment',
      tools: ['web_search', 'create_report'],
      permissions: {}
    }]);

    alert('Organization saved successfully!');
  };

  const handleExportOrganization = () => {
    const exportData = {
      name: orgName,
      description: orgDescription,
      agents,
      environments
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orgName || 'organization'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportOrganization = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setOrgName(data.name || '');
        setOrgDescription(data.description || '');
        setAgents(data.agents || []);
        setEnvironments(data.environments || []);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Organization Builder</p>
              <p className="text-[#49739c] text-sm font-normal leading-normal">
                Visually design and structure your organization with a drag-and-drop interface
              </p>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportOrganization}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportOrganization}
                disabled={!orgName || agents.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleSaveOrganization}
                disabled={!orgName || agents.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Organization
              </button>
            </div>
          </div>

          {/* Organization Details */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization description"
                />
              </div>
            </div>
          </div>

          {/* Agent Library */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Agent Library</h3>
              <button
                onClick={() => handleAddAgent()}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Custom Agent
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              {agentTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleAddAgent(template)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Organization Canvas */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Structure</h3>
            <DropZone
              agents={agents}
              onDrop={(x, y) => {}}
              onAgentMove={handleAgentMove}
              onEdit={handleEditAgent}
              onDelete={handleDeleteAgent}
            />
          </div>

          {/* Environments */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Environments</h3>
              <button
                onClick={handleAddEnvironment}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Environment
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {environments.map((env) => (
                <div key={env.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900">{env.name}</h4>
                    </div>
                    <button
                      onClick={() => {
                        setEnvForm({
                          name: env.name,
                          tools: env.tools.join(', '),
                          permissions: JSON.stringify(env.permissions, null, 2)
                        });
                        setEditingEnv(env);
                        setShowEnvModal(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Tools: {env.tools.join(', ')}</p>
                  <p className="text-xs text-gray-500">Permissions: {Object.keys(env.permissions).length} rules</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Modal */}
          {showAgentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingAgent ? 'Edit Agent' : 'Add Agent'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={agentForm.role}
                      onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={agentForm.description}
                      onChange={(e) => setAgentForm({ ...agentForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="space-y-2">
                      {Object.entries(agentForm.permissions).map(([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setAgentForm({
                              ...agentForm,
                              permissions: { ...agentForm.permissions, [key]: e.target.checked }
                            })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAgentModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAgent}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Environment Modal */}
          {showEnvModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingEnv ? 'Edit Environment' : 'Add Environment'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={envForm.name}
                      onChange={(e) => setEnvForm({ ...envForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tools (comma-separated)</label>
                    <input
                      type="text"
                      value={envForm.tools}
                      onChange={(e) => setEnvForm({ ...envForm, tools: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="web_search, create_report, analyze_data"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permissions (JSON)</label>
                    <textarea
                      value={envForm.permissions}
                      onChange={(e) => setEnvForm({ ...envForm, permissions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder='{"tool_name": ["role1", "role2"]}'
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEnvModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEnvironment}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}