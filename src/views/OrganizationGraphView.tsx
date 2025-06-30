import React from 'react';

export function OrganizationGraphView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all-agents');
  const [timeTravel, setTimeTravel] = React.useState('2024-01-01');

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Organization Graph</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">
              Visualize agent relationships and communications within the organization.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-10 max-w-md">
            <div className="text-[#5c748a] flex border-none bg-[#eaedf1] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              placeholder="Search for agents or workflows"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-full placeholder:text-[#5c748a] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4">
          {[
            { id: 'all-agents', label: 'All Agents' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
            { id: 'high-load', label: 'High Load' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === filter.id
                  ? 'bg-[#eaedf1] text-[#101518]'
                  : 'text-[#5c748a] hover:text-[#101518] hover:bg-[#eaedf1]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Graph Visualization */}
        <div className="p-4">
          <div className="relative bg-gray-50 rounded-xl border border-[#d4dce2] aspect-[3/2] overflow-hidden">
            {/* Map placeholder */}
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover"
              style={{
                backgroundImage: `url("https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800")`
              }}
            />
            
            {/* Controls overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-[#101518] hover:bg-gray-50">
                <span className="text-lg font-bold">+</span>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-[#101518] hover:bg-gray-50">
                <span className="text-lg font-bold">−</span>
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-[#101518] hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Time Travel */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">Time Travel</h3>
            <span className="text-[#5c748a] text-sm font-normal leading-normal">{timeTravel}</span>
          </div>
          <div className="mt-4">
            <input
              type="range"
              min="2024-01-01"
              max="2024-12-31"
              value={timeTravel}
              onChange={(e) => setTimeTravel(e.target.value)}
              className="w-full h-2 bg-[#eaedf1] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}