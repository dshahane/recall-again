// hooks/useResource.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BASE;

function useResource(resourceName) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const fullUrl = `${API_BASE_URL}/${resourceName}`;

    // Fetch the list of resources
    const fetchResources = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(fullUrl);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Create a new resource (for POST)
    const createResource = async (resourceData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(fullUrl, resourceData);
            setRefetchTrigger(prev => prev + 1); // Trigger a re-fetch
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update an existing resource (for PUT/PATCH)
    const updateResource = async (id, resourceData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${fullUrl}/${id}`, resourceData);
            setRefetchTrigger(prev => prev + 1); // Trigger a re-fetch
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a resource (for DELETE)
    const deleteResource = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.delete(`${fullUrl}/${id}`);
            setRefetchTrigger(prev => prev + 1); // Trigger a re-fetch
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [fullUrl, refetchTrigger]);

    // Return all the functions and data
    return { data, isLoading, error, createResource, updateResource, deleteResource };
}

export default useResource;