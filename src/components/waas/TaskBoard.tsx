import React from 'react';
import { Task, TaskStatus } from '../../types';
import { Clock, CheckCircle, XCircle, AlertCircle, User, Calendar, Play } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case TaskStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Play className="w-4 h-4 text-blue-500" />;
      case TaskStatus.BLOCKED:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case TaskStatus.AWAITING_INPUT:
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-50 border-green-200 text-green-800';
      case TaskStatus.FAILED:
        return 'bg-red-50 border-red-200 text-red-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case TaskStatus.BLOCKED:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case TaskStatus.AWAITING_INPUT:
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-[#5c748a] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[#101518] mb-2">No Tasks Yet</h3>
          <p className="text-[#5c748a]">Start a simulation to see tasks appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-[#d4dce2] rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-[#101518] font-medium mb-2 line-clamp-2">{task.goal}</h3>
                <div className="flex items-center gap-4 text-sm text-[#5c748a]">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{task.assignee || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTime(task.history[0]?.timestamp || Date.now())}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                {task.status.replace('_', ' ')}
              </span>
              {task.retries > 0 && (
                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  Retries: {task.retries}
                </span>
              )}
            </div>

            {/* Task Result */}
            {task.result && task.status === TaskStatus.COMPLETED && (
              <div className="mt-3 pt-3 border-t border-[#d4dce2]">
                <h4 className="text-xs font-medium text-[#5c748a] mb-2">Result</h4>
                <div className="text-xs text-[#101518] bg-[#f8fafc] p-2 rounded max-h-32 overflow-y-auto">
                  {typeof task.result === 'string' 
                    ? task.result 
                    : JSON.stringify(task.result, null, 2)
                  }
                </div>
              </div>
            )}

            {/* Task History */}
            {task.history.length > 1 && (
              <div className="mt-3 pt-3 border-t border-[#d4dce2]">
                <h4 className="text-xs font-medium text-[#5c748a] mb-2">Recent Updates</h4>
                <div className="space-y-1">
                  {task.history.slice(-2).map((entry, index) => (
                    <div key={index} className="text-xs text-[#5c748a]">
                      <span className="font-medium">{formatTime(entry.timestamp)}:</span> {entry.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}