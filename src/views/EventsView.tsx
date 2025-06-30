import React from 'react';
import { WebhookEvent } from '../types';

export function EventsView() {
  const [activeTab, setActiveTab] = React.useState('webhooks');
  const [selectedAgent, setSelectedAgent] = React.useState('');

  const mockWebhookEvents: WebhookEvent[] = [
    {
      id: '1',
      type: 'Agent Assigned',
      description: 'Triggered when an agent is assigned to a workflow.',
      status: 'Active'
    },
    {
      id: '2',
      type: 'Workflow Started',
      description: 'Triggered when a workflow is started.',
      status: 'Active'
    },
    {
      id: '3',
      type: 'Workflow Completed',
      description: 'Triggered when a workflow is completed.',
      status: 'Inactive'
    }
  ];

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-80">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-gray-50 p-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-[#101518] text-base font-medium leading-normal">Acme Co</h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="text-[#101518]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.10Z" />
                  </svg>
                </div>
                <p className="text-[#101518] text-sm font-medium leading-normal">Overview</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="text-[#101518]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
                  </svg>
                </div>
                <p className="text-[#101518] text-sm font-medium leading-normal">Agents</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="text-[#101518]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z" />
                  </svg>
                </div>
                <p className="text-[#101518] text-sm font-medium leading-normal">Organizations</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="text-[#101518]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z" />
                  </svg>
                </div>
                <p className="text-[#101518] text-sm font-medium leading-normal">Workflows</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#eaedf1]">
                <div className="text-[#101518]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23Zm-90.08-42.91c-15.91-8.05-31.05-12.32-45.22-12.81l24.47-40.8A7.93,7.93,0,0,0,112,99.14V40h32V99.14a7.93,7.93,0,0,0,1.14,4.11L183.36,167C171.4,169.34,154.29,168.34,131.61,156.86Z" />
                  </svg>
                </div>
                <p className="text-[#101518] text-sm font-medium leading-normal">Events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">Events</p>
            <p className="text-[#5c748a] text-sm font-normal leading-normal">Configure external events and API hooks</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d4dce2] px-4">
          {[
            { id: 'webhooks', label: 'Webhooks' },
            { id: 'connections', label: 'Connections' },
            { id: 'llm-providers', label: 'LLM Providers' },
            { id: 'simulator', label: 'Simulator' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-[#dce8f3] text-[#101518]'
                  : 'border-b-transparent text-[#5c748a] hover:text-[#101518]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'webhooks' && (
          <div className="p-4">
            <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Webhook Listeners</h2>
            
            {/* Agent/Organization Selector */}
            <div className="mb-6">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-[#d4dce2] rounded-xl bg-gray-50 text-[#101518] focus:outline-none focus:border-[#d4dce2]"
                style={{
                  backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(92,116,138)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 15px center',
                  backgroundSize: '20px'
                }}
              >
                <option value="">Select an agent or organization</option>
                <option value="agent-1">Agent 1</option>
                <option value="organization-1">Organization 1</option>
              </select>
            </div>

            {/* Webhook Events Table */}
            <div className="overflow-hidden rounded-xl border border-[#d4dce2] bg-gray-50">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Event Type</th>
                    <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Description</th>
                    <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Status</th>
                    <th className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWebhookEvents.map((event) => (
                    <tr key={event.id} className="border-t border-t-[#d4dce2]">
                      <td className="h-[72px] px-4 py-2 text-[#101518] text-sm font-normal leading-normal">{event.type}</td>
                      <td className="h-[72px] px-4 py-2 text-[#5c748a] text-sm font-normal leading-normal">{event.description}</td>
                      <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <button className="text-[#0c7ff2] hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== 'webhooks' && (
          <div className="p-4">
            <div className="text-center py-16">
              <p className="text-[#5c748a] text-base font-normal leading-normal">
                {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} content coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}