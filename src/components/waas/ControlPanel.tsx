import React, { useState } from 'react';
import { Play, Square, BarChart3, Trash2, Users, Building2 } from 'lucide-react';
import { useWaaSStore } from '../../store/waasStore';
import { demos } from '../../demos';
import { DemoKey } from '../../types';

export function ControlPanel() {
  const [goalInput, setGoalInput] = useState('');
  const { 
    isSimulating, 
    simulationCompleted, 
    orgConfig, 
    startSimulation, 
    resetSimulation, 
    toggleAnalytics, 
    showAnalytics,
    loadDemo,
    clearPersistentState
  } = useWaaSStore();

  const handleStartSimulation = async () => {
    if (!goalInput.trim()) return;
    await startSimulation(goalInput);
  };

  const handleLoadDemo = (demoKey: DemoKey) => {
    loadDemo(demoKey);
    resetSimulation();
  };

  // Count agents in the organization hierarchy
  const countAgents = (agentConfig: any): number => {
    let count = 1; // Count the agent itself
    if (agentConfig.subordinates) {
      count += agentConfig.subordinates.reduce((sum: number, sub: any) => sum + countAgents(sub), 0);
    }
    return count;
  };

  const totalAgents = orgConfig.masterAgent ? countAgents(orgConfig.masterAgent) : 0;

  return (
    <div className="w-80 bg-[#f8fafc] border-r border-[#d4dce2] p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#101518] mb-2">Control Panel</h2>
        <p className="text-[#5c748a] text-sm">Configure and run simulations</p>
      </div>

      {/* Organization Info */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-[#d4dce2]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#0c7ff2] rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#101518] font-medium">Current Organization</h3>
          </div>
        </div>
        <p className="text-[#101518] text-sm font-medium">{orgConfig.name}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-[#5c748a]">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{totalAgents} agents</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{orgConfig.environments.length} environments</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{orgConfig.sopLibrary?.length || 0} SOPs</span>
          </div>
        </div>
      </div>

      {/* Demo Selection */}
      <div className="mb-6">
        <h3 className="text-[#101518] font-medium mb-3">Load Demo Organization</h3>
        <select
          onChange={(e) => handleLoadDemo(e.target.value as DemoKey)}
          className="w-full p-3 bg-white border border-[#d4dce2] rounded-lg focus:border-[#0c7ff2] focus:outline-none text-[#101518]"
          disabled={isSimulating}
          value={Object.keys(demos).find(key => demos[key as DemoKey].name === orgConfig.name) || ''}
        >
          <option value="">Select a demo...</option>
          {Object.entries(demos).map(([key, demo]) => (
            <option key={key} value={key}>
              {demo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Goal Input */}
      <div className="mb-6">
        <label className="block text-[#101518] font-medium mb-2">Simulation Goal</label>
        <textarea
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Enter your goal for the organization..."
          className="w-full p-3 bg-white text-[#101518] rounded-lg border border-[#d4dce2] focus:border-[#0c7ff2] focus:outline-none resize-none"
          rows={4}
          disabled={isSimulating}
        />
      </div>

      {/* Control Buttons */}
      <div className="space-y-3 mb-6">
        {!isSimulating && !simulationCompleted && (
          <button
            onClick={handleStartSimulation}
            disabled={!goalInput.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0c7ff2] hover:bg-[#0a6fd1] disabled:bg-[#d4dce2] disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            <Play className="w-4 h-4" />
            Start Simulation
          </button>
        )}

        {(isSimulating || simulationCompleted) && (
          <button
            onClick={resetSimulation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg transition-colors font-medium"
          >
            <Square className="w-4 h-4" />
            Reset Simulation
          </button>
        )}

        <button
          onClick={toggleAnalytics}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
            showAnalytics 
              ? 'bg-[#059669] hover:bg-[#047857] text-white' 
              : 'bg-white hover:bg-[#f1f5f9] text-[#5c748a] border border-[#d4dce2]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="mt-auto pt-6 border-t border-[#d4dce2]">
        <h3 className="text-[#dc2626] font-medium mb-3 text-sm">Danger Zone</h3>
        <button
          onClick={clearPersistentState}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] rounded-lg transition-colors text-sm border border-[#fecaca]"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>
    </div>
  );
}