import * as React from 'react';

export function useFetch<ReturnType>(
    fetchData: () => Promise<ReturnType>,
    guards: any[],
    defaultState: ReturnType
) {
    // Some crud state
    const [loading, setLoading] = React.useState<boolean>(false);
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

    return { result, loading, error };
}
