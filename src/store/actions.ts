import { AppAction, Organization, Agent, Tool, Workflow, Task, TaskEvent, HumanInputRequest, Member, WebhookEvent, Playground, HistoryEntry } from './types';

// Organization action creators
export const addOrganization = (organization: Organization): AppAction => ({
  type: 'ADD_ORGANIZATION',
  payload: organization
});

export const updateOrganization = (id: string, updates: Partial<Organization>): AppAction => ({
  type: 'UPDATE_ORGANIZATION',
  payload: { id, updates }
});

export const deleteOrganization = (id: string): AppAction => ({
  type: 'DELETE_ORGANIZATION',
  payload: id
});

// Agent action creators
export const addAgent = (agent: Agent): AppAction => ({
  type: 'ADD_AGENT',
  payload: agent
});

export const updateAgent = (id: string, updates: Partial<Agent>): AppAction => ({
  type: 'UPDATE_AGENT',
  payload: { id, updates }
});

export const deleteAgent = (id: string): AppAction => ({
  type: 'DELETE_AGENT',
  payload: id
});

// Tool action creators
export const addTool = (tool: Tool): AppAction => ({
  type: 'ADD_TOOL',
  payload: tool
});

export const updateTool = (id: string, updates: Partial<Tool>): AppAction => ({
  type: 'UPDATE_TOOL',
  payload: { id, updates }
});

export const deleteTool = (id: string): AppAction => ({
  type: 'DELETE_TOOL',
  payload: id
});

// Workflow action creators
export const addWorkflow = (workflow: Workflow): AppAction => ({
  type: 'ADD_WORKFLOW',
  payload: workflow
});

export const updateWorkflow = (id: string, updates: Partial<Workflow>): AppAction => ({
  type: 'UPDATE_WORKFLOW',
  payload: { id, updates }
});

export const deleteWorkflow = (id: string): AppAction => ({
  type: 'DELETE_WORKFLOW',
  payload: id
});

// Task action creators
export const addTask = (task: Task): AppAction => ({
  type: 'ADD_TASK',
  payload: task
});

export const updateTask = (id: string, updates: Partial<Task>): AppAction => ({
  type: 'UPDATE_TASK',
  payload: { id, updates }
});

export const deleteTask = (id: string): AppAction => ({
  type: 'DELETE_TASK',
  payload: id
});

export const completeTask = (id: string): AppAction => ({
  type: 'COMPLETE_TASK',
  payload: id
});

export const failTask = (id: string): AppAction => ({
  type: 'FAIL_TASK',
  payload: id
});

export const retryTask = (id: string): AppAction => ({
  type: 'RETRY_TASK',
  payload: id
});

// Event action creators
export const addTaskEvent = (event: TaskEvent): AppAction => ({
  type: 'ADD_TASK_EVENT',
  payload: event
});

export const addHumanInputRequest = (request: HumanInputRequest): AppAction => ({
  type: 'ADD_HUMAN_INPUT_REQUEST',
  payload: request
});

export const respondToHumanInput = (id: string, response: string): AppAction => ({
  type: 'RESPOND_TO_HUMAN_INPUT',
  payload: { id, response }
});

// Member action creators
export const addMember = (member: Member): AppAction => ({
  type: 'ADD_MEMBER',
  payload: member
});

export const updateMember = (id: string, updates: Partial<Member>): AppAction => ({
  type: 'UPDATE_MEMBER',
  payload: { id, updates }
});

export const deleteMember = (id: string): AppAction => ({
  type: 'DELETE_MEMBER',
  payload: id
});

// Webhook action creators
export const addWebhookEvent = (event: WebhookEvent): AppAction => ({
  type: 'ADD_WEBHOOK_EVENT',
  payload: event
});

export const updateWebhookEvent = (id: string, updates: Partial<WebhookEvent>): AppAction => ({
  type: 'UPDATE_WEBHOOK_EVENT',
  payload: { id, updates }
});

export const deleteWebhookEvent = (id: string): AppAction => ({
  type: 'DELETE_WEBHOOK_EVENT',
  payload: id
});

// Playground action creators
export const addPlayground = (playground: Playground): AppAction => ({
  type: 'ADD_PLAYGROUND',
  payload: playground
});

export const updatePlayground = (id: string, updates: Partial<Playground>): AppAction => ({
  type: 'UPDATE_PLAYGROUND',
  payload: { id, updates }
});

export const deletePlayground = (id: string): AppAction => ({
  type: 'DELETE_PLAYGROUND',
  payload: id
});

// History action creators
export const addHistoryEntry = (entry: HistoryEntry): AppAction => ({
  type: 'ADD_HISTORY_ENTRY',
  payload: entry
});

// System action creators
export const updateSystemMetrics = (metrics: Partial<any>): AppAction => ({
  type: 'UPDATE_SYSTEM_METRICS',
  payload: metrics
});

export const startSimulation = (): AppAction => ({
  type: 'START_SIMULATION'
});

export const stopSimulation = (): AppAction => ({
  type: 'STOP_SIMULATION'
});

export const pauseSimulation = (): AppAction => ({
  type: 'PAUSE_SIMULATION'
});

// UI action creators
export const setCurrentView = (view: string): AppAction => ({
  type: 'SET_CURRENT_VIEW',
  payload: view
});

export const setSelectedOrganization = (id: string): AppAction => ({
  type: 'SET_SELECTED_ORGANIZATION',
  payload: id
});

export const setSelectedAgent = (id: string): AppAction => ({
  type: 'SET_SELECTED_AGENT',
  payload: id
});

export const setSearchQuery = (query: string): AppAction => ({
  type: 'SET_SEARCH_QUERY',
  payload: query
});

export const setFilters = (filters: any): AppAction => ({
  type: 'SET_FILTERS',
  payload: filters
});

export const resetFilters = (): AppAction => ({
  type: 'RESET_FILTERS'
});

// Bulk action creators
export const loadInitialData = (data: any): AppAction => ({
  type: 'LOAD_INITIAL_DATA',
  payload: data
});

export const resetState = (): AppAction => ({
  type: 'RESET_STATE'
});