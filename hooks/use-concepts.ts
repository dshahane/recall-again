import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Concept {
    id: string;
    name: string;
    description: string;
    source: string;
    published: boolean;
    related: string[];
}

export const useFetchConcepts = () => {
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchConcepts = async () => {
            try {
                const response = await api.get<Concept[]>('/concepts/list');

                if (isMounted) {
                    setConcepts(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to fetch concepts.");
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchConcepts();

        return () => {
            isMounted = false;
        };
    }, []);

    return { concepts, isLoading, error, setConcepts, api };
};