import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { appReducer } from './reducer';
import { initialState } from './initialState';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}

// Custom hooks for specific data
export function useOrganizations() {
  const { state } = useAppStore();
  return state.organizations;
}

export function useAgents() {
  const { state } = useAppStore();
  return state.agents;
}

export function useTools() {
  const { state } = useAppStore();
  return state.tools;
}

export function useWorkflows() {
  const { state } = useAppStore();
  return state.workflows;
}

export function useTasks() {
  const { state } = useAppStore();
  return state.tasks;
}

export function useTaskEvents() {
  const { state } = useAppStore();
  return state.taskEvents;
}

export function useHumanInputRequests() {
  const { state } = useAppStore();
  return state.humanInputRequests;
}

export function useMembers() {
  const { state } = useAppStore();
  return state.members;
}

export function useWebhookEvents() {
  const { state } = useAppStore();
  return state.webhookEvents;
}

export function usePlaygrounds() {
  const { state } = useAppStore();
  return state.playgrounds;
}

export function useHistory() {
  const { state } = useAppStore();
  return state.history;
}

export function useSystemMetrics() {
  const { state } = useAppStore();
  return state.systemMetrics;
}

export function useCurrentView() {
  const { state } = useAppStore();
  return state.currentView;
}

export function useSimulationState() {
  const { state } = useAppStore();
  return state.isSimulationRunning;
}

export function useFilters() {
  const { state } = useAppStore();
  return state.filters;
}

export function useSearchQuery() {
  const { state } = useAppStore();
  return state.searchQuery;
}