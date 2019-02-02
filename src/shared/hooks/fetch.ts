import * as React from 'react';

export function useFetch<ReturnType>(
    fetchData: () => Promise<ReturnType>,
    guards: any[],
    defaultState: ReturnType
) {
    // Some crud state
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<Error | void>(undefined);
    const [result, setResult] = React.useState<ReturnType | void>(defaultState);

    async function doFetch(): Promise<void | ReturnType> {
        setLoading(true);
        const data = await fetchData().catch(setError);
        setLoading(false);
        setResult(data);
    }

    // When the guards change, refresh
    React.useEffect(() => {
        doFetch();
    }, guards);

    return { result, loading, error, refresh: doFetch };
}

export function useAsyncAction<ReturnType>(doAsyncAction: () => Promise<ReturnType>) {
    // Some crud state
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<Error | null>(null);
    const [result, setResult] = React.useState<ReturnType | null>(null);

    async function doAction(): Promise<void | ReturnType> {
        setLoading(true);
        const data = await doAsyncAction().catch(setError);
        setLoading(false);
        setResult(data || null);
    }

    return { result, loading, error, doAction };
}
