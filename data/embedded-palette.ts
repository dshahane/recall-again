import { NodeKind } from '@/components/models/workflow/types';

export const PALETTE_DATA = [
    {
        label: "EMB Triggers",
        description: "Start a workflow with these nodes.",
        items: [
            { label: "Query", kind: NodeKind.QueryTrigger },
            { label: "Document", kind: NodeKind.DocumentTrigger },
            { label: "Session", kind: NodeKind.SessionTrigger },
        ]
    },
    {
        label: "EMB Models",
        description: "Connect to ML/LLM models.",
        items: [
            { label: "LLM", kind: NodeKind.Llm },
            { label: "Classifier", kind: NodeKind.Classifier },
            { label: "Regressor", kind: NodeKind.Regressor },
            { label: "Ranker", kind: NodeKind.Ranker },
            { label: "Intent Detection", kind: NodeKind.IntentDetection }
        ]
    },
    {
        label: "Additional Inputs",
        description: "Gather Additional Context",
        items: [
            { label: "API", kind: NodeKind.Api },
            { label: "Transformation", kind: NodeKind.Transformation },
            { label: "Context", kind: NodeKind.Context },
            { label: "Table", kind: NodeKind.Table },
            { label: "Variables", kind: NodeKind.Variables },
        ]
    },
    {
        label: "Flow Control",
        description: "Control execution flow",
        items: [
            { label: "Loop", kind: NodeKind.Loop },
            { label: "Condition", kind: NodeKind.Condition },
            { label: "Try/Catch", kind: NodeKind.TryCatch },
            { label: "Delay", kind: NodeKind.Delay }
        ]
    },
    {
        label: "Sinks",
        description: "Persist the output",
        items: [
            { label: "Context Out", kind: NodeKind.ContextSink },
            { label: "Visualization", kind: NodeKind.VisualizationSink },
            { label: "Table Out", kind: NodeKind.ApiSink }
        ]
    },
];