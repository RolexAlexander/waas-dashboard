// Utility functions for the global store

import { AppState, Task, Organization, Agent } from './types';

// Task utilities
export const generateTaskId = (): string => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateOrganizationId = (): string => {
  return `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAgentId = (): string => {
  return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Task simulation utilities
export const createRandomTask = (organizations: Organization[], agents: Agent[]): Task => {
  const taskTemplates = [
    {
      title: 'Process customer inquiry',
      description: 'Handle incoming customer support request',
      category: 'support'
    },
    {
      title: 'Analyze system performance',
      description: 'Review system metrics and identify bottlenecks',
      category: 'technical'
    },
    {
      title: 'Generate weekly report',
      description: 'Compile weekly performance and activity report',
      category: 'reporting'
    },
    {
      title: 'Update documentation',
      description: 'Review and update technical documentation',
      category: 'documentation'
    },
    {
      title: 'Quality assurance check',
      description: 'Perform quality checks on recent deliverables',
      category: 'qa'
    },
    {
      title: 'Data backup verification',
      description: 'Verify integrity of automated data backups',
      category: 'maintenance'
    },
    {
      title: 'Security audit',
      description: 'Conduct routine security assessment',
      category: 'security'
    },
    {
      title: 'Performance optimization',
      description: 'Optimize system performance based on metrics',
      category: 'optimization'
    }
  ];

  const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
  const organization = organizations[Math.floor(Math.random() * organizations.length)];
  const agent = agents[Math.floor(Math.random() * agents.length)];

  return {
    id: generateTaskId(),
    title: `${template.title} #${Math.floor(Math.random() * 9999) + 1000}`,
    description: template.description,
    assignedAgent: agent.name,
    organization: organization.id,
    status: 'pending',
    createdAt: new Date(),
    cost: Math.random() * 0.8 + 0.1, // Random cost between 0.1 and 0.9
    retries: 0
  };
};

// Time utilities
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Simulation utilities
export const simulateTaskProgress = (state: AppState): Partial<AppState> => {
  const updatedTasks = state.tasks.map(task => {
    if (task.status === 'pending' && Math.random() < 0.3) {
      // 30% chance to start a pending task
      return { ...task, status: 'in-progress' as const };
    } else if (task.status === 'in-progress' && Math.random() < 0.4) {
      // 40% chance to complete an in-progress task
      return { 
        ...task, 
        status: 'completed' as const, 
        completedAt: new Date(),
        cost: task.cost + (Math.random() * 0.2) // Add some additional cost
      };
    } else if (task.status === 'in-progress' && Math.random() < 0.05) {
      // 5% chance to fail an in-progress task
      return { ...task, status: 'failed' as const };
    }
    return task;
  });

  // Calculate updated metrics
  const completedTasks = updatedTasks.filter(task => task.status === 'completed');
  const totalCost = completedTasks.reduce((sum, task) => sum + task.cost, 0);

  return {
    tasks: updatedTasks,
    systemMetrics: {
      ...state.systemMetrics,
      tasksCompleted: completedTasks.length,
      totalCost: totalCost
    }
  };
};

// Validation utilities
export const validateTask = (task: Partial<Task>): string[] => {
  const errors: string[] = [];
  
  if (!task.title || task.title.trim().length === 0) {
    errors.push('Task title is required');
  }
  
  if (!task.description || task.description.trim().length === 0) {
    errors.push('Task description is required');
  }
  
  if (!task.assignedAgent || task.assignedAgent.trim().length === 0) {
    errors.push('Assigned agent is required');
  }
  
  if (!task.organization || task.organization.trim().length === 0) {
    errors.push('Organization is required');
  }
  
  if (task.cost !== undefined && (task.cost < 0 || task.cost > 100)) {
    errors.push('Task cost must be between 0 and 100');
  }
  
  return errors;
};

export const validateOrganization = (org: Partial<Organization>): string[] => {
  const errors: string[] = [];
  
  if (!org.name || org.name.trim().length === 0) {
    errors.push('Organization name is required');
  }
  
  if (!org.description || org.description.trim().length === 0) {
    errors.push('Organization description is required');
  }
  
  if (org.name && org.name.length > 100) {
    errors.push('Organization name must be less than 100 characters');
  }
  
  return errors;
};

// Data transformation utilities
export const transformTasksForChart = (tasks: Task[]) => {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Pending', value: statusCounts.pending || 0, color: '#fbbf24' },
    { name: 'In Progress', value: statusCounts['in-progress'] || 0, color: '#3b82f6' },
    { name: 'Completed', value: statusCounts.completed || 0, color: '#10b981' },
    { name: 'Failed', value: statusCounts.failed || 0, color: '#ef4444' }
  ];
};

export const transformCostDataForChart = (tasks: Task[]) => {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayTasks = completedTasks.filter(task => 
      task.completedAt && task.completedAt.toISOString().split('T')[0] === date
    );
    const totalCost = dayTasks.reduce((sum, task) => sum + task.cost, 0);
    
    return {
      date,
      cost: totalCost,
      tasks: dayTasks.length
    };
  });
};

// Local storage utilities
export const saveStateToLocalStorage = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify({
      ...state,
      // Convert dates to strings for serialization
      organizations: state.organizations.map(org => ({
        ...org,
        createdAt: org.createdAt.toISOString(),
        lastActivity: org.lastActivity?.toISOString()
      })),
      tasks: state.tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        completedAt: task.completedAt?.toISOString()
      })),
      taskEvents: state.taskEvents.map(event => ({
        ...event,
        timestamp: event.timestamp.toISOString()
      }))
    });
    localStorage.setItem('waas-app-state', serializedState);
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
};

export const loadStateFromLocalStorage = (): Partial<AppState> | null => {
  try {
    const serializedState = localStorage.getItem('waas-app-state');
    if (!serializedState) return null;
    
    const state = JSON.parse(serializedState);
    
    // Convert string dates back to Date objects
    return {
      ...state,
      organizations: state.organizations?.map((org: any) => ({
        ...org,
        createdAt: new Date(org.createdAt),
        lastActivity: org.lastActivity ? new Date(org.lastActivity) : undefined
      })),
      tasks: state.tasks?.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      })),
      taskEvents: state.taskEvents?.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }))
    };
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
};