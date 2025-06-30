import React from 'react';
import { useAppStore } from '../store/context';
import { useWaaSStore } from '../store/waasStore';
import { TaskStatus } from '../types';
import { Building2, Users, CheckCircle, DollarSign, Clock, Play, Plus } from 'lucide-react';

export function DashboardView() {
  const { dispatch } = useAppStore();
  const { getAllOrganizations, getAllTasks, getOrganizationStats } = useWaaSStore();

  // Get all organizations and tasks
  const organizations = getAllOrganizations();
  const allTasks = getAllTasks();

  // Calculate overall metrics
  const totalOrganizations = organizations.length;
  const totalAgents = organizations.reduce((sum, org) => sum + org.agents, 0);
  const completedTasks = allTasks.filter(task => task.status === TaskStatus.COMPLETED);
  const totalTasksCompleted = completedTasks.length;
  const totalCost = completedTasks.reduce((sum, task) => sum + (task.result?.cost || 0), 0);

  // Get recent tasks (last 10)
  const recentTasks = allTasks
    .sort((a, b) => (b.history[0]?.timestamp || 0) - (a.history[0]?.timestamp || 0))
    .slice(0, 10);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.BLOCKED:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.AWAITING_INPUT:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrganization = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'workflows' }); // This will be the org builder
  };

  const handleViewOrganization = (orgId: string) => {
    dispatch({ type: 'SET_SELECTED_ORGANIZATION', payload: orgId });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'organizations' });
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Dashboard</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal">
              Monitor your autonomous workforce and manage organizations
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-6">
          <div className="bg-white rounded-lg border border-[#cedbe8] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#49739c] text-sm font-medium">Total Organizations</p>
                <p className="text-[#0d141c] text-2xl font-bold">{totalOrganizations}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#cedbe8] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#49739c] text-sm font-medium">Total Agents</p>
                <p className="text-[#0d141c] text-2xl font-bold">{totalAgents}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#cedbe8] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#49739c] text-sm font-medium">Tasks Completed</p>
                <p className="text-[#0d141c] text-2xl font-bold">{totalTasksCompleted}</p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#cedbe8] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#49739c] text-sm font-medium">Total Cost</p>
                <p className="text-[#0d141c] text-2xl font-bold">${totalCost.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Organizations</h2>
        <div className="px-4 py-3">
          <div className="flex overflow-hidden rounded-lg border border-[#cedbe8] bg-slate-50">
            <table className="flex-1">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">
                    Organization
                  </th>
                  <th className="px-4 py-3 text-left text-[#0d141c] w-60 text-sm font-medium leading-normal">Status</th>
                  <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Agents</th>
                  <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Tasks</th>
                  <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Total Cost</th>
                  <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => {
                  const stats = getOrganizationStats(org.name);
                  return (
                    <tr key={org.id} className="border-t border-t-[#cedbe8] hover:bg-gray-50 transition-colors">
                      <td className="h-[72px] px-4 py-2 w-[400px]">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-[#0d141c] text-sm font-medium leading-normal">{org.name}</p>
                            <p className="text-[#49739c] text-xs leading-normal">{org.description}</p>
                          </div>
                          {org.isDemo && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Demo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {org.status}
                        </span>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">{org.agents}</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">{stats.completedTasks}</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">${stats.totalCost.toFixed(2)}</td>
                      <td className="h-[72px] px-4 py-2 w-[400px]">
                        <button 
                          onClick={() => handleViewOrganization(org.id)}
                          className="text-[#0c7ff2] hover:underline text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex px-4 py-3 justify-start">
          <button 
            onClick={handleCreateOrganization}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c7ff2] text-white rounded-lg hover:bg-[#0a6fd1] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create New Organization
          </button>
        </div>
        
        <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Tasks</h2>
        <div className="px-4 py-3">
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg border border-[#cedbe8] p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[#0d141c] font-medium">{task.goal}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#49739c]">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{task.assignee || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{task.organizationId || 'Unknown Org'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(task.history[0]?.timestamp || Date.now())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-[#cedbe8] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[#0d141c] mb-2">No Tasks Yet</h3>
              <p className="text-[#49739c]">Start running simulations to see task activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}