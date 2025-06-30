import { Organization, Agent, Tool, TaskEvent, SystemMetric } from '../types';

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Tech Innovators Inc.',
    description: 'Leading technology innovation company',
    status: 'active',
    workflows: 12,
    agents: 35,
    tasks: 245,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Global Solutions Ltd.',
    description: 'Worldwide business solutions provider',
    status: 'active',
    workflows: 8,
    agents: 20,
    tasks: 180,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Creative Minds Co.',
    description: 'Creative agency and design studio',
    status: 'active',
    workflows: 15,
    agents: 40,
    tasks: 320,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '4',
    name: 'Dynamic Systems Corp.',
    description: 'Enterprise software solutions',
    status: 'active',
    workflows: 10,
    agents: 25,
    tasks: 210,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: '5',
    name: 'Strategic Ventures LLC',
    description: 'Investment and consulting firm',
    status: 'active',
    workflows: 7,
    agents: 18,
    tasks: 150,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
];

export const mockAgents: Agent[] = [
  {
    id: '123456790',
    name: 'Agent 1',
    description: 'This is a test agent',
    model: 'GPT-4',
    status: 'active',
    organization: 'Organization 1',
    version: '1.0',
    createdAt: new Date('2023-01-01T12:00:00'),
    lastUpdatedAt: new Date('2023-01-01T12:00:00')
  }
];

export const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Tool 1',
    description: 'Description of tool 1',
    category: 'productivity',
    icon: '📊'
  },
  {
    id: '2',
    name: 'Tool 2',
    description: 'Description of tool 2',
    category: 'communication',
    icon: '💬'
  },
  {
    id: '3',
    name: 'Tool 3',
    description: 'Description of tool 3',
    category: 'analysis',
    icon: '📈'
  },
  {
    id: '4',
    name: 'Tool 4',
    description: 'Description of tool 4',
    category: 'automation',
    icon: '⚙️'
  },
  {
    id: '5',
    name: 'Tool 5',
    description: 'Description of tool 5',
    category: 'integration',
    icon: '🔗'
  },
  {
    id: '6',
    name: 'Tool 6',
    description: 'Description of tool 6',
    category: 'monitoring',
    icon: '📊'
  }
];

export const mockTaskEvents: TaskEvent[] = [
  {
    id: '1',
    type: 'completed',
    title: 'Task completed for Tech Innovators Inc.',
    organization: 'Tech Innovators Inc.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: 'CheckCircle'
  },
  {
    id: '2',
    type: 'assigned',
    title: 'New task assigned to agent at Global Solutions Ltd.',
    organization: 'Global Solutions Ltd.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    icon: 'PlusCircle'
  },
  {
    id: '3',
    type: 'started',
    title: 'Workflow started for Creative Minds Co.',
    organization: 'Creative Minds Co.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: 'PlayCircle'
  },
  {
    id: '4',
    type: 'agent-added',
    title: 'Agent added to Dynamic Systems Corp.',
    organization: 'Dynamic Systems Corp.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    icon: 'UserPlus'
  },
  {
    id: '5',
    type: 'updated',
    title: 'Task updated for Strategic Ventures LLC',
    organization: 'Strategic Ventures LLC',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    icon: 'Pencil'
  }
];

export const systemHealthMetrics: SystemMetric[] = [
  { label: 'Uptime', value: '99.9%' },
  { label: 'Response Time', value: '250ms' }
];

export const agentStatsMetrics: SystemMetric[] = [
  { label: 'Active Agents', value: '120' },
  { label: 'Tasks Completed', value: '540' },
  { label: 'Average Rating', value: '4.8' }
];