import { AppState, AppAction } from './types';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Organization actions
    case 'ADD_ORGANIZATION':
      return {
        ...state,
        organizations: [...state.organizations, action.payload],
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'organization',
          entityId: action.payload.id,
          entityName: action.payload.name,
          action: 'created',
          timestamp: new Date()
        }]
      };

    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.map(org =>
          org.id === action.payload.id ? { ...org, ...action.payload.updates } : org
        ),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'organization',
          entityId: action.payload.id,
          entityName: state.organizations.find(o => o.id === action.payload.id)?.name || '',
          action: 'updated',
          timestamp: new Date(),
          changes: action.payload.updates
        }]
      };

    case 'DELETE_ORGANIZATION':
      const orgToDelete = state.organizations.find(o => o.id === action.payload);
      return {
        ...state,
        organizations: state.organizations.filter(org => org.id !== action.payload),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'organization',
          entityId: action.payload,
          entityName: orgToDelete?.name || '',
          action: 'deleted',
          timestamp: new Date()
        }]
      };

    // Agent actions
    case 'ADD_AGENT':
      return {
        ...state,
        agents: [...state.agents, action.payload],
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'agent',
          entityId: action.payload.id,
          entityName: action.payload.name,
          action: 'created',
          timestamp: new Date()
        }]
      };

    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id ? { ...agent, ...action.payload.updates } : agent
        ),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'agent',
          entityId: action.payload.id,
          entityName: state.agents.find(a => a.id === action.payload.id)?.name || '',
          action: 'updated',
          timestamp: new Date(),
          changes: action.payload.updates
        }]
      };

    case 'DELETE_AGENT':
      const agentToDelete = state.agents.find(a => a.id === action.payload);
      return {
        ...state,
        agents: state.agents.filter(agent => agent.id !== action.payload),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'agent',
          entityId: action.payload,
          entityName: agentToDelete?.name || '',
          action: 'deleted',
          timestamp: new Date()
        }]
      };

    // Tool actions
    case 'ADD_TOOL':
      return {
        ...state,
        tools: [...state.tools, action.payload],
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'tool',
          entityId: action.payload.id,
          entityName: action.payload.name,
          action: 'created',
          timestamp: new Date()
        }]
      };

    case 'UPDATE_TOOL':
      return {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload.id ? { ...tool, ...action.payload.updates } : tool
        ),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'tool',
          entityId: action.payload.id,
          entityName: state.tools.find(t => t.id === action.payload.id)?.name || '',
          action: 'updated',
          timestamp: new Date(),
          changes: action.payload.updates
        }]
      };

    case 'DELETE_TOOL':
      const toolToDelete = state.tools.find(t => t.id === action.payload);
      return {
        ...state,
        tools: state.tools.filter(tool => tool.id !== action.payload),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'tool',
          entityId: action.payload,
          entityName: toolToDelete?.name || '',
          action: 'deleted',
          timestamp: new Date()
        }]
      };

    // Workflow actions
    case 'ADD_WORKFLOW':
      return {
        ...state,
        workflows: [...state.workflows, action.payload],
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'workflow',
          entityId: action.payload.id,
          entityName: action.payload.name,
          action: 'created',
          timestamp: new Date()
        }]
      };

    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow =>
          workflow.id === action.payload.id ? { ...workflow, ...action.payload.updates } : workflow
        ),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'workflow',
          entityId: action.payload.id,
          entityName: state.workflows.find(w => w.id === action.payload.id)?.name || '',
          action: 'updated',
          timestamp: new Date(),
          changes: action.payload.updates
        }]
      };

    case 'DELETE_WORKFLOW':
      const workflowToDelete = state.workflows.find(w => w.id === action.payload);
      return {
        ...state,
        workflows: state.workflows.filter(workflow => workflow.id !== action.payload),
        history: [...state.history, {
          id: Date.now().toString(),
          type: 'workflow',
          entityId: action.payload,
          entityName: workflowToDelete?.name || '',
          action: 'deleted',
          timestamp: new Date()
        }]
      };

    // Task actions
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        taskEvents: [...state.taskEvents, {
          id: Date.now().toString(),
          type: 'assigned',
          title: `Task "${action.payload.title}" assigned to ${action.payload.assignedAgent}`,
          organization: action.payload.organization,
          timestamp: new Date(),
          icon: 'PlusCircle',
          taskId: action.payload.id,
          agentId: action.payload.assignedAgent
        }]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'COMPLETE_TASK':
      const completedTask = state.tasks.find(t => t.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload 
            ? { ...task, status: 'completed' as const, completedAt: new Date() }
            : task
        ),
        taskEvents: [...state.taskEvents, {
          id: Date.now().toString(),
          type: 'completed',
          title: `Task "${completedTask?.title}" completed`,
          organization: completedTask?.organization || '',
          timestamp: new Date(),
          icon: 'CheckCircle',
          taskId: action.payload
        }],
        systemMetrics: {
          ...state.systemMetrics,
          tasksCompleted: state.systemMetrics.tasksCompleted + 1,
          totalCost: state.systemMetrics.totalCost + (completedTask?.cost || 0)
        }
      };

    case 'FAIL_TASK':
      const failedTask = state.tasks.find(t => t.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload 
            ? { ...task, status: 'failed' as const }
            : task
        ),
        taskEvents: [...state.taskEvents, {
          id: Date.now().toString(),
          type: 'failed',
          title: `Task "${failedTask?.title}" failed`,
          organization: failedTask?.organization || '',
          timestamp: new Date(),
          icon: 'XCircle',
          taskId: action.payload
        }]
      };

    case 'RETRY_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload 
            ? { ...task, status: 'pending' as const, retries: task.retries + 1 }
            : task
        )
      };

    // Event actions
    case 'ADD_TASK_EVENT':
      return {
        ...state,
        taskEvents: [...state.taskEvents, action.payload]
      };

    case 'ADD_HUMAN_INPUT_REQUEST':
      return {
        ...state,
        humanInputRequests: [...state.humanInputRequests, action.payload]
      };

    case 'RESPOND_TO_HUMAN_INPUT':
      return {
        ...state,
        humanInputRequests: state.humanInputRequests.map(request =>
          request.id === action.payload.id 
            ? { ...request, response: action.payload.response, status: 'responded' as const }
            : request
        )
      };

    // Member actions
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload]
      };

    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.id ? { ...member, ...action.payload.updates } : member
        )
      };

    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload)
      };

    // Webhook actions
    case 'ADD_WEBHOOK_EVENT':
      return {
        ...state,
        webhookEvents: [...state.webhookEvents, action.payload]
      };

    case 'UPDATE_WEBHOOK_EVENT':
      return {
        ...state,
        webhookEvents: state.webhookEvents.map(event =>
          event.id === action.payload.id ? { ...event, ...action.payload.updates } : event
        )
      };

    case 'DELETE_WEBHOOK_EVENT':
      return {
        ...state,
        webhookEvents: state.webhookEvents.filter(event => event.id !== action.payload)
      };

    // Playground actions
    case 'ADD_PLAYGROUND':
      return {
        ...state,
        playgrounds: [...state.playgrounds, action.payload]
      };

    case 'UPDATE_PLAYGROUND':
      return {
        ...state,
        playgrounds: state.playgrounds.map(playground =>
          playground.id === action.payload.id ? { ...playground, ...action.payload.updates } : playground
        )
      };

    case 'DELETE_PLAYGROUND':
      return {
        ...state,
        playgrounds: state.playgrounds.filter(playground => playground.id !== action.payload)
      };

    // History actions
    case 'ADD_HISTORY_ENTRY':
      return {
        ...state,
        history: [...state.history, action.payload]
      };

    // System actions
    case 'UPDATE_SYSTEM_METRICS':
      return {
        ...state,
        systemMetrics: { ...state.systemMetrics, ...action.payload }
      };

    case 'START_SIMULATION':
      return {
        ...state,
        isSimulationRunning: true
      };

    case 'STOP_SIMULATION':
      return {
        ...state,
        isSimulationRunning: false
      };

    case 'PAUSE_SIMULATION':
      return {
        ...state,
        isSimulationRunning: false
      };

    // UI actions
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload
      };

    case 'SET_SELECTED_ORGANIZATION':
      return {
        ...state,
        selectedOrganization: action.payload
      };

    case 'SET_SELECTED_AGENT':
      return {
        ...state,
        selectedAgent: action.payload
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          organizationFilter: '',
          agentFilter: '',
          statusFilter: '',
          dateFilter: ''
        }
      };

    // Bulk actions
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        ...action.payload
      };

    case 'RESET_STATE':
      return {
        ...state,
        tasks: [],
        taskEvents: [],
        humanInputRequests: [],
        isSimulationRunning: false
      };

    default:
      return state;
  }
}