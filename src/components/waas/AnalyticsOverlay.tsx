import React from 'react';
import { X, Clock, DollarSign, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useWaaSStore } from '../../store/waasStore';

export function AnalyticsOverlay() {
  const { metrics, toggleAnalytics } = useWaaSStore();

  if (!metrics) return null;

  const duration = metrics.endTime - metrics.startTime;
  const successRate = metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0;

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-[#d4dce2] rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101518]">Simulation Analytics</h2>
          <button
            onClick={toggleAnalytics}
            className="text-[#5c748a] hover:text-[#101518] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#0c7ff2]" />
              <span className="text-[#5c748a] text-sm">Duration</span>
            </div>
            <div className="text-[#101518] text-lg font-semibold">
              {formatDuration(duration)}
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[#5c748a] text-sm">Success Rate</span>
            </div>
            <div className="text-[#101518] text-lg font-semibold">
              {successRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-[#0c7ff2]" />
              <span className="text-[#5c748a] text-sm">API Calls</span>
            </div>
            <div className="text-[#101518] text-lg font-semibold">
              {metrics.apiCalls}
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-[#5c748a] text-sm">Errors</span>
            </div>
            <div className="text-[#101518] text-lg font-semibold">
              {metrics.apiErrors}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <h3 className="text-[#101518] font-medium mb-2">Total Tasks</h3>
            <div className="text-2xl font-bold text-[#0c7ff2]">{metrics.totalTasks}</div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <h3 className="text-[#101518] font-medium mb-2">Completed</h3>
            <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}</div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#d4dce2]">
            <h3 className="text-[#101518] font-medium mb-2">Failed</h3>
            <div className="text-2xl font-bold text-red-600">{metrics.failedTasks}</div>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={toggleAnalytics}
            className="bg-[#0c7ff2] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#0a6fd1] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}