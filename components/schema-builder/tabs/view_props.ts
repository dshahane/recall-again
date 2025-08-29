import {Field} from "@/components/schema-builder/types";

export interface ViewProps {
    selectedContentType: string | null;
    fields: Field[];
    onOpenAddModal: () => void;
    onOpenEditModal: (field: Field) => void;
    onDeleteField: (fieldId: string) => void;
}