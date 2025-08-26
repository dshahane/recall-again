// File: hooks/useWorkflowApi.js
'use client'

import { useState } from 'react';

// Define the base URL for your API, as specified in the OpenAPI document.
const API_BASE_URL = 'https://api.yourdomain.com';

/**
 * A custom React hook for interacting with the backend Workflow API.
 * It provides functions to initialize, load, save, and run workflows.
 */
const useWorkflowApi = () => {
    // State to manage loading status, errors, and returned data.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * A generic utility function to make API requests.
     * @param {string} endpoint - The API endpoint to call (e.g., '/initialize').
     * @param {object} data - The request body data.
     * @returns {Promise<object | null>} - The parsed JSON response or null on error.
     */
    const callApi = async (endpoint, data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary authorization headers here
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // If the response status code is not in the 200-299 range,
                // it's an error. We use the error message from the API.
                setError(responseData.message || `API Error: ${response.statusText}`);
                return null;
            }

            // Return the data received from the API
            return responseData;

        } catch (err) {
            console.error(`API call to ${endpoint} failed:`, err);
            setError(`Network Error: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initializes a new workflow by calling the /initialize endpoint.
     * @param {string} theme - The theme for the new workflow (e.g., "data pipeline").
     * @returns {Promise<object | null>} - A Promise that resolves to the new workflow object or null on failure.
     */
    const initializeWorkflow = async (theme) => {
        const requestData = { theme };
        return callApi('/initialize', requestData);
    };

    /**
     * Loads a workflow from a string by calling the /load endpoint.
     * @param {string} workflowString - The raw JSON string of the workflow.
     * @returns {Promise<object | null>} - A Promise that resolves to the validated workflow object or null on failure.
     */
    const loadWorkflow = async (workflowString) => {
        const requestData = { workflowString };
        return callApi('/load', requestData);
    };

    /**
     * Saves a workflow by calling the /save endpoint.
     * @param {object} workflowData - The workflow object to be saved.
     * @returns {Promise<object | null>} - A Promise that resolves to the save summary or null on failure.
     */
    const saveWorkflow = async (workflowData) => {
        return callApi('/save', workflowData);
    };

    /**
     * Runs a workflow by calling the /run endpoint.
     * @param {object} workflowData - The workflow object to be executed.
     * @returns {Promise<object | null>} - A Promise that resolves to the execution log or null on failure.
     */
    const runWorkflow = async (workflowData) => {
        return callApi('/run', workflowData);
    };

    return {
        initializeWorkflow,
        loadWorkflow,
        saveWorkflow,
        runWorkflow,
        loading,
        error
    };
};

export default useWorkflowApi;
