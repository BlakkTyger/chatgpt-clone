import { useState } from "react";
export const useApiMutation = (mutationFunction: (payload: any) => Promise<any>) => {
    const [pending, setPending] = useState(false);

    const mutate = (payload: any) => {
        setPending(true);
        return mutationFunction(payload)
            .catch((error) => {
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