import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { OrganizationsView } from './views/OrganizationsView';
import { AgentsView } from './views/AgentsView';
import { ToolsView } from './views/ToolsView';
import { BuildView } from './views/BuildView';
import { AccessRulesView } from './views/AccessRulesView';
import { AnalyticsView } from './views/AnalyticsView';
import { PlaygroundView } from './views/PlaygroundView';
import { SettingsView } from './views/SettingsView';
import { EventsView } from './views/EventsView';
import { OrganizationGraphView } from './views/OrganizationGraphView';
import { LiveTaskExecutionView } from './views/LiveTaskExecutionView';
import { WaaSSimulateView } from './views/WaaSSimulateView';
import { useAppStore } from './store/context';
import { BoltLogo } from './components/BoltLogo';

function App() {
  const { state, dispatch } = useAppStore();

  const handleViewChange = (view: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const renderCurrentView = () => {
    // If we're in WaaS mode, show the WaaS simulation view
    if (state.currentView === 'simulate') {
      return <WaaSSimulateView />;
    }
    
    switch (state.currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'organizations':
        return <OrganizationsView />;
      case 'agents':
        return <AgentsView />;
      case 'tools':
        return <ToolsView />;
      case 'workflows':
        return <BuildView />;
      case 'access-rules':
        return <AccessRulesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'playground':
        return <PlaygroundView />;
      case 'settings':
        return <SettingsView />;
      case 'events':
        return <EventsView />;
      case 'organization-graph':
        return <OrganizationGraphView />;
      case 'live-tasks':
        return <LiveTaskExecutionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <BoltLogo />
        <div className="layout-container flex h-full grow flex-col">
          <Header currentView={state.currentView} onViewChange={handleViewChange} />
          {renderCurrentView()}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;