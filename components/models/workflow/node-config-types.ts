import {
    AlarmClock,
    Bot,
    Code,
    Columns4,
    Database,
    FileText,
    GitBranch,
    LayoutDashboard,
    Lightbulb,
    MessageSquare,
    PlaySquare,
    Repeat,
    Rocket,
    Split,
    Table,
    Timer,
    Wand
} from 'lucide-react';
import React from "react";
import {NodeKind, PortName,} from './types';
import {PortConfig} from "@/components/models/workflow/port-config-types";

// Map each NodeKind to its properties
const COMMON_COLORS = {
    trigger: 'bg-green-100 dark:bg-green-800',
    model: 'bg-purple-100 dark:bg-purple-800',
    input: 'bg-blue-100 dark:bg-blue-800',
    sink: 'bg-yellow-100 dark:bg-yellow-800',
    flowControl: 'bg-orange-100 dark:bg-orange-800',
};

interface NodeMeta {
    icon: React.ElementType;
    color: string;
    portConfig: PortConfig;
    portLabels: () => ({ in: string[], out: string[] });
};

export const NODE_METADATA: Record<NodeKind, NodeMeta> = {
    // Triggers
    [NodeKind.QueryTrigger]:
        { icon: PlaySquare, color: COMMON_COLORS.trigger, portConfig: PortConfig.OUT, portLabels: () => ({ in: [], out: ["out"] }) },
    [NodeKind.DocumentTrigger]:
        { icon: FileText, color: COMMON_COLORS.trigger, portConfig: PortConfig.OUT, portLabels: () => ({ in: [], out: ["out"] }) },
    [NodeKind.SessionTrigger]:
        { icon: MessageSquare, color: COMMON_COLORS.trigger, portConfig: PortConfig.OUT, portLabels: () => ({ in: [], out: ["out"] }) },
    [NodeKind.TimerTrigger]:
        { icon: AlarmClock, color: COMMON_COLORS.trigger, portConfig: PortConfig.OUT, portLabels: () => ({ in: [], out: ["out"] }) },

    // Models
    [NodeKind.Llm]:
        { icon: Bot, color: COMMON_COLORS.model, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Classifier]:
        { icon: Bot, color: COMMON_COLORS.model, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Regressor]:
        { icon: Bot, color: COMMON_COLORS.model, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Ranker]:
        { icon: Bot, color: COMMON_COLORS.model, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.IntentDetection]:
        { icon: Lightbulb, color: COMMON_COLORS.model, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },

    // Inputs & Specialized
    [NodeKind.Context]:
        { icon: Database, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Variables]:
        { icon: Code, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Api]:
        { icon: Rocket, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Table]:
        { icon: Table, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Transformation]:
        { icon: Wand, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Catalog]:
        { icon: Columns4, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Reviews]:
        { icon: Columns4, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Sql]:
        { icon: Columns4, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Sparql]:
        { icon: Columns4, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Sheet]:
        { icon: Columns4, color: COMMON_COLORS.input, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },

    // Sinks
    [NodeKind.ContextSink]:
        { icon: Database, color: COMMON_COLORS.sink, portConfig: PortConfig.IN, portLabels: () => ({ in: ["in"], out: [] }) },
    [NodeKind.VisualizationSink]:
        { icon: LayoutDashboard, color: COMMON_COLORS.sink, portConfig: PortConfig.IN, portLabels: () => ({ in: ["in"], out: [] }) },
    [NodeKind.ApiSink]:
        { icon: Table, color: COMMON_COLORS.sink, portConfig: PortConfig.IN, portLabels: () => ({ in: ["in"], out: [] }) },

    // Flow Control
    [NodeKind.Loop]:
        { icon: Repeat, color: COMMON_COLORS.flowControl, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
    [NodeKind.Condition]:
        { icon: Split, color: COMMON_COLORS.flowControl, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out", "try"] }) },
    [NodeKind.TryCatch]:
        { icon: GitBranch, color: COMMON_COLORS.flowControl, portConfig: PortConfig.TRY_CATCH, portLabels: () => ({ in: ["try", "in"], out: ["catch"] }) },
    [NodeKind.Delay]:
        { icon: Timer, color: COMMON_COLORS.flowControl, portConfig: PortConfig.IN_AND_OUT, portLabels: () => ({ in: ["in"], out: ["out"] }) },
};

export const getNodeMetadata = (kind: NodeKind) => {
    return NODE_METADATA[kind] || { icon: null, color: 'bg-gray-100', portPositions: () => ({}), portLabels: () => "" };
};

export const isTriggerNode = (kind: NodeKind): boolean => {
    return [NodeKind.QueryTrigger, NodeKind.SessionTrigger, NodeKind.DocumentTrigger, NodeKind.TimerTrigger].includes(kind);
};

export const isSinkNode = (kind: NodeKind): boolean => {
    return [NodeKind.ApiSink, NodeKind.VisualizationSink, NodeKind.ContextSink].includes(kind);
};