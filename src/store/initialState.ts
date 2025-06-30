import { AppState } from './types';

export const initialState: AppState = {
  organizations: [
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
  ],

  agents: [
    {
      id: '123456790',
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries and support requests',
      model: 'GPT-4',
      status: 'active',
      organization: '1',
      version: '1.0',
      createdAt: new Date('2023-01-01T12:00:00'),
      lastUpdatedAt: new Date('2023-01-01T12:00:00'),
      permissions: {
        manageWorkflows: false,
        accessReports: true,
        modifyStructure: false
      },
      tools: ['email', 'chat', 'knowledge-base']
    },
    {
      id: '123456791',
      name: 'Technical Expert',
      description: 'Provides technical expertise and solutions',
      model: 'GPT-4',
      status: 'active',
      organization: '1',
      version: '1.2',
      createdAt: new Date('2023-01-15T12:00:00'),
      lastUpdatedAt: new Date('2023-02-01T12:00:00'),
      permissions: {
        manageWorkflows: true,
        accessReports: true,
        modifyStructure: true
      },
      tools: ['code-analysis', 'documentation', 'debugging']
    },
    {
      id: '123456792',
      name: 'Manager',
      description: 'Oversees operations and coordinates teams',
      model: 'GPT-4',
      status: 'active',
      organization: '1',
      version: '1.1',
      createdAt: new Date('2023-01-10T12:00:00'),
      lastUpdatedAt: new Date('2023-01-20T12:00:00'),
      permissions: {
        manageWorkflows: true,
        accessReports: true,
        modifyStructure: true
      },
      tools: ['scheduling', 'reporting', 'communication']
    }
  ],

  tools: [
    {
      id: '1',
      name: 'Email Integration',
      description: 'Send and receive emails automatically',
      category: 'communication',
      icon: '📧',
      status: 'active'
    },
    {
      id: '2',
      name: 'Data Analytics',
      description: 'Analyze and visualize data patterns',
      category: 'analysis',
      icon: '📊',
      status: 'active'
    },
    {
      id: '3',
      name: 'Task Scheduler',
      description: 'Schedule and manage automated tasks',
      category: 'automation',
      icon: '⏰',
      status: 'active'
    },
    {
      id: '4',
      name: 'API Connector',
      description: 'Connect to external APIs and services',
      category: 'integration',
      icon: '🔗',
      status: 'active'
    },
    {
      id: '5',
      name: 'Document Generator',
      description: 'Generate documents and reports',
      category: 'productivity',
      icon: '📄',
      status: 'active'
    },
    {
      id: '6',
      name: 'System Monitor',
      description: 'Monitor system health and performance',
      category: 'monitoring',
      icon: '📈',
      status: 'active'
    }
  ],

  workflows: [
    {
      id: '1',
      name: 'Customer Support Workflow',
      description: 'Handle customer inquiries from start to resolution',
      organization: '1',
      status: 'active',
      steps: [
        {
          id: '1',
          name: 'Receive Inquiry',
          type: 'agent',
          agentId: '123456790',
          config: { priority: 'high' },
          order: 1
        },
        {
          id: '2',
          name: 'Analyze Issue',
          type: 'tool',
          toolId: '2',
          config: { analysisType: 'sentiment' },
          order: 2
        },
        {
          id: '3',
          name: 'Escalate if Needed',
          type: 'human',
          config: { condition: 'complex_issue' },
          order: 3
        }
      ],
      createdAt: new Date('2023-01-01T12:00:00'),
      lastUpdatedAt: new Date('2023-01-15T12:00:00')
    },
    {
      id: '2',
      name: 'Sales Lead Qualification',
      description: 'Qualify and process incoming sales leads',
      organization: '2',
      status: 'active',
      steps: [
        {
          id: '4',
          name: 'Initial Contact',
          type: 'agent',
          agentId: '123456791',
          config: { contactMethod: 'email' },
          order: 1
        },
        {
          id: '5',
          name: 'Lead Scoring',
          type: 'tool',
          toolId: '2',
          config: { scoringModel: 'advanced' },
          order: 2
        }
      ],
      createdAt: new Date('2023-01-05T12:00:00'),
      lastUpdatedAt: new Date('2023-01-20T12:00:00')
    }
  ],

  tasks: [
    {
      id: '1',
      title: 'Process customer inquiry #1234',
      description: 'Handle customer question about billing',
      assignedAgent: 'Customer Support Agent',
      organization: '1',
      workflow: '1',
      status: 'completed',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 60 * 1000),
      cost: 0.15,
      retries: 0
    },
    {
      id: '2',
      title: 'Escalate technical issue #5678',
      description: 'Complex technical problem requiring specialist attention',
      assignedAgent: 'Technical Expert',
      organization: '1',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      cost: 0.25,
      retries: 1
    },
    {
      id: '3',
      title: 'Generate customer report',
      description: 'Create summary report for customer interaction',
      assignedAgent: 'Manager',
      organization: '1',
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 60 * 1000),
      cost: 0.0,
      retries: 0
    }
  ],

  taskEvents: [
    {
      id: '1',
      type: 'completed',
      title: 'Task completed for Tech Innovators Inc.',
      organization: 'Tech Innovators Inc.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'CheckCircle',
      taskId: '1'
    },
    {
      id: '2',
      type: 'assigned',
      title: 'New task assigned to agent at Global Solutions Ltd.',
      organization: 'Global Solutions Ltd.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: 'PlusCircle',
      agentId: '123456791'
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
      icon: 'UserPlus',
      agentId: '123456792'
    },
    {
      id: '5',
      type: 'updated',
      title: 'Task updated for Strategic Ventures LLC',
      organization: 'Strategic Ventures LLC',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      icon: 'Pencil',
      taskId: '3'
    }
  ],

  humanInputRequests: [
    {
      id: '1',
      agentId: '123456792',
      taskId: '2',
      question: 'Should we offer a refund for this customer complaint?',
      context: 'Customer has experienced multiple service disruptions and is requesting compensation.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'pending'
    }
  ],

  members: [
    {
      id: '1',
      name: 'Ethan Harper',
      email: 'ethan.harper@email.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 days ago',
      organizationId: '1'
    },
    {
      id: '2',
      name: 'Ava Bennett',
      email: 'ava.bennett@email.com',
      role: 'Viewer',
      status: 'Active',
      lastActive: '1 week ago',
      organizationId: '1'
    },
    {
      id: '3',
      name: 'Liam Carter',
      email: 'liam.carter@email.com',
      role: 'Maintainer',
      status: 'Inactive',
      lastActive: 'Never',
      organizationId: '1'
    }
  ],

  webhookEvents: [
    {
      id: '1',
      type: 'Agent Assigned',
      description: 'Triggered when an agent is assigned to a workflow.',
      status: 'Active',
      organizationId: '1'
    },
    {
      id: '2',
      type: 'Workflow Started',
      description: 'Triggered when a workflow is started.',
      status: 'Active'
    },
    {
      id: '3',
      type: 'Workflow Completed',
      description: 'Triggered when a workflow is completed.',
      status: 'Inactive'
    }
  ],

  playgrounds: [
    {
      id: '1',
      name: 'Customer Service Test',
      organizationId: '1',
      agentId: '123456790',
      workflowId: '1',
      status: 'active',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ],

  history: [
    {
      id: '1',
      type: 'organization',
      entityId: '1',
      entityName: 'Tech Innovators Inc',
      action: 'updated',
      timestamp: new Date('2024-01-15T10:00:00'),
      changes: { description: 'Updated company description' }
    },
    {
      id: '2',
      type: 'agent',
      entityId: '123456790',
      entityName: 'Sarah',
      action: 'updated',
      timestamp: new Date('2024-01-14T15:00:00'),
      changes: { status: 'active' }
    },
    {
      id: '3',
      type: 'workflow',
      entityId: '1',
      entityName: 'Customer Support',
      action: 'updated',
      timestamp: new Date('2024-01-13T09:00:00'),
      changes: { steps: 'Added new step' }
    },
    {
      id: '4',
      type: 'tool',
      entityId: '1',
      entityName: 'Email Integration',
      action: 'updated',
      timestamp: new Date('2024-01-12T17:00:00'),
      changes: { status: 'active' }
    },
    {
      id: '5',
      type: 'organization',
      entityId: '1',
      entityName: 'Tech Innovators Inc',
      action: 'created',
      timestamp: new Date('2024-01-11T11:00:00')
    }
  ],

  systemMetrics: {
    uptime: '99.9%',
    responseTime: '250ms',
    activeAgents: 120,
    tasksCompleted: 540,
    averageRating: 4.8,
    totalCost: 1247.50
  },

  currentView: 'dashboard',
  selectedOrganization: undefined,
  selectedAgent: undefined,
  isSimulationRunning: false,

  filters: {
    organizationFilter: '',
    agentFilter: '',
    statusFilter: '',
    dateFilter: ''
  },

  searchQuery: ''
};