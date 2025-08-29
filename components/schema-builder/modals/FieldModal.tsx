import * as React from "react";
import {useState} from "react";
import {nanoid} from "nanoid";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {PRIMITIVE_SCHEMA_TYPES} from "@/components/schema-builder/data";
import {Field, FieldType} from "@/components/schema-builder/types";

interface FieldModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (field: Field) => void;
    existingField?: Field | null;
}

export const FieldModal: React.FC<FieldModalProps> = ({ isOpen, onOpenChange, onSave, existingField }) => {
    const isEditing = !!existingField;
    const [name, setName] = useState('');
    const [type, setType] = useState<FieldType>(PRIMITIVE_SCHEMA_TYPES[0]);
    const [required, setRequired] = useState(false);

    React.useEffect(() => {
        if (isOpen && existingField) {
            setName(existingField.name);
            setType(existingField.type);
            setRequired(existingField.required);
        } else if (!isOpen) {
            // Reset form on close
            setName('');
            setType(PRIMITIVE_SCHEMA_TYPES[0]);
            setRequired(false);
        }
    }, [isOpen, existingField]);

    const handleSubmit = () => {
        if (!name || !type) return;
        onSave({
            id: existingField?.id || nanoid(),
            name,
            type,
            required,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? `Edit Field: ${existingField.name}` : 'Add New Field'}</DialogTitle>
                    <DialogDescription>
                        Configure the properties for this field in your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(value: FieldType) => setType(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRIMITIVE_SCHEMA_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t.split('/').pop()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 justify-end col-start-2 col-span-3">
                        <Checkbox id="required" checked={required} onCheckedChange={checked => setRequired(!!checked)} />
                        <Label htmlFor="required" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Required Field
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        {isEditing ? 'Save Changes' : 'Add Field'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};