'use client';

import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {FormWidget} from "../widgets/form-widget";
import {ChatWidget} from "../widgets/chat-widget";
import {VisualizationWidget} from "../widgets/visualization-widget";
import {MarkdownWidget} from "../widgets/markdown-widget";
import {TableWidget} from "../widgets/table-widget";
import {
  FileText,
  Pin,
  PinOff,
  Minimize2,
  Maximize2,
  XIcon
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// --- Type Definitions ---
interface FormInputData {
  fields: { id: string; label: string; type: string; value: any; options?: string[] }[];
}

interface ChatInputData {
  message: string;
}

interface VisualizationInputData {
  message: string;
}

interface ChatOutputData {
  chat_history: { role: string; message: string }[];
}

interface VisualizationOutputData {
  chart_data: { name: string; value: number }[];
  metrics: { accuracy: number; f1_score: number; loss: number };
}

interface MarkdownData {
  content: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface WidgetData {
  widgetType: string;
  data: FormInputData | ChatInputData | VisualizationInputData | ChatOutputData | VisualizationOutputData | MarkdownData | TableData;
  context?: { text: string };
  error?: { message: string };
}

interface StepContent {
  input?: WidgetData;
  output?: WidgetData;
  context?: { text: string };
}

interface WorkingAreaTabProps {
  activeStep: string | null;
  stepResults: { [key: string]: StepContent | null };
}

// --- Widget Component Map ---
const widgetMap: { [key: string]: React.FC<any> } = {
  form: FormWidget,
  chat: ChatWidget,
  visualization: VisualizationWidget,
  markdown: MarkdownWidget,
  table: TableWidget
};

// --- Working Area Tab Component ---
export function WorkingAreaTab({ activeStep, stepResults }: WorkingAreaTabProps) {
  const [isContextVisible, setIsContextVisible] = useState(false);
  const [isContextPinned, setIsContextPinned] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [panelSizes, setPanelSizes] = useState<number[]>([100, 0]);

  useEffect(() => {
    if (!isContextVisible) {
      setPanelSizes([100, 0]);
    } else if (isContextPinned) {
      setPanelSizes([50, 50]);
    } else {
      setPanelSizes([70, 30]);
    }
  }, [isContextVisible, isContextPinned]);

  const stepResult: StepContent | null = useMemo(() => {
    return stepResults[activeStep || ''] || null;
  }, [activeStep, stepResults]);


  const renderWidget = (widgetInfo: WidgetData) => {
    const WidgetComponent = widgetMap[widgetInfo.widgetType];
    if (WidgetComponent) {
      return <WidgetComponent data={widgetInfo.data} />;
    }
    return <div className="text-gray-500">No widget found for type: {widgetInfo.widgetType}</div>;
  };

  if (!activeStep) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-xl">Select a step from the sidebar to view its working area.</p>
        </div>
    );
  }

  if (!stepResult) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-xl">Loading...</p>
        </div>
    );
  }

  const inputWidgetInfo = stepResult.input || null;
  const outputWidgetInfo = stepResult.output || null;

  return (
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch" onResize={(sizes) => setPanelSizes(sizes)}>
        <ResizablePanel size={panelSizes[0]} minSize={isContextPinned ? 50 : 30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel size={isInputExpanded ? 100 : 50} minSize={isInputExpanded ? 100 : 50}>
              <div className="flex flex-col h-full p-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Input</h3>
                  <div className="flex space-x-2">
                    <Button
                        onClick={() => setIsContextVisible(!isContextVisible)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-gray-600"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => setIsInputExpanded(!isInputExpanded)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-gray-600"
                    >
                      {isInputExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 p-2 bg-gray-100 rounded-md overflow-y-auto" style={{minHeight: 0}}>
                  {inputWidgetInfo ? renderWidget(inputWidgetInfo) : <div className="text-gray-500">No input data.</div>}
                </div>
              </div>
            </ResizablePanel>
            {!isInputExpanded && !isOutputExpanded && <ResizableHandle />}
            <ResizablePanel size={isOutputExpanded ? 100 : 50} minSize={isOutputExpanded ? 100 : 50}>
              <div className="flex flex-col h-full p-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Output</h3>
                  <div className="flex space-x-2">
                    <Button
                        onClick={() => setIsContextVisible(!isContextVisible)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-gray-600"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => setIsOutputExpanded(!isOutputExpanded)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-gray-600"
                    >
                      {isOutputExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 p-2 bg-gray-100 rounded-md overflow-y-auto" style={{minHeight: 0}}>
                  {outputWidgetInfo ? renderWidget(outputWidgetInfo) : <div className="text-gray-500">No output data.</div>}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
            size={panelSizes[1]}
            minSize={isContextVisible ? (isContextPinned ? 30 : 20) : 0}
            collapsible={true}
            className={`transition-all duration-300 ease-in-out ${isContextVisible ? '' : 'hidden'}`}
        >
          <div className="h-full flex flex-col p-4 bg-gray-50 border-l border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Context</h3>
              <div className="flex space-x-2">
                <Button
                    onClick={() => setIsContextPinned(!isContextPinned)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                >
                  {isContextPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                <Button
                    onClick={() => setIsContextVisible(false)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-gray-600"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stepResult?.context?.text ? (
                  <p className="text-gray-700">{stepResult.context.text}</p>
              ) : (
                  <p className="text-gray-500">No context available for this step.</p>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
  );
}
