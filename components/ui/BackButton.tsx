'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Import the Shadcn Button
import { FaArrowLeft } from 'react-icons/fa'; // Assuming you still want to use react-icons

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Button onClick={handleBack} variant="outline" size="icon">
            <FaArrowLeft className="h-4 w-4" />
        </Button>
    );
}