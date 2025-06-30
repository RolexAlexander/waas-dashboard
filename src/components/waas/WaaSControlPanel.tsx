import React, { useState } from 'react';
import AgentNode from './AgentNode';
import { Lightbulb, BarChart3, Trash2 } from 'lucide-react';
import { useWaaSStore } from '../../store/waasStore';
import DemoSelector from './DemoSelector';

const WaaSControlPanel: React.FC = () => {
  const [goal, setGoal] = useState("Create a short, three-chapter children's storybook about a brave mouse who learns to fly.");
  const { 
    orgConfig, 
    isSimulating, 
    simulationCompleted, 
    thinkingAgentId, 
    startSimulation, 
    resetSimulation,
    toggleAnalytics,
    clearPersistentState 
  } = useWaaSStore(state => ({
      orgConfig: state.orgConfig,
      isSimulating: state.isSimulating,
      simulationCompleted: state.simulationCompleted,
      thinkingAgentId: state.thinkingAgentId,
      startSimulation: state.startSimulation,
      resetSimulation: state.resetSimulation,
      toggleAnalytics: state.toggleAnalytics,
      clearPersistentState: state.clearPersistentState
  }));

  const handleStart = () => {
    if (goal.trim() && !isSimulating) {
      startSimulation(goal);
    }
  };
  
  return (
    <div className="w-1/3 min-w-[500px] h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white">Organization Structure</h2>
        <p className="text-sm text-slate-400">Agents and their reporting lines.</p>
        <DemoSelector />
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {orgConfig && <AgentNode agentConfig={orgConfig.masterAgent} isMaster isThinking={thinkingAgentId === orgConfig.masterAgent.name} thinkingAgentId={thinkingAgentId} />}
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <h3 className="font-bold text-white mb-2">Set a Goal</h3>
        <div className="flex flex-col gap-3">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Write a short book about a magical cat."
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            rows={3}
            disabled={isSimulating}
          />
          
          {!isSimulating && !simulationCompleted && (
            <button
              onClick={handleStart}
              disabled={!goal.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-5 h-5"/>
              Start Simulation
            </button>
          )}

          {(isSimulating || simulationCompleted) && (
            <button
              onClick={resetSimulation}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Reset Simulation
            </button>
          )}

          {simulationCompleted && (
              <button
                onClick={toggleAnalytics}
                className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors"
              >
                <BarChart3 className="w-5 h-5"/>
                View Analytics Report
              </button>
          )}

          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
            <button
              onClick={clearPersistentState}
              className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-red-200 rounded-lg transition-colors text-sm py-2 px-4"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaaSControlPanel;