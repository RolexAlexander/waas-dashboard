import React from 'react';
import { TaskState } from '../types';

export function LiveTaskExecutionView() {
  const [filters, setFilters] = React.useState({
    agent: '',
    organization: '',
    project: '',
    state: '',
    tool: '',
    timestamp: ''
  });

  const mockEventLog = [
    { event: 'Task started', timestamp: '2024-03-15 10:00:00' },
    { event: 'Task in progress', timestamp: '2024-03-15 10:05:00' },
    { event: 'Task completed', timestamp: '2024-03-15 10:10:00' },
    { event: 'Task failed', timestamp: '2024-03-15 10:15:00' },
    { event: 'Task retried', timestamp: '2024-03-15 10:20:00' }
  ];

  const mockTaskStates: TaskState[] = [
    {
      id: '12345',
      agent: 'Agent A',
      organization: 'Organization X',
      project: 'Project Alpha',
      state: 'Completed',
      toolUsed: 'Tool 1'
    },
    {
      id: '67890',
      agent: 'Agent B',
      organization: 'Organization Y',
      project: 'Project Beta',
      state: 'Failed',
      toolUsed: 'Tool 2'
    },
    {
      id: '11223',
      agent: 'Agent C',
      organization: 'Organization Z',
      project: 'Project Gamma',
      state: 'In Progress',
      toolUsed: 'Tool 3'
    },
    {
      id: '44556',
      agent: 'Agent D',
      organization: 'Organization X',
      project: 'Project Alpha',
      state: 'Pending',
      toolUsed: 'Tool 1'
    },
    {
      id: '77889',
      agent: 'Agent E',
      organization: 'Organization Y',
      project: 'Project Beta',
      state: 'Completed',
      toolUsed: 'Tool 2'
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getActionButton = (state: string) => {
    switch (state) {
      case 'Failed':
        return <button className="text-[#0c7ff2] hover:underline text-sm">Retry</button>;
      case 'In Progress':
        return <button className="text-[#0c7ff2] hover:underline text-sm">Escalate</button>;
      case 'Pending':
        return <button className="text-[#0c7ff2] hover:underline text-sm">Reassign</button>;
      default:
        return <button className="text-[#0c7ff2] hover:underline text-sm">Retry</button>;
    }
  };

  return (
    <div className="flex h-full">
      {/* Filters Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-[#d4dce2] p-4">
        <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Filters</h2>
        
        <div className="space-y-4">
          {[
            { key: 'agent', label: 'Select agent' },
            { key: 'organization', label: 'Select organization' },
            { key: 'project', label: 'Select project' },
            { key: 'state', label: 'Select state' },
            { key: 'tool', label: 'Select tool' }
          ].map((filter) => (
            <div key={filter.key}>
              <select
                value={filters[filter.key as keyof typeof filters]}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-[#d4dce2] rounded-lg bg-white text-[#101518] text-sm focus:outline-none focus:border-[#d4dce2]"
                style={{
                  backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(92,116,138)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="">{filter.label}</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
          ))}
          
          <div>
            <input
              type="text"
              placeholder="Select timestamp"
              value={filters.timestamp}
              onChange={(e) => handleFilterChange('timestamp', e.target.value)}
              className="w-full px-3 py-2 border border-[#d4dce2] rounded-lg bg-white text-[#101518] text-sm placeholder:text-[#5c748a] focus:outline-none focus:border-[#d4dce2]"
            />
          </div>
          
          <button className="w-full px-4 py-2 bg-[#dce8f3] text-[#101518] rounded-lg text-sm font-bold leading-normal tracking-[0.015em]">
            Apply
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-[#101518] tracking-light text-[32px] font-bold leading-tight mb-2">Live Task Execution</h1>
        </div>

        {/* Live Event Log */}
        <div className="mb-8">
          <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Live Event Log</h2>
          
          <div className="overflow-hidden rounded-xl border border-[#d4dce2] bg-gray-50">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Event</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {mockEventLog.map((event, index) => (
                  <tr key={index} className="border-t border-t-[#d4dce2]">
                    <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">{event.event}</td>
                    <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">{event.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task States */}
        <div>
          <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Task States</h2>
          
          <div className="overflow-hidden rounded-xl border border-[#d4dce2] bg-gray-50">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Task ID</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Agent</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Organization</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Project</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">State</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Tool Used</th>
                  <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTaskStates.map((task) => (
                  <tr key={task.id} className="border-t border-t-[#d4dce2]">
                    <td className="h-[72px] px-4 py-2 text-[#0c7ff2] text-sm font-normal leading-normal hover:underline cursor-pointer">{task.id}</td>
                    <td className="h-[72px] px-4 py-2 text-[#0c7ff2] text-sm font-normal leading-normal hover:underline cursor-pointer">{task.agent}</td>
                    <td className="h-[72px] px-4 py-2 text-[#0c7ff2] text-sm font-normal leading-normal hover:underline cursor-pointer">{task.organization}</td>
                    <td className="h-[72px] px-4 py-2 text-[#0c7ff2] text-sm font-normal leading-normal hover:underline cursor-pointer">{task.project}</td>
                    <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">{task.state}</td>
                    <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">{task.toolUsed}</td>
                    <td className="h-[72px] px-4 py-2">{getActionButton(task.state)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}