import React from 'react';
import { useAppStore } from '../store/context';
import { useWaaSStore } from '../store/waasStore';
import { Plus, Search, MoreVertical, Users, CheckCircle, Clock, AlertCircle, Edit, Trash2, Eye, Settings, Play, Database, Wrench, Code, Download, DollarSign } from 'lucide-react';

// Helper function to count agents in hierarchy
const countAgentsInConfig = (agentConfig: any): number => {
  let count = 1;
  if (agentConfig.subordinates) {
    count += agentConfig.subordinates.reduce((sum: number, sub: any) => sum + countAgentsInConfig(sub), 0);
  }
  return count;
};

export function OrganizationsView() {
  const { state, dispatch } = useAppStore();
  const { setOrgConfig, getAllOrganizations, getOrganizationStats } = useWaaSStore();
  const [activeTab, setActiveTab] = React.useState('organizations');
  const [detailsTab, setDetailsTab] = React.useState('overview');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showEnvironmentModal, setShowEnvironmentModal] = React.useState(false);
  const [selectedOrg, setSelectedOrg] = React.useState<any | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<any>(null);
  const [newOrgData, setNewOrgData] = React.useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Get organizations from WaaS store
  const organizations = React.useMemo(() => {
    return getAllOrganizations();
  }, [getAllOrganizations]);

  // Get filtered organizations
  const filteredOrganizations = React.useMemo(() => {
    let filtered = organizations;
    
    if (searchQuery) {
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(org => org.status === statusFilter);
    }
    
    return filtered;
  }, [organizations, searchQuery, statusFilter]);

  const handleCreateOrganization = () => {
    if (!newOrgData.name.trim() || !newOrgData.description.trim()) return;

    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'workflows' });
  };

  const handleEditOrganization = () => {
    if (!selectedOrg || !newOrgData.name.trim() || !newOrgData.description.trim()) return;

    setShowEditModal(false);
    setSelectedOrg(null);
    setNewOrgData({ name: '', description: '', status: 'active' });
  };

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      // In a real app, we would delete the organization
      if (state.selectedOrganization === orgId) {
        dispatch({ type: 'SET_SELECTED_ORGANIZATION', payload: '' });
      }
    }
  };

  const handleSelectOrganization = (org: any) => {
    setSelectedOrg(org);
    setDetailsTab('overview');
  };

  const handleSimulateOrganization = (org: any) => {
    if (org.config) {
      setOrgConfig(org.config);
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'simulate' });
    }
  };

  const openEditModal = (org: any) => {
    setSelectedOrg(org);
    setNewOrgData({
      name: org.name,
      description: org.description,
      status: org.status
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const exportOrganization = (org: any) => {
    const exportData = {
      name: org.name,
      description: org.description,
      config: org.config,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${org.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Organizations</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal">
              Manage your organizations, agents, and workflows
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0c7ff2] text-white rounded-lg hover:bg-[#0a6fd1] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Organization
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#cedbe8] px-4">
          {[
            { id: 'organizations', label: 'Organizations' },
            { id: 'snapshots', label: 'Snapshots' },
            { id: 'changelog', label: 'Changelog' }
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

        {activeTab === 'organizations' && (
          <div className="p-4">
            {!selectedOrg ? (
              <>
                {/* Search and Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Organizations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrganizations.map((org) => {
                    const stats = getOrganizationStats(org.name);
                    return (
                      <div key={org.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {org.name}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {org.description}
                              </p>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(org.status)}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                                  {org.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="relative ml-4">
                              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Users className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="font-semibold text-gray-900">{org.agents}</p>
                                <p className="text-gray-500 text-xs">Agents</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <CheckCircle className="w-4 h-4 text-purple-500" />
                                </div>
                                <p className="font-semibold text-gray-900">{stats.completedTasks}</p>
                                <p className="text-gray-500 text-xs">Tasks</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <DollarSign className="w-4 h-4 text-blue-500" />
                                </div>
                                <p className="font-semibold text-gray-900">${stats.totalCost.toFixed(2)}</p>
                                <p className="text-gray-500 text-xs">Cost</p>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              <p>Created: {formatDate(org.createdAt)}</p>
                              {org.lastActivity && (
                                <p>Last activity: {formatDate(org.lastActivity)}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSelectOrganization(org)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => openEditModal(org)}
                              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrganization(org.id)}
                              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredOrganizations.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first organization'
                      }
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Organization
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Organization Details View */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedOrg(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedOrg.name}</h2>
                      <p className="text-gray-600">{selectedOrg.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportOrganization(selectedOrg)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => handleSimulateOrganization(selectedOrg)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Simulate
                    </button>
                    <button
                      onClick={() => openEditModal(selectedOrg)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Details Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview', icon: Eye },
                      { id: 'agents', label: 'Agents', icon: Users },
                      { id: 'tools', label: 'Tools', icon: Wrench },
                      { id: 'environments', label: 'Environments', icon: Database }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setDetailsTab(tab.id)}
                          className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                            detailsTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {detailsTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Agents</span>
                            <span className="font-semibold">{selectedOrg.agents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Environments</span>
                            <span className="font-semibold">{selectedOrg.config?.environments?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrg.status)}`}>
                              {selectedOrg.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                        <div className="space-y-4">
                          {(() => {
                            const stats = getOrganizationStats(selectedOrg.name);
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Tasks</span>
                                  <span className="font-semibold">{stats.totalTasks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Completed Tasks</span>
                                  <span className="font-semibold">{stats.completedTasks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Success Rate</span>
                                  <span className="font-semibold">
                                    {stats.totalTasks > 0 
                                      ? `${((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)}%` 
                                      : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Cost</span>
                                  <span className="font-semibold">${stats.totalCost.toFixed(2)}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleSimulateOrganization(selectedOrg)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Start Simulation
                          </button>
                          <button
                            onClick={() => exportOrganization(selectedOrg)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Export Organization
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'workflows' })}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Structure
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailsTab === 'agents' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Agents ({selectedOrg.agents})</h3>
                        <button
                          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'workflows' })}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Agent
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedOrg.config?.masterAgent && renderAgentCards(selectedOrg.config.masterAgent)}
                      </div>
                    </div>
                  )}

                  {detailsTab === 'tools' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Tools</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedOrg.config?.environments.flatMap((env: any) => 
                          env.tools.map((tool: string) => (
                            <div key={`${env.id}-${tool}`} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Wrench className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{tool}</h4>
                                    <p className="text-sm text-gray-600">{env.id}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {detailsTab === 'environments' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Environments ({selectedOrg.config?.environments.length || 0})</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedOrg.config?.environments.map((env: any) => (
                          <div key={env.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Database className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{env.id}</h4>
                                  <p className="text-sm text-gray-600">{env.tools.length} tools</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              <p>Tools: {env.tools.join(', ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'snapshots' && (
          <div className="p-4">
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Snapshots</h2>
            <p className="text-[#49739c] text-sm font-normal leading-normal mb-6">
              Snapshots allow you to save and load entire organizations for portability. You can upload JSON/YAML files, export
              full org snapshots, view changelogs, and preview the org graph before applying changes.
            </p>

            <div className="mb-6">
              <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] mb-2">Upload Snapshot</h3>
              <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#cedbe8] px-6 py-14">
                <label className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Click to upload</span>
                  <input type="file" accept=".json" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const data = JSON.parse(event.target?.result as string);
                          alert(`Snapshot loaded: ${data.name}`);
                        } catch (error) {
                          alert('Invalid snapshot file');
                        }
                      };
                      reader.readAsText(file);
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="mb-6">
              <button 
                onClick={() => {
                  if (organizations.length > 0) {
                    const allOrgs = {
                      organizations,
                      exportedAt: new Date().toISOString()
                    };
                    
                    const blob = new Blob([JSON.stringify(allOrgs, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `waas-organizations-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } else {
                    alert('No organizations to export');
                  }
                }}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Export Snapshot</span>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] mb-2">Preview</h3>
              <p className="text-[#49739c] text-sm font-normal leading-normal mb-4">
                Preview the org graph before applying changes.
              </p>
              <div className="flex flex-col items-center gap-6 rounded-lg border border-[#cedbe8] px-6 py-14 bg-slate-50">
                <div className="text-center">
                  <p className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] mb-2">No snapshot selected</p>
                  <p className="text-[#49739c] text-sm font-normal leading-normal">Upload a snapshot to preview the org graph.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c7ff2] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Apply Changes</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="p-4">
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Changelog</h2>
            <div className="space-y-4">
              {state.history
                .filter(entry => entry.type === 'organization')
                .slice(0, 10)
                .map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {entry.entityName} {entry.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entry.action === 'created' ? 'bg-green-100 text-green-800' :
                        entry.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entry.action}
                      </span>
                    </div>
                    {entry.changes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Changes: {JSON.stringify(entry.changes)}</p>
                      </div>
                    )}
                  </div>
                ))}
              
              {state.history.filter(entry => entry.type === 'organization').length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[#49739c] text-base font-normal leading-normal">No changelog entries yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Organization Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter organization description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newOrgData.status}
                    onChange={(e) => setNewOrgData({ ...newOrgData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  onClick={handleCreateOrganization}
                  disabled={!newOrgData.name.trim() || !newOrgData.description.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Organization Modal */}
        {showEditModal && selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter organization description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newOrgData.status}
                    onChange={(e) => setNewOrgData({ ...newOrgData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditOrganization}
                  disabled={!newOrgData.name.trim() || !newOrgData.description.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Environment Edit Modal */}
        {showEnvironmentModal && selectedEnvironment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Environment: {selectedEnvironment.name}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment Configuration</label>
                  <textarea
                    defaultValue={JSON.stringify({
                      id: selectedEnvironment.id,
                      initialState: { data: {} },
                      tools: ['web_search', 'create_report', 'analyze_data'],
                      permissions: {}
                    }, null, 2)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    rows={12}
                    placeholder="Enter environment configuration as JSON"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Configuration Help</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>id:</strong> Unique identifier for the environment</li>
                    <li>• <strong>initialState:</strong> Starting state data for the environment</li>
                    <li>• <strong>tools:</strong> Array of available tool names</li>
                    <li>• <strong>permissions:</strong> Tool access restrictions by role</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEnvironmentModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would save the environment configuration
                    setShowEnvironmentModal(false);
                    setSelectedEnvironment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to render agent cards recursively
function renderAgentCards(agent: any) {
  const cards = [];
  
  // Add the current agent
  cards.push(
    <div key={agent.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{agent.name}</h4>
            <p className="text-sm text-gray-600">{agent.role.name}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
          {agent.role.name}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{agent.role.description}</p>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex flex-wrap gap-1">
          {agent.permissions.canDelegate && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Delegate</span>
          )}
          {agent.permissions.canAssignRole && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Assign Role</span>
          )}
          {agent.permissions.canHire && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Hire</span>
          )}
          {agent.permissions.canCallMeeting && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Meeting</span>
          )}
        </div>
      </div>
    </div>
  );
  
  // Add subordinates recursively
  if (agent.subordinates) {
    agent.subordinates.forEach((sub: any) => {
      cards.push(...renderAgentCards(sub));
    });
  }
  
  return cards;
}