// hooks/use-api-mutation.ts
import { useState } from "react";

// The mutation function will be an async function that returns a Promise
export const useApiMutation = (mutationFunction: (payload: any) => Promise<any>) => {
    const [pending, setPending] = useState(false);

    const mutate = (payload: any) => {
        setPending(true);
        // The mutation function is called here
        return mutationFunction(payload)
            .catch((error) => {
                // Re-throw the error so the calling component can handle it (e.g., show a toast)
                throw error;
            })
            .finally(() => {
                setPending(false);
            });
    };

    return {
        mutate,
        pending,
    };
};