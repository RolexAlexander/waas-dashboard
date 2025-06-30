import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { OrgConfig, Task, TaskStatus, EnvironmentState, Conversation, Event, Mail } from '../../types';
import { LLMService } from '../llmService';
import { Agent } from './Agent';
import { Environment } from './Environment';
import { MailSystem } from './MailSystem';
import { ConversationManager } from './ConversationManager';
import { WorkflowManager } from './WorkflowManager';

export class Orchestrator {
  private agents: Map<string, Agent> = new Map();
  private environments: Map<string, Environment> = new Map();
  public mailSystem: MailSystem;
  public conversationManager: ConversationManager;
  public workflowManager: WorkflowManager;
  private tasks: Map<string, Task> = new Map();
  private updateTasks: (tasks: Task[]) => void;
  private updateEnvironments: (environments: Record<string, EnvironmentState>) => void;
  private updateConversations: (conversations: Conversation[]) => void;
  private addEvent: (event: Event) => void;

  constructor(
    orgConfig: OrgConfig,
    updateTasks: (tasks: Task[]) => void,
    updateEnvironments: (environments: Record<string, EnvironmentState>) => void,
    updateConversations: (conversations: Conversation[]) => void,
    addEvent: (event: Event) => void,
    llmService: LLMService
  ) {
    this.updateTasks = updateTasks;
    this.updateEnvironments = updateEnvironments;
    this.updateConversations = updateConversations;
    this.addEvent = addEvent;

    this.mailSystem = new MailSystem((mail: Mail) => {
      // Mail logging is handled by the store
    });

    this.conversationManager = new ConversationManager(
      this.mailSystem,
      (id: string) => this.getTaskById(id),
      (task: Task) => this.updateTask(task),
      this.updateConversations
    );

    this.workflowManager = new WorkflowManager(orgConfig.sopLibrary || []);

    this.initializeFromConfig(orgConfig, llmService);
  }

  private initializeFromConfig(orgConfig: OrgConfig, llmService: LLMService) {
    // Initialize environments
    orgConfig.environments.forEach(envConfig => {
      const env = new Environment(envConfig, this);
      this.environments.set(envConfig.id, env);
    });

    // Initialize agents recursively
    const initAgent = (agentConfig: any, manager?: Agent) => {
      const agent = new Agent(agentConfig, llmService, this);
      this.agents.set(agentConfig.name, agent);
      this.mailSystem.register(agentConfig.name, (mail) => agent.receiveMail(mail));

      if (manager) {
        agent.setManager(manager);
        manager.addSubordinate(agent);
      }

      const env = this.environments.get(agentConfig.environmentId);
      if (env) {
        agent.setEnvironment(env);
      }

      if (agentConfig.subordinates) {
        agentConfig.subordinates.forEach((sub: any) => initAgent(sub, agent));
      }
    };

    initAgent(orgConfig.masterAgent);

    // Update initial environment states
    const envStates: Record<string, EnvironmentState> = {};
    this.environments.forEach((env, id) => {
      envStates[id] = env.getState();
    });
    this.updateEnvironments(envStates);
  }

  async runGoal(goal: string): Promise<void> {
    const masterAgent = Array.from(this.agents.values()).find(agent => !agent.manager);
    if (!masterAgent) {
      throw new Error('No master agent found');
    }

    const initialTask: Task = {
      id: uuidv4(),
      goal,
      originalGoal: goal,
      status: TaskStatus.PENDING,
      assignee: masterAgent.name,
      issuer: 'System',
      history: [{
        status: TaskStatus.PENDING,
        timestamp: Date.now(),
        message: `Task created: ${goal}`
      }],
      subTaskIds: [],
      dependencies: [],
      retries: 0
    };

    this.tasks.set(initialTask.id, initialTask);
    this.updateTasks(Array.from(this.tasks.values()));

    this.dispatchTask(initialTask.id);
  }

  createTask(taskData: {
    goal: string;
    assignee: string;
    issuer: string;
    status: TaskStatus;
  }): Task {
    const task: Task = {
      id: uuidv4(),
      originalGoal: taskData.goal,
      ...taskData,
      history: [{
        status: taskData.status,
        timestamp: Date.now(),
        message: `Task created and assigned to ${taskData.assignee}`
      }],
      subTaskIds: [],
      dependencies: [],
      retries: 0
    };

    this.tasks.set(task.id, task);
    this.updateTasks(Array.from(this.tasks.values()));
    return task;
  }

  dispatchTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const agent = this.agents.get(task.assignee!);
    if (agent) {
      agent.receiveMail({
        id: uuidv4(),
        from: 'System',
        to: task.assignee!,
        subject: 'NEW_TASK',
        body: task,
        timestamp: Date.now()
      });
    }
  }

  updateTask(updatedTask: Task): void {
    this.tasks.set(updatedTask.id, updatedTask);
    this.updateTasks(Array.from(this.tasks.values()));
  }

  updateTaskDependencies(taskId: string, dependencies: string[]): void {
    const task = this.tasks.get(taskId);
    if (task) {
      const updatedTask = produce(task, draft => {
        draft.dependencies = dependencies;
      });
      this.updateTask(updatedTask);
    }
  }

  updateTaskGoal(taskId: string, newGoal: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      const updatedTask = produce(task, draft => {
        draft.goal = newGoal;
      });
      this.updateTask(updatedTask);
    }
  }

  retryTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      const updatedTask = produce(task, draft => {
        draft.status = TaskStatus.PENDING;
        draft.retries += 1;
        draft.history.push({
          status: TaskStatus.PENDING,
          timestamp: Date.now(),
          message: `Task retry #${draft.retries}`
        });
      });
      this.updateTask(updatedTask);
      this.dispatchTask(taskId);
    }
  }

  getTaskById(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  async getTasksByIds(taskIds: string[]): Promise<Task[]> {
    return taskIds.map(id => this.tasks.get(id)).filter(Boolean) as Task[];
  }

  updateEnvironmentState(envId: string, newState: EnvironmentState): void {
    const env = this.environments.get(envId);
    if (env) {
      env.setState(newState);
      
      const envStates: Record<string, EnvironmentState> = {};
      this.environments.forEach((environment, id) => {
        envStates[id] = environment.getState();
      });
      this.updateEnvironments(envStates);
    }
  }

  broadcastEvent(event: Event, sourceAgent: Agent, sourceEnvironment: Environment): void {
    this.addEvent(event);
    
    // Notify all agents in the same environment
    this.agents.forEach(agent => {
      if (agent.environment === sourceEnvironment && agent !== sourceAgent) {
        agent.receiveMail({
          id: uuidv4(),
          from: 'System',
          to: agent.name,
          subject: 'ENVIRONMENT_EVENT',
          body: event,
          timestamp: Date.now()
        });
      }
    });
  }

  reset(): void {
    this.agents.clear();
    this.environments.clear();
    this.tasks.clear();
    this.mailSystem.reset();
    this.conversationManager.reset();
  }
}