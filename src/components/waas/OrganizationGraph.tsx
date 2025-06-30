import React from 'react';
import { useWaaSStore } from '../../store/waasStore';

interface NodeProps {
  agent: any;
  x: number;
  y: number;
  isThinking: boolean;
  children?: React.ReactNode;
}

const Node: React.FC<NodeProps> = ({ agent, x, y, isThinking, children }) => {
  return (
    <div className="absolute" style={{ left: `${x}px`, top: `${y}px` }}>
      <div className={`relative bg-white border-2 rounded-lg p-4 w-64 shadow-md ${
        agent.role.name === 'Editor' || agent.role.name === 'Manager' || agent.role.name === 'Research Lead' || agent.role.name === 'Project Manager' || agent.role.name === 'Creative Director'
          ? 'border-blue-500'
          : 'border-gray-300'
      } ${isThinking ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}>
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{agent.name}</h3>
            <p className="text-xs text-gray-600">{agent.role.name}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

const OrganizationGraph: React.FC = () => {
  const { orgConfig, thinkingAgentId } = useWaaSStore();
  
  // Function to recursively render the organization hierarchy
  const renderHierarchy = (agent: any, level = 0, index = 0, parentX = 0, parentY = 0) => {
    const baseX = level === 0 ? 400 : parentX;
    const baseY = level === 0 ? 50 : parentY + 120;
    
    // Calculate x position based on number of siblings and current index
    const siblingCount = level === 0 ? 1 : agent.subordinates?.length || 0;
    const width = siblingCount * 300;
    const startX = baseX - width / 2;
    const x = level === 0 ? baseX : startX + (index * 300) + 150;
    
    const isThinking = thinkingAgentId === agent.name;
    
    return (
      <React.Fragment key={agent.id}>
        <Node agent={agent} x={x} y={baseY} isThinking={isThinking}>
          {agent.subordinates && agent.subordinates.length > 0 && (
            <div className="absolute left-1/2 top-full -translate-x-1/2">
              {/* Vertical line from parent to children */}
              <div className="w-0.5 h-10 bg-gray-300 mx-auto"></div>
              
              {/* Horizontal line connecting all children */}
              {agent.subordinates.length > 1 && (
                <div className="relative">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2" style={{ width: `${(agent.subordinates.length - 1) * 300}px`, height: '1px' }}>
                    <div className="w-full h-0.5 bg-gray-300"></div>
                  </div>
                </div>
              )}
              
              {/* Render children */}
              <div className="flex">
                {agent.subordinates.map((subordinate: any, i: number) => (
                  renderHierarchy(subordinate, level + 1, i, x, baseY)
                ))}
              </div>
            </div>
          )}
        </Node>
      </React.Fragment>
    );
  };

  return (
    <div className="relative w-full h-[500px] overflow-auto bg-gray-50 border border-gray-200 rounded-lg">
      <div className="absolute w-[1200px] h-[800px]">
        {orgConfig.masterAgent && renderHierarchy(orgConfig.masterAgent)}
      </div>
    </div>
  );
};

export default OrganizationGraph;