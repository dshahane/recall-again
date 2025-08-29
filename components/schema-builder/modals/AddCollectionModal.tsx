// /components/schema-builder/modals/AddCollectionModal.tsx

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from '../types';

interface AddCollectionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAddCollection: (name: string, fields: Field[]) => void;
}

export const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
                                                                          isOpen,
                                                                          onOpenChange,
                                                                          onAddCollection,
                                                                      }) => {
    const [name, setName] = React.useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onAddCollection(name.trim(), []);
            onOpenChange(false);
            setName('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                        Give your new collection type a name. You can add fields later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="collectionName" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="collectionName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Blog Posts"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};