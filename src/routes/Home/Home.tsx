import * as React from 'react';
import { listRecords } from '../../shared/services/airtable';
import { useFetch } from '../../shared/hooks/fetch';
import getStats from '../../shared/services/stats';
import RunList from './components/RunList';

type RunRecord = {
    createdTime: string;
    fields: {
        Date: string;
        Duration: number;
        Distance: number;
    };
    id: string;
};

export default function Home() {
    const [records, setRecords] = React.useState<RunRecord[]>([]);

    const { result, loading, error } = useFetch<RunRecord[]>(
        () => listRecords<RunRecord>('appAKclu9CamqSKB4/Table%201', {}),
        ['appAKclu9CamqSKB4/Table%201'],
        []
    );

    return (
        <div>
            <h1>Stats</h1>
            <pre>{result ? JSON.stringify(getStats(result), null, 2) : null}</pre>
            {result ? <RunList runs={result} /> : null}
        </div>
    );
}
