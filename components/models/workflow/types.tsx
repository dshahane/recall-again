import { Vec2 } from '@/app/types/app'; // Or from a shared types file if you create one

export enum NodeKind {
    // Triggers
    QueryTrigger = "query",
    DocumentTrigger = "document",
    SessionTrigger = "session",
    TimerTrigger = "timer",

    // Intermediate nodes
    Transformation = "transformation",
    Llm = "llm",
    Classifier = "classifier",
    Regressor = "regressor",
    Ranker = "ranker",
    IntentDetection = "intent-detection",
    Context = "context",
    Loop = "loop",
    Condition = "condition",
    TryCatch = "trycatch",
    Delay = "delay",
    Variables = "variables",
    Api = "api",
    Table = "table",
    Catalog = "catalog",
    Reviews = "reviews",
    Sql = "sql",
    Sparql = "sparql",
    Sheet = "sheet",

    // Sinks
    ContextSink = "context-out",
    ApiSink = "api-out",
    VisualizationSink = "visualization",
}

export type AnyNode = {
    id: string;
    kind: NodeKind;
    name: string;
    pos: Vec2;
    config?: any;
};

export type PortName = "in" | "out" | "true" | "false" | "try" | "catch" | "out1" | "out2" | "out3";

export interface Edge {
    id: string;
    from: { nodeId: string; port: PortName; };
    to: { nodeId: string; port: PortName; };
    c1?: Vec2;
    c2?: Vec2;
}

export interface Workflow {
    startId?: string;
    nodes: AnyNode[];
    edges: Edge[];
}
