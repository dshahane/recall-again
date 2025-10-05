import { useState, useEffect } from 'react';

interface Concept {
    id: string;
    name: string;
    description: string;
    source: string;
    published: boolean;
    related: string[];
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_CONCEPT_API_URL_BASE+"/concepts/summary";

export const useFetchConcepts = () => {
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Define the async fetch function inside the effect
        const fetchConcepts = async () => {
            try {
                const response = await fetch(API_ENDPOINT);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Concept[] = await response.json();
                console.log(data);
                setConcepts(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching concepts:", err);
                setError('Failed to load concepts. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConcepts();
    }, []); // Empty dependency array means it runs once on mount

    // 2. Return the data and status variables
    return { concepts, isLoading, error, setConcepts };
};