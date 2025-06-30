import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { OrgConfig, Task, Mail, View, TaskStatus, WaaSStore, WaaSState, HumanInputRequest, Conversation, EnvironmentState, Event, DemoKey } from '../types';
import { DEFAULT_ORG_CONFIG } from '../constants';
import { Orchestrator } from '../services/waas/Orchestrator';
import { LLMService } from '../services/llmService';
import { saveStateToDB, loadStateFromDB, clearStateFromDB } from '../services/db';
import { debounce } from '../utils';
import { demos } from '../demos/index';

let orchestrator: Orchestrator | null = null;
let llmService: LLMService | null = null;

const initialState: WaaSState = {
  orgConfig: DEFAULT_ORG_CONFIG,
  view: 'SIMULATE',
  tasks: [],
  logs: [],
  environments: {},
  events: [],
  conversations: [],
  isSimulating: false,
  simulationCompleted: false,
  thinkingAgentId: null,
  metrics: null,
  showAnalytics: false,
  humanInputQueue: [],
};

// Helper function to count agents in hierarchy
const countAgents = (agentConfig: any): number => {
  let count = 1;
  if (agentConfig.subordinates) {
    count += agentConfig.subordinates.reduce((sum: number, sub: any) => sum + countAgents(sub), 0);
  }
  return count;
};

// Helper function to get all organizations (demos + custom)
const getAllOrganizations = () => {
  const demoOrgs = Object.values(demos).map(demo => ({
    id: demo.name.toLowerCase().replace(/\s+/g, '-'),
    name: demo.name,
    description: `Demo organization showcasing ${demo.name} capabilities`,
    status: 'active' as const,
    agents: demo.masterAgent ? countAgents(demo.masterAgent) : 0,
    tasks: 0, // Will be calculated from actual task data
    totalCost: 0, // Will be calculated from actual task data
    createdAt: new Date(),
    lastActivity: new Date(),
    isDemo: true,
    config: demo
  }));

  // Add any custom organizations from localStorage
  const customOrgs = JSON.parse(localStorage.getItem('customOrganizations') || '[]');
  
  return [...demoOrgs, ...customOrgs];
};

// Helper function to get all tasks across all organizations
const getAllTasks = () => {
  const allTasks: Task[] = [];
  
  // Get tasks from current WaaS store
  const currentState = useWaaSStore.getState();
  allTasks.push(...currentState.tasks);
  
  // Get tasks from localStorage for other organizations
  const savedTasks = JSON.parse(localStorage.getItem('allOrganizationTasks') || '[]');
  allTasks.push(...savedTasks);
  
  return allTasks;
};

