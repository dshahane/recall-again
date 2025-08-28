'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";

// Shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    PlusCircleIcon, TrashIcon, CircleDotIcon, CirclePlayIcon, SaveIcon, Loader2Icon, ChevronLeftIcon,
    CircleIcon, FilePlus2Icon, LinkIcon,
} from 'lucide-react';

// Dynamically import the Monaco Editor to ensure it's a client component
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// --- MOCK DATA FOR DEMONSTRATION ---
const initialSkills = [
    {
        id: 'skill-1',
        name: 'Query Analysis',
        description: 'An agent that translates natural language queries into structured data queries.',
        status: 'online',
        type: 'query-understanding',
        technicalInfo: 'pyscript/llama3.2',
        resources: [
            { id: 'res-script', name: 'main-script.py', type: 'pyscript', content: `# This is the main script for Query Analysis.\nprint("Query understanding script loaded.")` },
            { id: 'res-1', name: 'corporate-data.rdf', type: 'rdf', content: `# This is the corporate data.\n@prefix ex: <http://example.org/ontology/> .\n\nex:resource1 a ex:Document ;\n    ex:hasTitle "Annual Report" .` },
        ],
    },
    {
        id: 'skill-2',
        name: 'Sales Analytics',
        description: 'Generates reports on sales data using SPARQL.',
        status: 'draft',
        type: 'analytics',
        technicalInfo: 'sparql/db',
        resources: [
            { id: 'res-script', name: 'sales-reports.rq', type: 'sparql', content: `# This script generates sales reports.\nPREFIX sales: <http://example.org/sales#>\nSELECT ?product ?revenue\nWHERE {\n  ?s sales:product ?product ;\n     sales:revenue ?revenue .\n}` },
            { id: 'res-2', name: 'sales-data.rdf', type: 'rdf', content: `# This is the sales data.\n@prefix sales: <http://example.org/sales#> .\n\nsales:sale1 a sales:Sale ;\n    sales:product "Laptop" ;\n    sales:revenue 1200 .` },
        ],
    },
];

// Helper function to get Monaco language from file type
const getMonacoLanguage = (type) => {
    switch (type) {
        case 'pyscript':
            return 'python';
        case 'sparql':
            return 'sparql';
        case 'rdf':
            return 'turtle'; // Turtle is a common format for RDF, supported by Monaco
        default:
            return 'plaintext';
    }
};

// --- COMPONENTS ---

/**
 * The form for creating a new skill.
 * It's used within a Dialog component.
 */
