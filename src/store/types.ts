// Global store types for WaaS application
export interface Organization {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  workflows: number;
  agents: number;
  tasks: number;
  createdAt: Date;
  lastActivity?: Date;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive';
  organization: string;
  version: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  permissions: {
    manageWorkflows: boolean;
    accessReports: boolean;
    modifyStructure: boolean;
  };
  tools: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  organization: string;
  status: 'active' | 'inactive' | 'draft';
  steps: WorkflowStep[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent' | 'tool' | 'human';
  agentId?: string;
  toolId?: string;
  config: Record<string, any>;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgent: string;
  organization: string;
  workflow?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  cost: number;
  retries: number;
}

export interface TaskEvent {
  id: string;
  type: 'completed' | 'assigned' | 'started' | 'agent-added' | 'updated' | 'failed';
  title: string;
  organization: string;
  timestamp: Date;
  icon: string;
  taskId?: string;
  agentId?: string;
}

export interface HumanInputRequest {
  id: string;
  agentId: string;
  taskId: string;
  question: string;
  context: string;
  timestamp: Date;
  response?: string;
  status: 'pending' | 'responded';
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Viewer' | 'Maintainer';
  status: 'Active' | 'Inactive';
  lastActive: string;
  organizationId: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  description: string;
  status: 'Active' | 'Inactive';
  organizationId?: string;
  agentId?: string;
}

export interface Playground {
  id: string;
  name: string;
  organizationId: string;
  agentId?: string;
  workflowId?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface HistoryEntry {
  id: string;
  type: 'organization' | 'agent' | 'workflow' | 'tool';
  entityId: string;
  entityName: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: Date;
  changes?: Record<string, any>;
}

export interface SystemMetrics {
  uptime: string;
  responseTime: string;
  activeAgents: number;
  tasksCompleted: number;
  averageRating: number;
  totalCost: number;
}

export interface AppState {
  // Core entities
  organizations: Organization[];
  agents: Agent[];
  tools: Tool[];
  workflows: Workflow[];
  tasks: Task[];
  
  // Events and activities
  taskEvents: TaskEvent[];
  humanInputRequests: HumanInputRequest[];
  
  // User management
  members: Member[];
  webhookEvents: WebhookEvent[];
  
  // Playground and experimentation
  playgrounds: Playground[];
  
  // History and audit
  history: HistoryEntry[];
  
  // System state
  systemMetrics: SystemMetrics;
  
  // UI state
  currentView: string;
  selectedOrganization?: string;
  selectedAgent?: string;
  isSimulationRunning: boolean;
  
  // Filters and search
  filters: {
    organizationFilter: string;
    agentFilter: string;
    statusFilter: string;
    dateFilter: string;
  };
  
  searchQuery: string;
}

export type AppAction =
  // Organization actions
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'UPDATE_ORGANIZATION'; payload: { id: string; updates: Partial<Organization> } }
  | { type: 'DELETE_ORGANIZATION'; payload: string }
  
  // Agent actions
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'UPDATE_AGENT'; payload: { id: string; updates: Partial<Agent> } }
  | { type: 'DELETE_AGENT'; payload: string }
  
  // Tool actions
  | { type: 'ADD_TOOL'; payload: Tool }
  | { type: 'UPDATE_TOOL'; payload: { id: string; updates: Partial<Tool> } }
  | { type: 'DELETE_TOOL'; payload: string }
  
  // Workflow actions
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: { id: string; updates: Partial<Workflow> } }
  | { type: 'DELETE_WORKFLOW'; payload: string }
  
  // Task actions
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'FAIL_TASK'; payload: string }
  | { type: 'RETRY_TASK'; payload: string }
  
  // Event actions
  | { type: 'ADD_TASK_EVENT'; payload: TaskEvent }
  | { type: 'ADD_HUMAN_INPUT_REQUEST'; payload: HumanInputRequest }
  | { type: 'RESPOND_TO_HUMAN_INPUT'; payload: { id: string; response: string } }
  
  // Member actions
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: { id: string; updates: Partial<Member> } }
  | { type: 'DELETE_MEMBER'; payload: string }
  
  // Webhook actions
  | { type: 'ADD_WEBHOOK_EVENT'; payload: WebhookEvent }
  | { type: 'UPDATE_WEBHOOK_EVENT'; payload: { id: string; updates: Partial<WebhookEvent> } }
  | { type: 'DELETE_WEBHOOK_EVENT'; payload: string }
  
  // Playground actions
  | { type: 'ADD_PLAYGROUND'; payload: Playground }
  | { type: 'UPDATE_PLAYGROUND'; payload: { id: string; updates: Partial<Playground> } }
  | { type: 'DELETE_PLAYGROUND'; payload: string }
  
  // History actions
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  
  // System actions
  | { type: 'UPDATE_SYSTEM_METRICS'; payload: Partial<SystemMetrics> }
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'PAUSE_SIMULATION' }
  
  // UI actions
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'SET_SELECTED_ORGANIZATION'; payload: string }
  | { type: 'SET_SELECTED_AGENT'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'RESET_FILTERS' }
  
  // Bulk actions
  | { type: 'LOAD_INITIAL_DATA'; payload: Partial<AppState> }
  | { type: 'RESET_STATE' };