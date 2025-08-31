'use client'

import React from 'react';

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
    Plus as PlusIcon,
    Edit as EditIcon,
    Trash2 as Trash2Icon,
    Eye as EyeIcon,
    Circle as CircleIcon,
    ArrowRight as ArrowRightIcon,
    Rocket as RocketIcon,
    ClipboardCheck as ClipboardCheckIcon,
    Play as PlayIcon,
    Terminal as TerminalIcon,
    X as XIcon,
    Loader2 as Loader2Icon,
    AlertTriangle as AlertTriangleIcon
} from "lucide-react";

// Simple Modal component to replace alert/confirm
const Modal = ({ title, message, isOpen, onConfirm, onCancel, confirmText = 'OK' }) => {
    if (!isOpen) return null;

    const isConfirmModal = onConfirm && onCancel;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {isConfirmModal && (
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={onConfirm ? onConfirm : onCancel}>
                        {confirmText}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

// Skill Creation Wizard Component
const SkillWizard = ({ onComplete, onCancel }) => {
    const [step, setStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        type: '',
        trigger: 'User Query',
        sampleInput: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNextStep = () => {
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleCreateSkill = () => {
        // Pass the form data to the parent component's API call handler
        onComplete(formData);
    };

    // A mapping of steps for the visual progress bar
    const stepLabels = [
        { title: 'Skill Details', icon: ClipboardCheckIcon },
        { title: 'Trigger & Inputs', icon: TerminalIcon },
        { title: 'Pipeline', icon: RocketIcon },
        { title: 'Review & Create', icon: EyeIcon },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Wizard Header and Progress */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">New Skill Wizard</h2>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <XIcon className="w-5 h-5" />
                </Button>
            </div>
            <div className="flex justify-between items-center mb-6">
                {stepLabels.map((s, index) => (
                    <React.Fragment key={index}>
                        <div className={`flex items-center space-x-2 ${step > index + 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === index + 1 ? 'border-primary' : 'border-muted-foreground'}`}>
                                {step > index + 1 ? <ClipboardCheckIcon className="w-4 h-4 text-primary" /> : <s.icon className="w-4 h-4" />}
                            </div>
                            <span className="hidden sm:inline text-sm">{s.title}</span>
                        </div>
                        {index < stepLabels.length - 1 && (
                            <div className="flex-1 h-px bg-border mx-2" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Skill Details */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>1. Define Skill Details</CardTitle>
                        <CardDescription>Give your skill a name and a brief description of its purpose.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Skill Name</Label>
                            <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Query Intent Analysis" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="A short description of what this skill does." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Skill Type</Label>
                            <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a skill type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Query Understanding">Query Understanding</SelectItem>
                                    <SelectItem value="Document Understanding">Document Understanding</SelectItem>
                                    <SelectItem value="Timeseries Analytics">Timeseries Analytics</SelectItem>
                                    <SelectItem value="Specialized Search">Specialized Search</SelectItem>
                                    <SelectItem value="Unspecified">Unspecified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleNextStep} disabled={!formData.name || !formData.type}>Next</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 2: Trigger & Input */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. Define Trigger & Input</CardTitle>
                        <CardDescription>What event triggers this skill and what kind of input does it accept?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="trigger">Skill Trigger</Label>
                            <Select onValueChange={(value) => handleSelectChange('trigger', value)} value={formData.trigger}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a trigger" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User Query">User Query</SelectItem>
                                    <SelectItem value="Data Upload">Data Upload</SelectItem>
                                    <SelectItem value="Daily Batch">Daily Batch</SelectItem>
                                    <SelectItem value="User Request">User Request</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sampleInput">Sample Input</Label>
                            <Textarea id="sampleInput" value={formData.sampleInput} onChange={handleInputChange} placeholder="Provide an example of the input data (e.g., 'What is a waterproof jacket?')" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
                        <Button onClick={handleNextStep}>Next</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 3: Pipeline Activities (Visual Representation) */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>3. Design Pipeline Activities</CardTitle>
                        <CardDescription>Visualize the specialized activities that will be performed in sequence.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4 justify-center">
                            {/* Input Card */}
                            <Card className="w-full md:w-1/3">
                                <CardHeader className="text-center">
                                    <span className="bg-primary text-primary-foreground p-2 rounded-full inline-block mb-2">
                                        <TerminalIcon className="w-6 h-6" />
                                    </span>
                                    <CardTitle className="text-lg">Input</CardTitle>
                                    <CardDescription>Query/Data</CardDescription>
                                </CardHeader>
                            </Card>

                            <ArrowRightIcon className="w-8 h-8 text-primary shrink-0" />

                            {/* Classification Card */}
                            <Card className="w-full md:w-1/3">
                                <CardHeader className="text-center">
                                    <span className="bg-primary/20 text-primary p-2 rounded-full inline-block mb-2">
                                        <ClipboardCheckIcon className="w-6 h-6" />
                                    </span>
                                    <CardTitle className="text-lg">Classifier</CardTitle>
                                    <CardDescription>Intent Analysis</CardDescription>
                                </CardHeader>
                            </Card>

                            <ArrowRightIcon className="w-8 h-8 text-primary shrink-0" />

                            {/* Pipeline Activities Card */}
                            <Card className="w-full md:w-1/3">
                                <CardHeader className="text-center">
                                    <span className="bg-primary text-primary-foreground p-2 rounded-full inline-block mb-2">
                                        <RocketIcon className="w-6 h-6" />
                                    </span>
                                    <CardTitle className="text-lg">Pipeline</CardTitle>
                                    <CardDescription>Search, Discovery, Analytics</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
                        <Button onClick={handleNextStep}>Next</Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 4: Review & Create */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>4. Review & Create</CardTitle>
                        <CardDescription>Confirm your skill details before creation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Skill Name</p>
                                <p className="text-lg font-semibold">{formData.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Skill Type</p>
                                <p className="text-lg font-semibold">{formData.type}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Trigger</p>
                                <p className="text-lg font-semibold">{formData.trigger}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="text-lg font-semibold">{formData.description || 'N/A'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-sm font-medium text-muted-foreground">Sample Input</p>
                                <p className="text-lg font-semibold">{formData.sampleInput || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
                        <Button onClick={handleCreateSkill}>Create Skill</Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

// Main App Component
const ModelSkills = () => {
    const [skills, setSkills] = React.useState([]);
    const [view, setView] = React.useState('list');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalConfig, setModalConfig] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Fetch skills from API on component mount
    React.useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('/skills');
                if (!response.ok) {
                    throw new Error('Failed to fetch skills.');
                }
                const data = await response.json();
                setSkills(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching skills:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleAddSkill = () => {
        setView('wizard');
    };

    const handleViewSkill = (skill) => {
        setModalConfig({
            title: skill.name,
            message: `Type: ${skill.type}\nTrigger: ${skill.trigger}\nStatus: ${skill.status}`,
            isOpen: true,
            onConfirm: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    const handleEditSkill = (skillId) => {
        setModalConfig({
            title: "Edit Skill",
            message: `Editing skill with ID: ${skillId}. (This would be a PUT request to the API)`,
            isOpen: true,
            onConfirm: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
    };

    const handleDeleteSkill = (skillId) => {
        setModalConfig({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this skill?",
            isOpen: true,
            onConfirm: async () => {
                setIsModalOpen(false);
                try {
                    const response = await fetch(`/skills/${skillId}`, { method: 'DELETE' });
                    if (!response.ok) {
                        throw new Error('Failed to delete skill.');
                    }
                    setSkills(skills.filter(skill => skill.id !== skillId));
                    setModalConfig({
                        title: "Success",
                        message: "Skill deleted successfully!",
                        isOpen: true,
                        onConfirm: () => setIsModalOpen(false)
                    });
                    setIsModalOpen(true);
                } catch (err) {
                    console.error("Error deleting skill:", err);
                    setModalConfig({
                        title: "Error",
                        message: `Failed to delete skill. ${err.message}`,
                        isOpen: true,
                        onConfirm: () => setIsModalOpen(false)
                    });
                    setIsModalOpen(true);
                }
            },
            onCancel: () => setIsModalOpen(false),
            confirmText: "Delete"
        });
        setIsModalOpen(true);
    };

    const handleWizardComplete = async (formData) => {
        setIsLoading(true);
        try {
            const newSkill = { ...formData, status: 'Draft' };
            const response = await fetch('/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSkill),
            });
            if (!response.ok) {
                throw new Error('Failed to create skill.');
            }
            const createdSkill = await response.json();
            setSkills(prev => [...prev, createdSkill]);
            setView('list');
            setModalConfig({
                title: "Skill Created!",
                message: `The skill "${createdSkill.name}" has been successfully added.`,
                isOpen: true,
                onConfirm: () => setIsModalOpen(false),
                confirmText: "Close"
            });
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error creating skill:", err);
            setModalConfig({
                title: "Error",
                message: `Failed to create skill. ${err.message}`,
                isOpen: true,
                onConfirm: () => setIsModalOpen(false)
            });
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWizardCancel = () => {
        setView('list');
    };

    // A mapping for badge colors based on skill status
    const statusVariantMap = {
        'Deployed': 'default',
        'Staging': 'secondary',
        'Draft': 'outline',
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex justify-center">
            <Modal {...modalConfig} isOpen={isModalOpen} />
            <div className="w-full max-w-7xl space-y-8">
                {view === 'list' ? (
                    <>
                        {/* Hero Widget Section */}
                        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
                            <img
                                src="https://placehold.co/1200x400/3B82F6/ffffff?text=AI+Skill+Creation+Pipeline"
                                alt="Visual representation of the AI skill creation pipeline"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4 bg-black/50">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
                                    Build Intelligent Skills for Your Business
                                </h1>
                                <p className="mt-2 text-sm sm:text-base md:text-lg text-white/90 max-w-3xl">
                                    Design, train, and deploy specialized AI pipelines for document understanding, analytics, and competitive tracking across Amazon, Walmart, and your own e-commerce sites.
                                </p>
                            </div>
                        </div>

                        {/* Skills Database Section */}
                        <Card className="shadow-lg">
                            <CardHeader className="flex flex-row justify-between items-center space-y-0">
                                <div>
                                    <CardTitle>My Skills</CardTitle>
                                    <CardDescription>
                                        A comprehensive list of all your created AI skills.
                                    </CardDescription>
                                </div>
                                <Button onClick={handleAddSkill}>
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add New Skill
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <Loader2Icon className="w-8 h-8 animate-spin" />
                                        <p className="mt-2">Loading skills...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-destructive">
                                        <AlertTriangleIcon className="w-8 h-8" />
                                        <p className="mt-2 text-center">Failed to load skills. Please check the API connection.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[250px]">Skill Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Trigger</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                                <TableHead className="w-[150px] text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {skills.length > 0 ? (
                                                skills.map((skill) => (
                                                    <TableRow key={skill.id}>
                                                        <TableCell className="font-medium">{skill.name}</TableCell>
                                                        <TableCell>{skill.type}</TableCell>
                                                        <TableCell>{skill.trigger}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant={statusVariantMap[skill.status] || 'secondary'}>
                                                                {skill.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex justify-center space-x-2">
                                                                <Button variant="ghost" size="icon" onClick={() => handleViewSkill(skill)}>
                                                                    <EyeIcon className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill.id)}>
                                                                    <EditIcon className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSkill(skill.id)}>
                                                                    <Trash2Icon className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                        No skills found. Click "Add New Skill" to create one.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <SkillWizard onComplete={handleWizardComplete} onCancel={handleWizardCancel} />
                )}
            </div>
        </div>
    );
};

export default ModelSkills;