function CreateSkillDialog({ onSkillCreate }) {
    const [skillName, setSkillName] = useState('');
    const [skillDescription, setSkillDescription] = useState('');
    const [skillType, setSkillType] = useState('query-understanding');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!skillName.trim()) {
            console.log("Skill name cannot be empty.");
            return;
        }
        const scriptFileType = skillType === 'query-understanding' || skillType === 'analytics' ? 'pyscript' : 'sparql';
        const scriptFileName = scriptFileType === 'pyscript' ? 'main-script.py' : 'main-query.rq';
        const newSkill = {
            id: `skill-${Date.now()}`,
            name: skillName,
            description: skillDescription,
            status: 'draft',
            type: skillType,
            technicalInfo: `${scriptFileType}/custom`,
            resources: [
                {
                    id: 'res-script',
                    name: scriptFileName,
                    type: scriptFileType,
                    content: `# Start your script here for ${skillName}.`,
                },
            ],
        };
        onSkillCreate(newSkill);
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center p-6 border-2 border-dashed hover:border-solid hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px] shadow-sm">
                    <Button variant="ghost" className="h-20 w-20 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground transition-colors">
                        <PlusCircleIcon className="w-16 h-16" />
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">Create New Skill</p>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Skill</DialogTitle>
                    <DialogDescription>
                        Choose a name and type for your new skill.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={skillName} onChange={(e) => setSkillName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" value={skillDescription} onChange={(e) => setSkillDescription(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="skill-type" className="text-right">Skill Type</Label>
                        <Select onValueChange={setSkillType} value={skillType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a skill type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="query-understanding">Query Understanding</SelectItem>
                                <SelectItem value="analytics">Analytics</SelectItem>
                                <SelectItem value="search-ranking">Search Ranking</SelectItem>
                                <SelectItem value="browser-use">Browser-Use</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Displays the grid of skill cards.
 */
function SkillGrid({ skills, onSelectSkill, onAddSkill, onDeleteSkill }) {
    // Added min-h-[90vh] to ensure the grid view also has a proper height.
    return (
        <div className="p-8 min-h-[90vh]">
            <h1 className="text-3xl font-bold mb-6">Your Skills</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CreateSkillDialog onSkillCreate={onAddSkill} />
                {skills.map((skill) => (
                    <Card key={skill.id} className="relative p-6 cursor-pointer hover:shadow-lg transition-shadow" onDoubleClick={() => onSelectSkill(skill)}>
                        <div className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); onDeleteSkill(skill.id); }}>
                            <TrashIcon className="h-5 w-5" />
                        </div>
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-xl font-semibold flex items-center justify-between">
                                {skill.name}
                                <Badge variant={skill.status === 'online' ? 'default' : 'secondary'} className="capitalize">
                                    {skill.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>{skill.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex items-center text-sm text-muted-foreground mt-2">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                <span className="font-medium">{skill.technicalInfo}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

/**
 * Displays the three-pane editor for a selected skill.
 */
function SkillEditor({ skill, onSave, onBack, onDelete }) {
    const [consoleOutput, setConsoleOutput] = useState('Console output will appear here...');
    const [isConsoleLoading, setIsConsoleLoading] = useState(false);
    const [resources, setResources] = useState(skill.resources || []);
    const [activeResource, setActiveResource] = useState(resources.find(res => res.id === 'res-script') || resources[0]);

    // Define refs and handlers within the SkillEditor component scope
    const monaco = useMonaco();
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor) => editorRef.current = editor;

    // Fix Monaco tokenizer issue with SPARQL language
    useEffect(() => {
        if (monaco) {
            monaco.languages.register({ id: 'sparql' });
            monaco.languages.setMonarchTokensProvider('sparql', {
                keywords: [
                    'SELECT', 'CONSTRUCT', 'ASK', 'DESCRIBE', 'FROM', 'WHERE', 'OPTIONAL', 'UNION',
                    'FILTER', 'BIND', 'ORDER', 'BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'DISTINCT',
                    'REDUCED', 'AS', 'PREFIX'
                ],
                tokenizer: {
                    root: [
                        [/[a-zA-Z_$][\w$]*/, {
                            cases: {
                                '@keywords': 'keyword',
                                '@default': 'identifier'
                            }
                        }],
                        [/=|!=|<=|>=|<|>|\+|\-|\*|\/|&&|\|\||!/, 'operator'],
                        [/@\w+/, 'metatag'],
                        [/\d+/, 'number'],
                        [/"[^"]*"/, 'string'],
                        [/'[^']*'/, 'string'],
                        [/\/\/.*/, 'comment'],
                    ]
                }
            });
        }
    }, [monaco]);

    const handleRun = () => {
        setIsConsoleLoading(true);
        const codeToRun = editorRef.current?.getValue();

        // Determine the type of output based on skill type
        let output;
        if (skill.type === 'browser-use') {
            output = `> Initializing browser-use agent...\n> Navigating to URL...\n> Performing actions based on script...\n> Final output from agent:\nSuccessfully completed browser tasks.`;
        } else {
            output = `> Running ${activeResource.type} for ${skill.name}...\n\nOutput:\nHello from ${activeResource.type}!\n${codeToRun}`;
        }

        setConsoleOutput(output);
        setTimeout(() => {
            setIsConsoleLoading(false);
        }, 1500);
    };

    const handleSave = () => {
        const updatedResources = resources.map(res =>
            res.id === activeResource.id
                ? { ...res, content: editorRef.current?.getValue() }
                : res
        );
        onSave({ ...skill, resources: updatedResources });
    };

    const handleAddResource = () => {
        const newResource = {
            id: `res-${Date.now()}`,
            name: `new-resource-${Date.now()}.rdf`,
            type: 'rdf',
            content: `# New RDF Collection\n# Define your triples here.`,
        };
        setResources([...resources, newResource]);
        setActiveResource(newResource);
    };

    const handleDeleteResource = (id) => {
        setResources(resources.filter(res => res.id !== id));
        if (activeResource.id === id) {
            setActiveResource(resources.find(res => res.id === 'res-script') || resources[0]);
        }
    };

    return (
        // Set a fixed height to ensure the component always fills the screen.
        <div className="flex flex-col h-[95vh] min-h-[750px] overflow-hidden">
            {/* Common Header */}
            <header className="flex items-center justify-between p-4 bg-background border-b shadow-sm">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold">{skill.name}</h1>
                    <Badge variant={skill.status === 'online' ? 'default' : 'secondary'} className="capitalize">{skill.status}</Badge>
                    <Badge variant="outline" className="text-xs font-normal ml-2">{skill.technicalInfo}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={handleSave}><SaveIcon className="mr-2 h-4 w-4" /> Save</Button>
                    <Button onClick={handleRun} disabled={isConsoleLoading}>
                        {isConsoleLoading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <CirclePlayIcon className="mr-2 h-4 w-4" />}
                        Run
                    </Button>
                    <Button variant="destructive" onClick={() => { console.log("Delete action triggered"); onDelete(skill.id); }}>
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </header>

            {/* Three-pane layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Pane 1: Resource View (20%) */}
                <div className="w-1/5 border-r p-4 overflow-y-auto bg-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Resources</h2>
                        <Button variant="ghost" size="icon" onClick={handleAddResource}><FilePlus2Icon className="h-5 w-5" /></Button>
                    </div>
                    <ul className="space-y-2">
                        {resources.map(res => (
                            <li
                                key={res.id}
                                onClick={() => setActiveResource(res)}
                                className={cn("flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors text-sm cursor-pointer", activeResource?.id === res.id && "bg-muted font-semibold")}
                            >
                                <span className="truncate">{res.name}</span>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteResource(res.id); }} className="ml-2 h-6 w-6"><TrashIcon className="h-4 w-4" /></Button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pane 2: Editor Space (40%) */}
                <div className="w-2/5 p-4 flex flex-col space-y-4 bg-background">
                    <Tabs value={activeResource?.id} onValueChange={id => setActiveResource(resources.find(res => res.id === id))} className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start">
                            {resources.map(res => (
                                <TabsTrigger key={res.id} value={res.id} className="flex-1 data-[state=active]:bg-card">
                                    {res.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value={activeResource?.id} className="flex-1 p-0 mt-0">
                            <MonacoEditor
                                height="100%"
                                language={getMonacoLanguage(activeResource?.type)}
                                value={activeResource?.content}
                                onChange={value => {
                                    setResources(resources.map(res => res.id === activeResource.id ? { ...res, content: value } : res));
                                    setActiveResource({ ...activeResource, content: value });
                                }}
                                onMount={handleEditorDidMount}
                                options={{ minimap: { enabled: false } }}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Pane 3: Output Console (40%) */}
                <div className="w-2/5 border-l p-4 flex flex-col bg-background">
                    <h2 className="text-lg font-semibold mb-4">
                        {skill.type === 'browser-use' ? 'Browser-Use Agent Output' : 'Console Output'}
                    </h2>
                    <div className="flex-1 bg-gray-950 text-green-400 p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre-wrap shadow-inner">
                        {isConsoleLoading && <p className="flex items-center"><Loader2Icon className="h-4 w-4 animate-spin mr-2" /> Loading...</p>}
                        {!isConsoleLoading && <p>{consoleOutput}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Main application dashboard component.
 * Manages the top-level view state between the skill grid and the editor.
 */
export default function SkillsDashboard() {
    const [skills, setSkills] = useState(initialSkills);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [currentView, setCurrentView] = useState('home');

    const handleSelectSkill = (skill) => {
        setSelectedSkill(skill);
        setCurrentView('editor');
    };

    const handleAddSkill = (newSkill) => {
        setSkills([...skills, newSkill]);
    };

    const handleSaveSkill = (updatedSkill) => {
        setSkills(skills.map(skill => skill.id === updatedSkill.id ? updatedSkill : skill));
        setSelectedSkill(updatedSkill);
    };

    const handleDeleteSkill = (skillId) => {
        console.log(`Deleting skill with ID: ${skillId}`);
        setSkills(skills.filter(skill => skill.id !== skillId));
        if (selectedSkill?.id === skillId) {
            setSelectedSkill(null);
            setCurrentView('home');
        }
    };

    const handleBackToGrid = () => {
        setSelectedSkill(null);
        setCurrentView('home');
    };

    if (currentView === 'editor' && selectedSkill) {
        return (
            <SkillEditor
                skill={selectedSkill}
                onSave={handleSaveSkill}
                onDelete={handleDeleteSkill}
                onBack={handleBackToGrid}
            />
        );
    }

    return (
        <SkillGrid
            skills={skills}
            onSelectSkill={handleSelectSkill}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
        />
    );
}
