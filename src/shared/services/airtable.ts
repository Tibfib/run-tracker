import { ListRecordsOptions, RecordInterface, Table } from '../types/table';

type TablePath = string;

const AIRTABLE_API = 'https://api.airtable.com/v0/';
function getUrl(table: TablePath) {
    return AIRTABLE_API + table;
}

function ourFetch<ReturnType>(url: string, options?: RequestInit): Promise<ReturnType> {
    return fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_AUTH_TOKEN}`,
            ['Content-Type']: 'application/json',
        },
    }).then((response) => response.json());
}

type ListRecordsWrapper<RecordType> = {
    records: RecordType[];
};

export function listRecords<RecordType>(
    table: TablePath,
    options: ListRecordsOptions
): Promise<RecordType[]> {
    return ourFetch<ListRecordsWrapper<RecordType>>(getUrl(table)).then(
        (wrapper) => wrapper.records
    );
}
export function createRecord<RecordType>(table: TablePath, newRecord: RecordType) {
    return ourFetch<RecordType>(getUrl(table), { method: 'POST', body: JSON.stringify(newRecord) });
}

export function updateRecord<RecordType extends RecordInterface>(
    table: TablePath,
    { id, ...record }: RecordType
) {
    return ourFetch<RecordType>(getUrl(`${table}/${id}`), {
        method: 'PUT',
        body: JSON.stringify(record),
    });
}

export function deleteRecord(table: TablePath, recordId: string) {
    return ourFetch(getUrl(`${table}/${recordId}`), { method: 'DELETE' });
}

export default class Airtable<RecordType extends RecordInterface> implements Table<RecordType> {
    constructor(private _table: TablePath) {
        this.listRecords = this.listRecords.bind(this);
        this.createRecord = this.createRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    public listRecords(options: ListRecordsOptions): Promise<RecordType[]> {
        return listRecords<RecordType>(this._table, options);
    }

    public createRecord(newRecord: RecordType): Promise<RecordType> {
        return createRecord<RecordType>(this._table, newRecord);
    }

    public updateRecord(record: RecordType): Promise<RecordType> {
        return updateRecord<RecordType>(this._table, record);
    }

    public deleteRecord(recordId: string): Promise<any> {
        return deleteRecord(this._table, recordId);
    }
}
