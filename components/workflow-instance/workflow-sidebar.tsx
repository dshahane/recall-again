'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid } from 'lucide-react';
import { WorkflowInstanceStep } from './steps/workflow-instance-step';

interface WorkflowSidebarProps {
  steps: { id: string; name: string; type: string; }[];
  activeStep: string | null;
  onStepClick: (stepId: string) => void;
  stepStatus: { [key: string]: 'not-run' | 'in-progress' | 'executed' | 'failed'; };
}

/**
 * Renders the compact sidebar with workflow steps.
 */
export function WorkflowSidebar({ steps, activeStep, onStepClick, stepStatus }: WorkflowSidebarProps) {
  return (
      <aside className="w-16 border-r border-gray-200 p-2 flex flex-col items-center space-y-4 bg-white text-gray-800">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                <LayoutGrid className="h-6 w-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white text-gray-800 p-4 rounded-md shadow-lg">
              <h4 className="font-bold text-lg mb-2">All Workflow Steps</h4>
              <ul className="space-y-1">
                {steps.map((step) => (
                    <li key={step.id} className="text-sm">
                  <span className={`font-semibold ${stepStatus[step.id] === 'executed' ? 'text-green-500' : 'text-gray-500'}`}>
                    {steps.findIndex(s => s.id === step.id) + 1}. {step.name}
                  </span>
                    </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="space-y-4">
          {steps.map((step, index) => (
              <WorkflowInstanceStep
                  key={step.id}
                  step={step}
                  index={index}
                  status={stepStatus[step.id]}
                  isActive={activeStep === step.id}
                  onClick={onStepClick}
              />
          ))}
        </div>
      </aside>
  );
}
