'use client';

import React, {useEffect, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TooltipProvider} from "@/components/ui/tooltip";
import {LayoutDashboard} from 'lucide-react';
import {Node, ReactFlowProvider} from '@xyflow/react';
import {WorkflowInstanceStep} from './steps/workflow-instance-step';
import {WorkflowDiagram} from './tabs/workflow-diagram';
import WorkflowEditor from './tabs/workflow-editor';
import {WorkingAreaTab} from './tabs/working-area';
import {ResourcesTab} from './tabs/resources';
import {ConsoleTab} from './tabs/console';
import {WorkflowSidebar} from './workflow-sidebar';
import {Separator} from "@/components/ui/separator";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

// The API base URL is now correctly set to the port from your package.json
const API_BASE_URL = 'http://localhost:4021';

// --- Type Definitions for Data and State ---
interface WorkflowData {
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  nodes: Node[];
  name: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface TableRowData {
  id: string;
  value: string;
  status: string;
}

interface TableData {
  data: TableRowData[];
}

interface ChartData {
  chart_data: number[];
}

interface ModelMetrics {
  model_results: {
    accuracy: number;
    f1_score: number;
    loss: number;
  };
}

type StepStatus = {
  [key: string]: 'not-run' | 'in-progress' | 'executed' | 'failed';
};

type StepResults = {
  [key: string]: {
    input?: { widgetType: string; data?: any };
    output?: { widgetType: string; data?: any };
    context?: any;
  } | null;
};


// --- Main Widget Component ---
export function WorkflowInstanceWidget() {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [stepStatus, setStepStatus] = useState<StepStatus>({});
  const [stepResults, setStepResults] = useState<StepResults>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("working-area");
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workflow`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: WorkflowData = await response.json();
        setWorkflowData(data);

        const initialStatus: StepStatus = {};
        const initialResults: StepResults = {};
        data.steps.forEach(step => {
          initialStatus[step.id] = 'not-run';
          initialResults[step.id] = null;
        });
        setStepStatus(initialStatus);
        setStepResults(initialResults);

        setActiveStep(data.steps[0].id);

      } catch (error) {
        console.error("Failed to fetch workflow data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflow();
  }, []);

  const handleStepClick = async (stepId: string) => {
    setActiveStep(stepId);
    setStepStatus(prev => ({ ...prev, [stepId]: 'in-progress' }));

    try {
      // The API call is now correctly fetching the specific result by ID
      const response = await fetch(`${API_BASE_URL}/step_results/${stepId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch step results');
      }
      const result = await response.json();
      setStepResults(prev => ({ ...prev, [stepId]: result }));
      setStepStatus(prev => ({ ...prev, [stepId]: 'executed' }));
    } catch (error) {
      console.error(`Error running step ${stepId}:`, error);
      setStepStatus(prev => ({ ...prev, [stepId]: 'failed' }));
    }
  };

  if (isEditorOpen) {
    return <WorkflowEditor onBack={() => setIsEditorOpen(false)} />;
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-900">Loading workflow...</p>
        </div>
    );
  }

  if (!workflowData) {
    return (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-900">Failed to load workflow data.</p>
        </div>
    );
  }

  return (
      <TooltipProvider>
        <div className="flex h-screen w-full font-sans">
          <WorkflowSidebar
              steps={workflowData.steps}
              activeStep={activeStep}
              onStepClick={handleStepClick}
              stepStatus={stepStatus}
          />
          <main className="flex-1 flex flex-col">
            <Accordion type="single" collapsible defaultValue="diagram-accordion">
              <AccordionItem value="diagram-accordion">
                <AccordionTrigger className="p-4 border-b border-gray-200 bg-white">
                  <h2 className="text-xl font-bold text-gray-900">{workflowData.name}</h2>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex flex-col items-center">
                    <ReactFlowProvider>
                      <WorkflowDiagram initialNodes={workflowData.nodes} initialEdges={workflowData.edges} />
                    </ReactFlowProvider>
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors mt-4"
                    >
                      <LayoutDashboard className="inline-block mr-2" />
                      Edit Workflow
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex-1 p-4 flex flex-col bg-gray-50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex-col">
                <TabsList className="w-fit justify-start bg-gray-200 p-1 rounded-t-md">
                  <TabsTrigger value="working-area">Working Area</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                </TabsList>
                <TabsContent value="working-area" className="flex-1 mt-0 p-4 border rounded-b-md bg-white border-gray-200 overflow-y-auto">
                  <WorkingAreaTab activeStep={activeStep} stepResults={stepResults} />
                </TabsContent>
                <TabsContent value="resources" className="flex-1 mt-0 p-4 border rounded-b-md bg-white border-gray-200 overflow-y-auto">
                  <ResourcesTab />
                </TabsContent>
                <TabsContent value="console" className="flex-1 mt-0 p-4 border rounded-b-md bg-white border-gray-200 overflow-y-auto">
                  <ConsoleTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
  );
}
