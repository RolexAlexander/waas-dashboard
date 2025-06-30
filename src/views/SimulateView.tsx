import React from 'react';
import { useWaaSStore } from '../store/waasStore';
import { ControlPanel } from '../components/waas/ControlPanel';
import { MainDisplay } from '../components/waas/MainDisplay';
import { AnalyticsOverlay } from '../components/waas/AnalyticsOverlay';
import { HumanInputPanel } from '../components/waas/HumanInputPanel';
import OrganizationGraph from '../components/waas/OrganizationGraph';
import { Users } from 'lucide-react';

export function SimulateView() {
  const { tasks, logs, conversations, environments, showAnalytics, events } = useWaaSStore(state => ({
    tasks: state.tasks,
    logs: state.logs,
    conversations: state.conversations,
    environments: state.environments,
    showAnalytics: state.showAnalytics,
    events: state.events,
  }));
  
  const [showOrgChart, setShowOrgChart] = React.useState(false);
  
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Simulation</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Run autonomous workforce simulations and monitor agent performance
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOrgChart(!showOrgChart)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              {showOrgChart ? 'Hide Organization Chart' : 'Show Organization Chart'}
            </button>
          </div>
        </div>

        {showOrgChart && (
          <div className="mb-4 p-4 bg-white rounded-xl border border-[#d4dce2]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Structure</h3>
            <OrganizationGraph />
          </div>
        )}

        <div className="flex flex-1 h-[calc(100vh-200px)] bg-white rounded-xl border border-[#d4dce2] overflow-hidden shadow-sm">
          <ControlPanel />
          <MainDisplay tasks={tasks} logs={logs} conversations={conversations} environments={environments} events={events} />
          {showAnalytics && <AnalyticsOverlay />}
          <HumanInputPanel />
        </div>
      </div>
    </div>
  );
}