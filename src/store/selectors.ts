import { AppState } from './types';

// Organization selectors
export const getOrganizationById = (state: AppState, id: string) =>
  state.organizations.find(org => org.id === id);

export const getActiveOrganizations = (state: AppState) =>
  state.organizations.filter(org => org.status === 'active');

export const getOrganizationAgents = (state: AppState, organizationId: string) =>
  state.agents.filter(agent => agent.organization === organizationId);

export const getOrganizationWorkflows = (state: AppState, organizationId: string) =>
  state.workflows.filter(workflow => workflow.organization === organizationId);

export const getOrganizationTasks = (state: AppState, organizationId: string) =>
  state.tasks.filter(task => task.organization === organizationId);

// Agent selectors
export const getAgentById = (state: AppState, id: string) =>
  state.agents.find(agent => agent.id === id);

export const getActiveAgents = (state: AppState) =>
  state.agents.filter(agent => agent.status === 'active');

export const getAgentTasks = (state: AppState, agentId: string) =>
  state.tasks.filter(task => task.assignedAgent === agentId);

// Task selectors
export const getTaskById = (state: AppState, id: string) =>
  state.tasks.find(task => task.id === id);

export const getTasksByStatus = (state: AppState, status: string) =>
  state.tasks.filter(task => task.status === status);

export const getPendingTasks = (state: AppState) =>
  state.tasks.filter(task => task.status === 'pending');

export const getInProgressTasks = (state: AppState) =>
  state.tasks.filter(task => task.status === 'in-progress');

export const getCompletedTasks = (state: AppState) =>
  state.tasks.filter(task => task.status === 'completed');

export const getFailedTasks = (state: AppState) =>
  state.tasks.filter(task => task.status === 'failed');

// Event selectors
export const getRecentTaskEvents = (state: AppState, limit: number = 10) =>
  state.taskEvents
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

export const getTaskEventsByOrganization = (state: AppState, organization: string) =>
  state.taskEvents.filter(event => event.organization === organization);

// Human input selectors
export const getPendingHumanInputRequests = (state: AppState) =>
  state.humanInputRequests.filter(request => request.status === 'pending');

export const getHumanInputRequestsByAgent = (state: AppState, agentId: string) =>
  state.humanInputRequests.filter(request => request.agentId === agentId);

// Tool selectors
export const getToolById = (state: AppState, id: string) =>
  state.tools.find(tool => tool.id === id);

export const getToolsByCategory = (state: AppState, category: string) =>
  state.tools.filter(tool => tool.category === category);

export const getActiveTools = (state: AppState) =>
  state.tools.filter(tool => tool.status === 'active');

// Workflow selectors
export const getWorkflowById = (state: AppState, id: string) =>
  state.workflows.find(workflow => workflow.id === id);

export const getActiveWorkflows = (state: AppState) =>
  state.workflows.filter(workflow => workflow.status === 'active');

// Member selectors
export const getMemberById = (state: AppState, id: string) =>
  state.members.find(member => member.id === id);

export const getActiveMembers = (state: AppState) =>
  state.members.filter(member => member.status === 'Active');

export const getMembersByOrganization = (state: AppState, organizationId: string) =>
  state.members.filter(member => member.organizationId === organizationId);

// Playground selectors
export const getPlaygroundById = (state: AppState, id: string) =>
  state.playgrounds.find(playground => playground.id === id);

export const getActivePlaygrounds = (state: AppState) =>
  state.playgrounds.filter(playground => playground.status === 'active');

// History selectors
export const getRecentHistory = (state: AppState, limit: number = 10) =>
  state.history
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

export const getHistoryByType = (state: AppState, type: string) =>
  state.history.filter(entry => entry.type === type);

export const getHistoryByEntity = (state: AppState, entityId: string) =>
  state.history.filter(entry => entry.entityId === entityId);

// Webhook selectors
export const getActiveWebhookEvents = (state: AppState) =>
  state.webhookEvents.filter(event => event.status === 'Active');

export const getWebhookEventsByOrganization = (state: AppState, organizationId: string) =>
  state.webhookEvents.filter(event => event.organizationId === organizationId);

// Analytics selectors
export const getTaskCompletionRate = (state: AppState) => {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.status === 'completed').length;
  return total > 0 ? (completed / total) * 100 : 0;
};

export const getAverageTaskCost = (state: AppState) => {
  const completedTasks = state.tasks.filter(task => task.status === 'completed');
  if (completedTasks.length === 0) return 0;
  const totalCost = completedTasks.reduce((sum, task) => sum + task.cost, 0);
  return totalCost / completedTasks.length;
};

export const getAgentPerformanceMetrics = (state: AppState) => {
  return state.agents.map(agent => {
    const agentTasks = state.tasks.filter(task => task.assignedAgent === agent.id);
    const completedTasks = agentTasks.filter(task => task.status === 'completed');
    const failedTasks = agentTasks.filter(task => task.status === 'failed');
    
    return {
      agentId: agent.id,
      agentName: agent.name,
      totalTasks: agentTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      successRate: agentTasks.length > 0 ? (completedTasks.length / agentTasks.length) * 100 : 0,
      totalCost: completedTasks.reduce((sum, task) => sum + task.cost, 0),
      averageCost: completedTasks.length > 0 ? completedTasks.reduce((sum, task) => sum + task.cost, 0) / completedTasks.length : 0
    };
  });
};

// Search and filter selectors
export const getFilteredOrganizations = (state: AppState) => {
  let filtered = state.organizations;
  
  if (state.searchQuery) {
    filtered = filtered.filter(org => 
      org.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }
  
  if (state.filters.statusFilter) {
    filtered = filtered.filter(org => org.status === state.filters.statusFilter);
  }
  
  return filtered;
};

export const getFilteredAgents = (state: AppState) => {
  let filtered = state.agents;
  
  if (state.searchQuery) {
    filtered = filtered.filter(agent => 
      agent.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }
  
  if (state.filters.organizationFilter) {
    filtered = filtered.filter(agent => agent.organization === state.filters.organizationFilter);
  }
  
  if (state.filters.statusFilter) {
    filtered = filtered.filter(agent => agent.status === state.filters.statusFilter);
  }
  
  return filtered;
};

export const getFilteredTasks = (state: AppState) => {
  let filtered = state.tasks;
  
  if (state.searchQuery) {
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }
  
  if (state.filters.organizationFilter) {
    filtered = filtered.filter(task => task.organization === state.filters.organizationFilter);
  }
  
  if (state.filters.agentFilter) {
    filtered = filtered.filter(task => task.assignedAgent === state.filters.agentFilter);
  }
  
  if (state.filters.statusFilter) {
    filtered = filtered.filter(task => task.status === state.filters.statusFilter);
  }
  
  return filtered;
};