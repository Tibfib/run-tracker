import 'react-datepicker/dist/react-datepicker.css';

import * as React from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';

import { RunRecord } from 'src/shared/types/run-record';

import table from 'src/shared/services/table';

import { useAsyncAction } from 'src/shared/hooks/fetch';

type Props = {
    run?: RunRecord;
    isOpen: boolean;
    onRequestClose: () => void;
    onRefreshRecords: () => void;
};

const customStyles: Modal.Styles = {
    content: {
        top: '15%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, 0)',
        overflow: 'visible',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
};

function useSaveRecord(date: Date, duration: number, distance: number, runId?: string) {
    return useAsyncAction<RunRecord>(() => {
        const func = runId ? table.updateRecord : table.createRecord;

        return func({
            id: runId || undefined,
            fields: {
                Date: date.toISOString(),
                Duration: duration,
                Distance: distance,
            },
        } as RunRecord);
    });
}

function useDeleteRecord(runId?: string) {
    return useAsyncAction(() => {
        return runId ? table.deleteRecord(runId) : Promise.resolve({});
    });
}

const times: number[] = new Array(60).fill(false).map((_val, index) => index);
const padNumber = (num: number): string => (num < 10 ? '0' + num : '' + num);

const RunModal: React.SFC<Props> = (props: Props) => {
    const [date, setDate] = React.useState<Date>(
        props.run ? new Date(props.run.fields.Date) : new Date()
    );
    const [hours, setHours] = React.useState<number>(
        props.run ? Math.floor((props.run.fields.Duration || 0) / 3600) : 0
    );
    const [minutes, setMinutes] = React.useState<number>(
        props.run ? Math.floor((props.run.fields.Duration || 0) / 60) : 10
    );
    const [seconds, setSeconds] = React.useState<number>(
        props.run ? Math.floor((props.run.fields.Duration || 0) % 60) : 0
    );
    const [distance, setDistance] = React.useState<number>(
        props.run ? props.run.fields.Distance || 0 : 0
    );

    const canSave: boolean =
        date && hours != null && minutes != null && seconds != null && distance != null;

    const { result, loading, error, doAction: doSave } = useSaveRecord(
        date,
        hours * 3600 + minutes * 60 + seconds,
        distance,
        props.run ? props.run.id : undefined
    );

    const {
        result: deleteResult,
        loading: deleteLoading,
        error: deleteError,
        doAction: doDelete,
    } = useDeleteRecord(props.run ? props.run.id : undefined);

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            contentLabel="Add a Run"
            style={customStyles}
        >
            <div className="flex items-center mb2">
                <h2 className="my0">{props.run ? 'Run' : 'Add a Run'}</h2>
                <div className="flex-auto" />
                <button onClick={props.onRequestClose}>close</button>
            </div>
            <div className="md-flex">
                <div>
                    <div>Date</div>
                    <DatePicker
                        selected={date}
                        onChange={(date) => (date ? setDate(date) : null)}
                    />
                </div>
                <div>
                    <div>Distance (miles)</div>
                    <input
                        name="distance"
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(+e.target.value)}
                    />
                </div>
                <div>
                    <div>Duration</div>
                    <div className="flex">
                        <select value={hours} onChange={(e) => setHours(+e.target.value)}>
                            {times.map((time) => (
                                <option key={time} value={time}>
                                    {padNumber(time)}h
                                </option>
                            ))}
                        </select>
                        <select value={minutes} onChange={(e) => setMinutes(+e.target.value)}>
                            {times.map((time) => (
                                <option key={time} value={time}>
                                    {padNumber(time)}m
                                </option>
                            ))}
                        </select>
                        <select value={seconds} onChange={(e) => setSeconds(+e.target.value)}>
                            {times.map((time) => (
                                <option key={time} value={time}>
                                    {padNumber(time)}s
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="mt2 flex">
                {props.run ? (
                    <button
                        onClick={() =>
                            doDelete()
                                .then(() => props.onRefreshRecords())
                                .then(props.onRequestClose)
                        }
                    >
                        Delete
                    </button>
                ) : null}
                <div className="flex-auto" />
                <button
                    onClick={
                        canSave
                            ? () =>
                                  doSave()
                                      .then(() => props.onRefreshRecords())
                                      .then(props.onRequestClose)
                            : undefined
                    }
                >
                    {props.run ? 'Save' : 'Add'}
                </button>
            </div>
        </Modal>
    );
};
export default RunModal;
