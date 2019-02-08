import * as React from 'react';

import { ViewWindow, ViewWindowOptions } from 'src/shared/types/view-windows';

import { listRecords } from 'src/shared/services/airtable';
import useStats, { Stats } from 'src/shared/services/stats';

import { useFetch } from 'src/shared/hooks/fetch';
import useFilter from 'src/shared/hooks/use-filter';

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
    const { result, loading, error, refresh } = useFetch<RunRecord[]>(
        () => listRecords<RunRecord>('appAKclu9CamqSKB4/Table%201', {}),
        ['appAKclu9CamqSKB4/Table%201'],
        []
    );
    const [view, setView] = React.useState<ViewWindow>(ViewWindow.ThisYear);
    const filteredRuns: RunRecord[] = useFilter(result ? result : [], view);
    const stats: Stats = useStats(filteredRuns);

    return loading ? (
        <div>Loading...</div>
    ) : error ? (
        <div>{error}</div>
    ) : (
        <div className="px4 py1">
            <div className="md-flex">
                <div className="col-8">
                    <div className="flex items-center">
                        <h1>Stats</h1>
                        <select
                            value={view}
                            onChange={(e) => setView(e.target.value as ViewWindow)}
                        >
                            {ViewWindowOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>Total Runs: {stats.totalRuns}</div>
                    <div>Average Mile Time: {stats.avgMileTime}</div>
                    <div>Total Miles: {stats.totalMiles}</div>
                </div>
                <div className="col-4">
                    <RunList runs={filteredRuns} onRefreshRecords={refresh} />
                </div>
            </div>
        </div>
    );
}
