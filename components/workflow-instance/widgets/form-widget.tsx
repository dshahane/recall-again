'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
interface Field {
    id: string;
    label: string;
    type: string;
    value: any;
    options?: string[];
}

interface FormWidgetProps {
    data: {
        fields: Field[];
    };
}

// --- Form Widget Component ---
export function FormWidget({ data }: FormWidgetProps) {
    // Dynamically build a Zod schema from the data
    const dynamicSchema = z.object(
        data.fields.reduce((acc, field) => {
            // Create a validation rule for each field based on its type and whether it's required
            let schemaType;
            if (field.type === 'text') {
                schemaType = z.string().min(1, { message: `${field.label} is required` });
            } else if (field.type === 'select') {
                schemaType = z.string().min(1, { message: `Please select a value for ${field.label}` });
            }
            return { ...acc, [field.id]: schemaType };
        }, {})
    );

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(dynamicSchema),
        defaultValues: data.fields.reduce((acc, field) => {
            acc[field.id] = field.value;
            return acc;
        }, {} as { [key: string]: any }),
    });

    const onSubmit = (formData: z.infer<typeof dynamicSchema>) => {
        console.log('Form data submitted:', formData);
        // Here you would typically send the data to an API
    };

    return (
        <div className="p-4 bg-gray-50 rounded-md shadow-inner h-full overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {data.fields.map(field => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                            {field.label}
                        </Label>
                        {field.type === 'text' && (
                            <Input
                                id={field.id}
                                type="text"
                                {...register(field.id)}
                                className={cn({ "border-red-500": errors[field.id] })}
                            />
                        )}
                        {field.type === 'select' && (
                            <Select
                                onValueChange={(value) => setValue(field.id, value)}
                                defaultValue={field.value}
                            >
                                <SelectTrigger className={cn({ "border-red-500": errors[field.id] })}>
                                    <SelectValue placeholder={`Select a ${field.label}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors[field.id] && (
                            <p className="text-xs text-red-500">{errors[field.id]?.message as string}</p>
                        )}
                    </div>
                ))}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
}
