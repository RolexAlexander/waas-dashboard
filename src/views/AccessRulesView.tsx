import React from 'react';

export function AccessRulesView() {
  const [activeTab, setActiveTab] = React.useState('assignment-rules');

  const assignmentRules = [
    { assigner: 'Team Lead', assignee: 'Agent 1', workflow: 'Workflow A', action: 'Edit' },
    { assigner: 'Team Lead', assignee: 'Agent 2', workflow: 'Workflow B', action: 'Edit' },
    { assigner: 'Manager', assignee: 'Team Lead', workflow: 'Workflow C', action: 'Edit' }
  ];

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Access Rules</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal">
              Manage fine-grained access rules for your organization
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#cedbe8] px-4">
          {[
            { id: 'assignment-rules', label: 'Assignment Rules' },
            { id: 'tool-usage-rules', label: 'Tool Usage Rules' },
            { id: 'communication-rules', label: 'Communication Rules' },
            { id: 'access-control-policies', label: 'Access Control Policies' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0c7ff2] text-[#0c7ff2]'
                  : 'border-transparent text-[#49739c] hover:text-[#0d141c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'assignment-rules' && (
          <div className="p-4">
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Who can assign/delegate to whom</h2>
            
            <div className="overflow-hidden rounded-lg border border-[#cedbe8] bg-slate-50">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">Assigner</th>
                    <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">Assignee</th>
                    <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">Workflow</th>
                    <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentRules.map((rule, index) => (
                    <tr key={index} className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 text-[#0d141c] text-sm font-normal leading-normal">
                        {rule.assigner}
                      </td>
                      <td className="h-[72px] px-4 py-2 text-[#0d141c] text-sm font-normal leading-normal">
                        {rule.assignee}
                      </td>
                      <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <span className="text-[#0c7ff2] hover:underline cursor-pointer">{rule.workflow}</span>
                      </td>
                      <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                        <span className="text-[#0c7ff2] hover:underline cursor-pointer">{rule.action}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== 'assignment-rules' && (
          <div className="p-4">
            <div className="text-center py-16">
              <p className="text-[#49739c] text-base font-normal leading-normal">
                {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} content coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}