import * as React from 'react';
import { RunRecord } from '../../../shared/types/run-record';
import { secondsToTime } from '../../../shared/services/format';
import AddRunModal from './AddRunModal';

type Props = {
    runs: RunRecord[];
    onRefreshRecords: () => void;
};
const RunList: React.SFC<Props> = (props: Props) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <div>
            <div className="flex items-center">
                <h1>Runs</h1>
                <button onClick={() => setOpen(true)}>Add</button>
            </div>
            <div>
                {props.runs.map((run) => (
                    <div key={run.id}>
                        {new Date(run.fields.Date).toLocaleDateString()} | {run.fields.Distance}{' '}
                        miles | {secondsToTime(run.fields.Duration)} total
                    </div>
                ))}
            </div>

            <AddRunModal
                isOpen={isOpen}
                setOpen={setOpen}
                onRefreshRecords={props.onRefreshRecords}
            />
        </div>
    );
};
export default RunList;
