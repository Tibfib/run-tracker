import 'react-datepicker/dist/react-datepicker.css';

import * as React from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';

import { RunRecord } from 'src/shared/types/run-record';

import { createRecord } from 'src/shared/services/airtable';

import { useAsyncAction } from 'src/shared/hooks/fetch';

type Props = {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
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

const times: number[] = new Array(60).fill(false).map((_val, index) => index);
const padNumber = (num: number): string => (num < 10 ? '0' + num : '' + num);

const AddRunModal: React.SFC<Props> = (props: Props) => {
    const [date, setDate] = React.useState<Date>(new Date());
    const [hours, setHours] = React.useState<number>(0);
    const [minutes, setMinutes] = React.useState<number>(10);
    const [seconds, setSeconds] = React.useState<number>(0);
    const [distance, setDistance] = React.useState<number>(0);
    const canSave: boolean =
        date && hours != null && minutes != null && seconds != null && distance != null;

    const { result, loading, error, doAction } = useAsyncAction<RunRecord>(() =>
        createRecord<RunRecord>('appAKclu9CamqSKB4/Table%201', {
            fields: {
                Date: date.toISOString(),
                Duration: hours * 3600 + minutes * 60 + seconds,
                Distance: distance,
            },
        } as RunRecord)
    );

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={() => props.setOpen(false)}
            contentLabel="Add a Run"
            style={customStyles}
        >
            <div className="flex items-center mb2">
                <h2 className="my0">Add a Run</h2>
                <div className="flex-auto" />
                <button onClick={() => props.setOpen(false)}>close</button>
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
                <div className="flex-auto" />
                <button
                    onClick={
                        canSave
                            ? () =>
                                  doAction()
                                      .then(() => props.onRefreshRecords())
                                      .then(() => props.setOpen(false))
                            : undefined
                    }
                >
                    Add
                </button>
            </div>
        </Modal>
    );
};
export default AddRunModal;
