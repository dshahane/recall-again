// types/app.d.ts

export interface ChatMessageProps {
    sender: 'user' | 'trl';
    message: string;
}

export interface SidebarButtonProps {
    activeChat: string | null;
    handleSelectChat: (chatId: string) => void;
}

export interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    activeChat: string | null;
    handleSelectChat: (chatId: string) => void;
}

export interface IngestionProcess {
    id: string; // Unique identifier for the ingestion
    name: string;
    description: string;
    path: string; // File path or URL
    type: string; // e.g., "Catalog", "Review", "Sales"
}

export interface MLProcess {
    id: string;
    name: string;
    description: string;
    task: string; // e.g., "Sentiment Analysis", "Recommendation Model"
    inputDataId?: string; // Optional: ID of an ingestion process to use as input
}

export interface Query {
    id: string;
    name: string;
    description: string;
    queryText: string;
    targetAgentId?: string; // Optional: ID of an agent to target
}

export interface Agent {
    id: string;
    name: string;
    purpose: string;
    configuration: string; // JSON string
}

export interface DataRepository {
    id: string;
    name: string;
    purpose: string;
    description: string;
    source: string;
    type: string;
    owner: string;
    tags: string[];
    lastUpdated: string;
    configuration: string; // JSON string
}

// Props for Modal Components
export interface ModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: T) => void;
    initialData?: T | null; // For editing existing items
}

export interface DataIngestionProps extends ModalProps<IngestionProcess> {}
export interface MLProcessingProps extends ModalProps<MLProcess> {}
export interface QueryHandlingProps extends ModalProps<Query> {}
export interface CreateAgentProps extends ModalProps<Agent> {}

export interface MainContentProps {
    activeChat: string | null;
    chatHistory: { id: number; sender: 'user' | 'trl'; message: string }[];
    toggleSidebar: () => void;
    // New props for handling modal visibility and initial data for editing
    openDataIngestionModal: (data?: IngestionProcess) => void;
    openMLProcessingModal: (data?: MLProcess) => void;
    openQueryHandlingModal: (data?: Query) => void;
    openCreateAgentModal: (data?: Agent) => void;
    openDataRepoModal: (data?: DataRepository) => void;
    activeTabHint?: 'ingestions' | 'ml-processes' | 'queries' | 'agents' | null;
    dataAssets: any[]; // The data assets array
    onImportAsset: (asset: any) => void; // The import handler
}

// Organizational model
export interface Organization {
    id: string;
    name: string;
    details: string;
    website: string;
    industry: string;
    bsuiness: 'buyer' | 'seller' | 'brand';
    systemUserId: string;
}

export interface Project {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    purpose: string;
    users: User[];
}

export interface User {
    id: string;
    email: string;
}