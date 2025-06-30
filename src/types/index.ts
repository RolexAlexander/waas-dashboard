export type ProjectStatus = 'completed' | 'failed' | 'in-progress' | 'draft';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  lastRun?: Date;
  metrics?: {
    completedTasks: number;
    totalCost: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
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
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface TaskEvent {
  id: string;
  type: 'completed' | 'assigned' | 'started' | 'agent-added' | 'updated';
  title: string;
  organization: string;
  timestamp: Date;
  icon: string;
}

export interface SystemMetric {
  label: string;
  value: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  cost: number;
}

export interface HumanInputRequest {
  id: string;
  agentId: string;
  question: string;
  context: string;
  timestamp: Date;
  response?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Viewer' | 'Maintainer';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface TaskState {
  id: string;
  agent: string;
  organization: string;
  project: string;
  state: string;
  toolUsed: string;
}