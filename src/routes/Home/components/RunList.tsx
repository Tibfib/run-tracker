import * as React from 'react';
import { RunRecord } from '../../../shared/types/run-record';
import { secondsToTime } from '../../../shared/services/format';

type Props = {
    runs: RunRecord[];
};
const RunList: React.SFC<Props> = (props: Props) => {
    return (
        <div>
            <h1>Runs</h1>
            <div>
                {props.runs.map((run) => (
                    <div key={run.id}>
                        {new Date(run.fields.Date).toLocaleDateString()} | {run.fields.Distance}{' '}
                        miles | {secondsToTime(run.fields.Duration)} total
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RunList;
