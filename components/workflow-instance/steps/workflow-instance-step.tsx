import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkflowStepProps {
  step: { id: string; name: string; };
  index: number;
  status: 'not-run' | 'in-progress' | 'executed' | 'failed';
  isActive: boolean;
  onClick: (stepId: string) => void;
}

const statusColors = {
  'not-run': 'bg-gray-400',
  'in-progress': 'bg-yellow-500 animate-pulse',
  'executed': 'bg-green-500',
  'failed': 'bg-red-500',
};

export function WorkflowInstanceStep({ step, index, status, isActive, onClick }: WorkflowStepProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`relative h-8 w-8 rounded-full flex items-center justify-center font-semibold text-lg
          transition-colors duration-200 ease-in-out cursor-pointer
          ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'}
          `}
          onClick={() => onClick(step.id)}
        >
          {index + 1}
          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${statusColors[status]} ring-2 ring-white`} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{step.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
