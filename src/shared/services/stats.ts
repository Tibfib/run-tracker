import React from 'react';
import { RunRecord } from '../types/run-record';
import { secondsToTime } from './format';

function isValidRun(record: RunRecord): boolean {
    return !!(record && record.fields && record.fields.Distance && record.fields.Duration);
}

function getAveragePace(records: RunRecord[]): string | undefined {
    const pacesPerRun: number[] = records
        .filter(isValidRun)
        .map((record) => record.fields.Duration / record.fields.Distance);

    const pace: number =
        pacesPerRun.reduce((total, pacePerRun) => total + pacePerRun, 0) / pacesPerRun.length;

    return secondsToTime(pace);
}

function getTotalMiles(records: RunRecord[] = []): number {
    const milesPerRun: number[] = records
        .filter(isValidRun)
        .map((record) => record.fields.Distance);

    const miles: number = milesPerRun.reduce((total, distancePerRun) => total + distancePerRun, 0);

    return miles;
}

function getFurthestRun(records: RunRecord[] = []): RunRecord {
    return records
        .filter(isValidRun)
        .sort((a, b) => (a.fields.Distance > b.fields.Distance ? 1 : -1))[0];
}

export type Stats = {
    totalRuns: number;
    avgMileTime: string | undefined;
    totalMiles: number;
    furthestRun: RunRecord;
};

function getStats(records: RunRecord[]): Stats {
    return {
        totalRuns: records.length,
        avgMileTime: getAveragePace(records),
        totalMiles: getTotalMiles(records),
        furthestRun: getFurthestRun(records),
    };
}

export default function useStats(records: RunRecord[]): Stats {
    return React.useMemo(() => {
        return records ? getStats(records) : ({} as Stats);
    }, [records]);
}
