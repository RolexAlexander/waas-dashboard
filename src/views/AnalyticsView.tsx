import React from 'react';
import { useWaaSStore } from '../store/waasStore';
import { TaskStatus } from '../types';
import { TrendingUp, Clock, DollarSign, Users, Activity, Download, BarChart3, PieChart, Calendar, Filter } from 'lucide-react';

export function AnalyticsView() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [dateRange, setDateRange] = React.useState('7d');
  const [selectedOrg, setSelectedOrg] = React.useState('all');

  const { getAllOrganizations, getAllTasks, getOrganizationStats } = useWaaSStore();
  const organizations = getAllOrganizations();
  const allTasks = getAllTasks();

  // Filter tasks based on date range
  const getFilteredTasks = () => {
    const now = Date.now();
    const ranges = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = now - ranges[dateRange as keyof typeof ranges];
    return allTasks.filter(task => {
      const taskTime = task.history[0]?.timestamp || 0;
      const matchesDate = taskTime >= cutoff;
      const matchesOrg = selectedOrg === 'all' || task.organizationId === selectedOrg;
      return matchesDate && matchesOrg;
    });
  };

  const filteredTasks = getFilteredTasks();

  // Calculate metrics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === TaskStatus.COMPLETED);
  const failedTasks = filteredTasks.filter(t => t.status === TaskStatus.FAILED);
  const inProgressTasks = filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  
  const successRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  const totalCost = completedTasks.reduce((sum, task) => sum + (task.result?.cost || 0), 0);
  const avgTaskDuration = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => {
        const start = task.history[0]?.timestamp || 0;
        const end = task.history[task.history.length - 1]?.timestamp || 0;
        return sum + (end - start);
      }, 0) / completedTasks.length / 1000 / 60 // Convert to minutes
    : 0;

  // Task status distribution
  const statusDistribution = [
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'Failed', value: failedTasks.length, color: '#ef4444' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#3b82f6' },
    { name: 'Other', value: totalTasks - completedTasks.length - failedTasks.length - inProgressTasks.length, color: '#6b7280' }
  ].filter(item => item.value > 0);

  // Organization performance
  const orgPerformance = organizations.map(org => {
    const orgTasks = filteredTasks.filter(t => t.organizationId === org.name);
    const orgCompleted = orgTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const orgCost = orgCompleted.reduce((sum, task) => sum + (task.result?.cost || 0), 0);
    
    return {
      name: org.name,
      totalTasks: orgTasks.length,
      completedTasks: orgCompleted.length,
      successRate: orgTasks.length > 0 ? (orgCompleted.length / orgTasks.length) * 100 : 0,
      totalCost: orgCost,
      agents: org.agents
    };
  }).filter(org => org.totalTasks > 0);

  // Daily task completion over time
  const getDailyStats = () => {
    const days = parseInt(dateRange.replace('d', ''));
    const dailyStats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const dayTasks = filteredTasks.filter(task => {
        const taskTime = task.history[0]?.timestamp || 0;
        return taskTime >= dayStart && taskTime < dayEnd;
      });
      
      const dayCompleted = dayTasks.filter(t => t.status === TaskStatus.COMPLETED);
      const dayCost = dayCompleted.reduce((sum, task) => sum + (task.result?.cost || 0), 0);
      
      dailyStats.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: dayTasks.length,
        completed: dayCompleted.length,
        cost: dayCost
      });
    }
    
    return dailyStats;
  };

  const dailyStats = getDailyStats();

  const exportReport = (format: 'csv' | 'json') => {
    const reportData = {
      summary: {
        totalTasks,
        completedTasks: completedTasks.length,
        failedTasks: failedTasks.length,
        successRate: successRate.toFixed(2),
        totalCost: totalCost.toFixed(2),
        avgTaskDuration: avgTaskDuration.toFixed(2)
      },
      organizationPerformance: orgPerformance,
      dailyStats,
      generatedAt: new Date().toISOString(),
      dateRange,
      selectedOrganization: selectedOrg
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waas-report-${dateRange}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV format
      const csvRows = [
        ['Metric', 'Value'],
        ['Total Tasks', totalTasks],
        ['Completed Tasks', completedTasks.length],
        ['Failed Tasks', failedTasks.length],
        ['Success Rate (%)', successRate.toFixed(2)],
        ['Total Cost ($)', totalCost.toFixed(2)],
        ['Avg Task Duration (min)', avgTaskDuration.toFixed(2)]
      ];
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waas-report-${dateRange}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Analytics & Reports</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Analyze performance, costs, and efficiency across your autonomous workforce
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => exportReport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => exportReport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 border-b border-[#d4dce2]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d4dce2] px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'costs', label: 'Costs', icon: DollarSign },
            { id: 'organizations', label: 'Organizations', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0c7ff2] text-[#0c7ff2]'
                    : 'border-transparent text-[#5c748a] hover:text-[#101518]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#5c748a] text-sm font-medium">Total Tasks</h3>
                    <Activity className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-[#101518] text-2xl font-bold">{totalTasks}</p>
                  <p className="text-[#5c748a] text-xs mt-1">Last {dateRange}</p>
                </div>

                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#5c748a] text-sm font-medium">Success Rate</h3>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-[#101518] text-2xl font-bold">{successRate.toFixed(1)}%</p>
                  <p className="text-[#5c748a] text-xs mt-1">{completedTasks.length} completed</p>
                </div>

                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#5c748a] text-sm font-medium">Total Cost</h3>
                    <DollarSign className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-[#101518] text-2xl font-bold">${totalCost.toFixed(2)}</p>
                  <p className="text-[#5c748a] text-xs mt-1">Avg: ${completedTasks.length > 0 ? (totalCost / completedTasks.length).toFixed(2) : '0.00'} per task</p>
                </div>

                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#5c748a] text-sm font-medium">Avg Duration</h3>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-[#101518] text-2xl font-bold">{avgTaskDuration.toFixed(0)}m</p>
                  <p className="text-[#5c748a] text-xs mt-1">Per completed task</p>
                </div>
              </div>

              {/* Task Status Distribution */}
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Task Status Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {statusDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#101518] font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#101518] font-semibold">{item.value}</span>
                          <span className="text-[#5c748a] text-sm ml-2">
                            ({totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        {statusDistribution.map((item, index) => {
                          const percentage = totalTasks > 0 ? (item.value / totalTasks) * 100 : 0;
                          const offset = statusDistribution.slice(0, index).reduce((sum, prev) => 
                            sum + (totalTasks > 0 ? (prev.value / totalTasks) * 100 : 0), 0
                          );
                          return (
                            <path
                              key={index}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={item.color}
                              strokeWidth="2"
                              strokeDasharray={`${percentage} ${100 - percentage}`}
                              strokeDashoffset={-offset}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Activity Chart */}
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Daily Activity</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {dailyStats.map((day, index) => {
                    const maxTasks = Math.max(...dailyStats.map(d => d.tasks));
                    const height = maxTasks > 0 ? (day.tasks / maxTasks) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center mb-2">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${height}%`, minHeight: day.tasks > 0 ? '4px' : '0' }}
                            title={`${day.tasks} tasks, ${day.completed} completed, $${day.cost.toFixed(2)}`}
                          />
                        </div>
                        <span className="text-xs text-[#5c748a] text-center">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{successRate.toFixed(1)}%</div>
                    <div className="text-[#5c748a] text-sm">Overall Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{avgTaskDuration.toFixed(0)}m</div>
                    <div className="text-[#5c748a] text-sm">Average Task Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{failedTasks.length}</div>
                    <div className="text-[#5c748a] text-sm">Failed Tasks</div>
                  </div>
                </div>
              </div>

              {/* Performance by Organization */}
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Performance by Organization</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#d4dce2]">
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Organization</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Total Tasks</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Completed</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Success Rate</th>
                        <th className="text-left py-3 px-4 text-[#5c748a] font-medium">Agents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgPerformance.map((org, index) => (
                        <tr key={index} className="border-b border-[#d4dce2] last:border-b-0">
                          <td className="py-3 px-4 text-[#101518] font-medium">{org.name}</td>
                          <td className="py-3 px-4 text-[#101518]">{org.totalTasks}</td>
                          <td className="py-3 px-4 text-[#101518]">{org.completedTasks}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              org.successRate >= 80 ? 'bg-green-100 text-green-800' :
                              org.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {org.successRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#101518]">{org.agents}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <h3 className="text-[#5c748a] text-sm font-medium mb-2">Total Cost</h3>
                  <p className="text-[#101518] text-2xl font-bold">${totalCost.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <h3 className="text-[#5c748a] text-sm font-medium mb-2">Average Cost per Task</h3>
                  <p className="text-[#101518] text-2xl font-bold">
                    ${completedTasks.length > 0 ? (totalCost / completedTasks.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                  <h3 className="text-[#5c748a] text-sm font-medium mb-2">Cost per Organization</h3>
                  <p className="text-[#101518] text-2xl font-bold">
                    ${orgPerformance.length > 0 ? (totalCost / orgPerformance.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Cost by Organization */}
              <div className="bg-white rounded-lg border border-[#d4dce2] p-6">
                <h3 className="text-[#101518] text-lg font-semibold mb-4">Cost Breakdown by Organization</h3>
                <div className="space-y-4">
                  {orgPerformance.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-[#101518] font-medium">{org.name}</h4>
                        <p className="text-[#5c748a] text-sm">{org.completedTasks} completed tasks</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#101518] font-semibold">${org.totalCost.toFixed(2)}</p>
                        <p className="text-[#5c748a] text-sm">
                          ${org.completedTasks > 0 ? (org.totalCost / org.completedTasks).toFixed(2) : '0.00'} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgPerformance.map((org, index) => (
                  <div key={index} className="bg-white rounded-lg border border-[#d4dce2] p-6">
                    <h3 className="text-[#101518] font-semibold mb-4">{org.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#5c748a]">Total Tasks</span>
                        <span className="text-[#101518] font-medium">{org.totalTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c748a]">Completed</span>
                        <span className="text-[#101518] font-medium">{org.completedTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c748a]">Success Rate</span>
                        <span className="text-[#101518] font-medium">{org.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c748a]">Total Cost</span>
                        <span className="text-[#101518] font-medium">${org.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c748a]">Agents</span>
                        <span className="text-[#101518] font-medium">{org.agents}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}