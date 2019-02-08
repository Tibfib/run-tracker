import { isSameMonth, isSameWeek, isSameYear, subMonths, subWeeks, subYears } from 'date-fns';
import React from 'react';

import { RunRecord } from 'src/shared/types/run-record';
import { ViewWindow } from 'src/shared/types/view-windows';

export function getFilteredRuns(records: RunRecord[], view: ViewWindow): RunRecord[] {
    return records.filter((record) => {
        switch (view) {
            case ViewWindow.AllTime:
                return true;
            case ViewWindow.ThisMonth:
                return isSameMonth(new Date(), record.fields.Date);
            case ViewWindow.ThisWeek:
                return isSameWeek(new Date(), record.fields.Date);
            case ViewWindow.ThisYear:
                return isSameYear(new Date(), record.fields.Date);
            case ViewWindow.LastMonth:
                return isSameMonth(subMonths(new Date(), 1), record.fields.Date);
            case ViewWindow.LastWeek:
                return isSameWeek(subWeeks(new Date(), 1), record.fields.Date);
            case ViewWindow.LastYear:
                return isSameYear(subYears(new Date(), 1), record.fields.Date);
            case ViewWindow.LastTwoWeeks:
                return (
                    isSameWeek(new Date(), record.fields.Date) ||
                    isSameWeek(subWeeks(new Date(), 1), record.fields.Date)
                );
        }
        throw new Error('ViewWindow not handled ' + view);
    });
}

export default function useFilter(rows: RunRecord[], view: ViewWindow) {
    return React.useMemo(() => {
        return rows ? getFilteredRuns(rows, view) : [];
    }, [rows, view]);
}
