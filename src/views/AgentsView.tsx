import React from 'react';
import { useWaaSStore } from '../store/waasStore';
import { demos } from '../demos';
import { Users, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Helper function to extract all agents from organization config
const extractAgentsFromConfig = (agentConfig: any, orgName: string, parentName?: string): any[] => {
  const agents = [];
  
  // Add the current agent
  agents.push({
    id: agentConfig.id,
    name: agentConfig.name,
    role: agentConfig.role,
    permissions: agentConfig.permissions,
    environmentId: agentConfig.environmentId,
    memory: agentConfig.memory || [],
    organizationName: orgName,
    parentAgent: parentName,
    isManager: !parentName, // Top level agent is manager
    subordinateCount: agentConfig.subordinates?.length || 0
  });

  // Recursively add subordinates
  if (agentConfig.subordinates) {
    agentConfig.subordinates.forEach((sub: any) => {
      agents.push(...extractAgentsFromConfig(sub, orgName, agentConfig.name));
    });
  }

  return agents;
};

export function AgentsView() {
  const [activeTab, setActiveTab] = React.useState('all-agents');
  const [selectedAgent, setSelectedAgent] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterOrg, setFilterOrg] = React.useState('all');

  const { getAllOrganizations } = useWaaSStore();
  const organizations = getAllOrganizations();

  // Extract all agents from all demo organizations
  const allAgents = React.useMemo(() => {
    const agents: any[] = [];
    
    // Get agents from demo organizations
    Object.values(demos).forEach(demo => {
      if (demo.masterAgent) {
        agents.push(...extractAgentsFromConfig(demo.masterAgent, demo.name));
      }
    });

    // Get agents from custom organizations
    const customOrgs = organizations.filter(org => !org.isDemo);
    customOrgs.forEach(org => {
      if (org.config?.masterAgent) {
        agents.push(...extractAgentsFromConfig(org.config.masterAgent, org.name));
      }
    });

    return agents;
  }, [organizations]);

  // Filter agents based on search and organization
  const filteredAgents = React.useMemo(() => {
    return allAgents.filter(agent => {
      const matchesSearch = !searchQuery || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesOrg = filterOrg === 'all' || agent.organizationName === filterOrg;
      
      return matchesSearch && matchesOrg;
    });
  }, [allAgents, searchQuery, filterOrg]);

  const getStatusIcon = (agent: any) => {
    if (agent.isManager) {
      return <Settings className="w-4 h-4 text-blue-500" />;
    }
    return <Users className="w-4 h-4 text-green-500" />;
  };

  const getPermissionBadges = (permissions: any) => {
    const badges = [];
    if (permissions.canDelegate) badges.push({ label: 'Delegate', color: 'bg-blue-100 text-blue-800' });
    if (permissions.canAssignRole) badges.push({ label: 'Assign Role', color: 'bg-green-100 text-green-800' });
    if (permissions.canHire) badges.push({ label: 'Hire', color: 'bg-purple-100 text-purple-800' });
    if (permissions.canCallMeeting) badges.push({ label: 'Meeting', color: 'bg-yellow-100 text-yellow-800' });
    return badges;
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Agents</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal">
              View and manage all agents across your organizations
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#cedbe8] px-4">
          {[
            { id: 'all-agents', label: 'All Agents' },
            { id: 'managers', label: 'Managers' },
            { id: 'workers', label: 'Workers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0c7ff2] text-[#0c7ff2]'
                  : 'border-transparent text-[#49739c] hover:text-[#0d141c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 border-b border-[#cedbe8]">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Organizations</option>
            {Object.values(demos).map(demo => (
              <option key={demo.name} value={demo.name}>{demo.name}</option>
            ))}
          </select>
        </div>

        {/* Agent List */}
        <div className="p-4">
          {!selectedAgent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents
                .filter(agent => {
                  if (activeTab === 'managers') return agent.isManager;
                  if (activeTab === 'workers') return !agent.isManager;
                  return true;
                })
                .map((agent) => (
                  <div 
                    key={`${agent.organizationName}-${agent.id}`} 
                    className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(agent)}
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {agent.name}
                            </h3>
                            {agent.isManager && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Manager
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600 text-sm font-medium mb-1">{agent.role.name}</p>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {agent.role.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Organization:</span> {agent.organizationName}</p>
                          {agent.parentAgent && (
                            <p><span className="font-medium">Reports to:</span> {agent.parentAgent}</p>
                          )}
                          {agent.subordinateCount > 0 && (
                            <p><span className="font-medium">Manages:</span> {agent.subordinateCount} agent{agent.subordinateCount > 1 ? 's' : ''}</p>
                          )}
                          <p><span className="font-medium">Environment:</span> {agent.environmentId}</p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {getPermissionBadges(agent.permissions).map((badge, index) => (
                            <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            /* Agent Details View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Agents
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(selectedAgent)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedAgent.name}</h1>
                      {selectedAgent.isManager && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Manager
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{selectedAgent.role.name}</p>
                    <p className="text-gray-600">{selectedAgent.role.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Organization</span>
                        <p className="text-gray-900">{selectedAgent.organizationName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Environment</span>
                        <p className="text-gray-900">{selectedAgent.environmentId}</p>
                      </div>
                      {selectedAgent.parentAgent && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Reports To</span>
                          <p className="text-gray-900">{selectedAgent.parentAgent}</p>
                        </div>
                      )}
                      {selectedAgent.subordinateCount > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Direct Reports</span>
                          <p className="text-gray-900">{selectedAgent.subordinateCount} agent{selectedAgent.subordinateCount > 1 ? 's' : ''}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedAgent.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedAgent.memory && selectedAgent.memory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedAgent.memory.map((memory: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700">
                            • {memory}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {filteredAgents.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-500">
                {searchQuery || filterOrg !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No agents are available in the current organizations'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}