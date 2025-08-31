import React from 'react';
import { Workflow } from 'lucide-react';

interface MLWorkflowIconProps {
  className?: string;
}

export function WorkflowInstanceIcon({ className }: MLWorkflowIconProps) {
  return <Workflow className={className} />;
}
