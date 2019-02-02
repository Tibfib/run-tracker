import * as React from 'react';
import { listRecords } from '../../shared/services/airtable';
import { useFetch } from '../../shared/hooks/fetch';
import useStats, { Stats } from '../../shared/services/stats';
import RunList from './components/RunList';
import { ViewWindow, ViewWindowOptions } from '../../shared/types/view-windows';
import useFilter from '../../shared/hooks/use-filter';

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
    const { result, loading, error } = useFetch<RunRecord[]>(
        () => listRecords<RunRecord>('appAKclu9CamqSKB4/Table%201', {}),
        ['appAKclu9CamqSKB4/Table%201'],
        []
    );
    const [view, setView] = React.useState<ViewWindow>(ViewWindow.ThisYear);
    const filteredRuns = useFilter(result ? result : [], view);
    const stats: Stats = useStats(filteredRuns);

    return loading ? (
        <div>Loading...</div>
    ) : error ? (
        <div>{error}</div>
    ) : (
        <div className="px4 py1">
            <div className="flex">
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
                    <RunList runs={filteredRuns} />
                </div>
            </div>
        </div>
    );
}