export const useWaaSStore = create<WaaSStore>((set, get) => ({
  ...initialState,

  setView: (view: View) => set({ view }),

  setOrgConfig: (config: OrgConfig) => set({ orgConfig: config }),

  toggleAnalytics: () => set(state => ({ showAnalytics: !state.showAnalytics })),

  resetSimulation: () => set({
    tasks: [],
    logs: [],
    environments: {},
    events: [],
    conversations: [],
    isSimulating: false,
    simulationCompleted: false,
    thinkingAgentId: null,
    metrics: null,
    showAnalytics: false,
    humanInputQueue: [],
  }),

  clearPersistentState: async () => {
    await clearStateFromDB();
    localStorage.removeItem('allOrganizationTasks');
    localStorage.removeItem('customOrganizations');
    window.location.reload();
  },

  setThinkingAgentId: (agentId: string | null) => set({ thinkingAgentId: agentId }),

  addLog: (log: Mail) => set(state => produce(state, draft => {
    draft.logs.push(log);
  })),

  addEvent: (event: Event) => set(state => produce(state, draft => {
    draft.events.push(event);
  })),
  
  updateEnvironments: (environments: Record<string, EnvironmentState>) => set({ environments }),
  
  updateConversations: (conversations: Conversation[]) => set({ conversations }),

  requestHumanInput: (request: Omit<HumanInputRequest, 'id'>) => {
    const newRequest = { ...request, id: uuidv4() };
    set(state => produce(state, draft => {
        draft.humanInputQueue.push(newRequest);
    }));
  },

  provideHumanInput: (requestId: string, response: string) => {
    const { humanInputQueue } = get();
    const request = humanInputQueue.find(r => r.id === requestId);
    if (!request || !orchestrator) return;

    // Remove request from the queue
    set(state => produce(state, draft => {
        draft.humanInputQueue = draft.humanInputQueue.filter(r => r.id !== requestId);
    }));

    // Find the task and resume it
    const task = orchestrator.getTaskById(request.taskId);
    if (task && task.status === TaskStatus.AWAITING_INPUT) {
        const lastQuestion = task.history.find(h => h.status === TaskStatus.AWAITING_INPUT)?.message || "Awaiting human input.";
        const updatedGoal = `My original goal was: "${task.originalGoal}". I requested human input with the question: "${lastQuestion}". The human provided this response: "${response}". I will now use this information to continue my original goal.`;

        const updatedTask = produce(task, draft => {
            draft.goal = updatedGoal;
            draft.status = TaskStatus.PENDING;
            draft.history.push({ status: TaskStatus.PENDING, timestamp: Date.now(), message: `Human input received. Resuming task.`});
        });

        orchestrator.updateTask(updatedTask);
        orchestrator.dispatchTask(task.id);
    }
  },

  updateTasks: (updatedTasks: Task[]) => {
    const state = get();
    
    // Save tasks to localStorage for persistence across organizations
    const allTasks = getAllTasks();
    const currentOrgTasks = updatedTasks.map(t => ({ ...t, organizationId: state.orgConfig.name }));
    const otherOrgTasks = allTasks.filter(t => t.organizationId !== state.orgConfig.name);
    const newAllTasks = [...otherOrgTasks, ...currentOrgTasks];
    localStorage.setItem('allOrganizationTasks', JSON.stringify(newAllTasks));
    
    if (!state.isSimulating) {
        const sortedTasks = updatedTasks.sort((a,b) => a.history[0].timestamp - b.history[0].timestamp);
        set({ tasks: sortedTasks });
        return;
    }

    const allDone = updatedTasks.length > 0 && updatedTasks.every(
      t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.FAILED
    );

    if (allDone) {
      const endTime = Date.now();
      const metrics = llmService!.getMetrics();
      const finalMetrics = {
        startTime: state.metrics?.startTime || Date.now(),
        endTime: endTime,
        totalTasks: updatedTasks.length,
        completedTasks: updatedTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
        failedTasks: updatedTasks.filter(t => t.status === TaskStatus.FAILED).length,
        apiCalls: metrics.successfulCalls,
        apiErrors: metrics.failedCalls,
      };
      
      set({
        tasks: updatedTasks.sort((a,b) => a.history[0].timestamp - b.history[0].timestamp),
        isSimulating: false,
        simulationCompleted: true,
        thinkingAgentId: null,
        metrics: finalMetrics,
        showAnalytics: true,
      });
    } else {
       set({ tasks: updatedTasks.sort((a,b) => a.history[0].timestamp - b.history[0].timestamp) });
    }
  },

  startSimulation: async (goal: string) => {
    const { orgConfig, resetSimulation, updateTasks, addLog, updateConversations, setThinkingAgentId, updateEnvironments, addEvent } = get();

    resetSimulation();
    set({ 
        isSimulating: true,
        metrics: { 
            startTime: Date.now(),
            endTime: 0,
            apiCalls: 0, apiErrors: 0, totalTasks: 0,
            completedTasks: 0, failedTasks: 0,
        }
    });

    // Get API key from environment
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('No Gemini API key found. Please set VITE_GEMINI_API_KEY in your environment.');
      set({ isSimulating: false });
      return;
    }

    llmService = new LLMService(apiKey, 50, setThinkingAgentId);

    orchestrator = new Orchestrator(
      orgConfig,
      updateTasks,
      updateEnvironments,
      updateConversations,
      addEvent,
      llmService
    );

    await orchestrator.runGoal(goal);
  },

  loadDemo: (demoKey: DemoKey) => {
    const { resetSimulation } = get();
    const selectedDemo = demos[demoKey];
    if (selectedDemo) {
        console.log(`Loading demo: ${selectedDemo.name}`);
        resetSimulation();
        set({
            orgConfig: selectedDemo,
        });
    }
  },

  // New helper functions for UI
  getAllOrganizations,
  getAllTasks,
  getOrganizationStats: (orgName: string) => {
    const allTasks = getAllTasks();
    const orgTasks = allTasks.filter(t => t.organizationId === orgName);
    const completedTasks = orgTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const totalCost = completedTasks.reduce((sum, task) => sum + (task.result?.cost || 0), 0);
    
    return {
      totalTasks: orgTasks.length,
      completedTasks: completedTasks.length,
      totalCost
    };
  },

  saveCustomOrganization: (org: any) => {
    const customOrgs = JSON.parse(localStorage.getItem('customOrganizations') || '[]');
    customOrgs.push(org);
    localStorage.setItem('customOrganizations', JSON.stringify(customOrgs));
  },
}));

// Function to save the current state to the database, debounced to avoid excessive writes.
const debouncedSave = debounce((state: WaaSState) => {
    saveStateToDB(state);
}, 1000);

const initializeStore = async () => {
    const savedState = await loadStateFromDB();
    if (savedState) {
        useWaaSStore.setState({ 
            ...savedState,
            isSimulating: false,
            thinkingAgentId: null,
            humanInputQueue: [],
            conversations: [],
        });
    }

    useWaaSStore.subscribe(state => {
        debouncedSave(state);
    });
};

initializeStore();