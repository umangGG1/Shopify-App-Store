import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import React, { useEffect, useState, useCallback } from 'react';

export default function useApiRequest(url, method) {
    const fetch = useAuthenticatedFetch();
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = useCallback(() => {
        let abortController = new AbortController();
        setIsLoading(true);
        fetch(url, {
            method: `${method}`,
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal
        })
        .then((response) => {
            if (!response.ok) {
                setError(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setResponseData(data);
            setIsLoading(false);
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                console.log("Abort Error");
            } else {
                setError(error.message);
                console.log(error.name, " => ", error.message);
            }
            setIsLoading(false);
        });
        return () => abortController.abort();
    }, [url, method, fetch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { responseData, isLoading, error, reFetch: fetchData };
}
