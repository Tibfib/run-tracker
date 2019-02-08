import * as React from 'react';

import { RunRecord } from 'src/shared/types/run-record';

import { secondsToTime } from 'src/shared/services/format';

import RunModal from 'src/shared/components/RunModal';

type State = { open: boolean; run?: RunRecord };
type Action = { type: 'add' | 'edit' | 'close'; run?: RunRecord };

const initialState: State = { open: false };

function reducer(_state: State, action: Action) {
    switch (action.type) {
        case 'add':
            return { open: true };
        case 'edit':
            return { open: true, run: action.run };
        case 'close':
            return { open: false };
        default:
            throw new Error();
    }
}

type Props = {
    runs: RunRecord[];
    onRefreshRecords: () => void;
};
const RunList: React.SFC<Props> = (props: Props) => {
    const [state, dispatch] = React.useReducer<State, Action>(reducer, initialState);

    return (
        <div>
            <div className="flex items-center">
                <h1>Runs</h1>
                <button onClick={() => dispatch({ type: 'add' })}>Add</button>
            </div>
            <div>
                {props.runs.map((run) => (
                    <div key={run.id}>
                        {new Date(run.fields.Date).toLocaleDateString()} | {run.fields.Distance}{' '}
                        miles | {secondsToTime(run.fields.Duration)} total
                        <button onClick={() => dispatch({ type: 'edit', run })}>✏️</button>
                    </div>
                ))}
            </div>

            {state.open ? (
                <RunModal
                    isOpen={true}
                    onRequestClose={() => dispatch({ type: 'close' })}
                    onRefreshRecords={props.onRefreshRecords}
                    run={state.run}
                />
            ) : null}
        </div>
    );
};
export default RunList;
