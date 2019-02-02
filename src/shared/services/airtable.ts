type TablePath = string;
type RecordId = string;

type ListRecordsOptions = {
    [key: string]: any;
};
type RetrieveRecordOptions = {
    [key: string]: any;
};

const AIRTABLE_API = 'https://api.airtable.com/v0/';
function getUrl(table: TablePath) {
    return AIRTABLE_API + table;
}

function ourFetch<ReturnType>(url: string, options?: RequestInit): Promise<ReturnType> {
    return fetch(url, {
        ...options,
        headers: {
            Authorization: 'Bearer keyLIxTEY3bWJslOF',
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

export function retrieveRecord<RecordType>(
    table: TablePath,
    recordId: RecordId,
    options: RetrieveRecordOptions
): Promise<RecordType | undefined> {
    return Promise.resolve(undefined);
}

export function createRecord<RecordType>(table: TablePath, newRecord: RecordType) {
    return ourFetch<RecordType>(getUrl(table), { method: 'POST', body: JSON.stringify(newRecord) });
}

// function updateRecord<RecordType>(table: TablePath, newRecord) {

// }

export function deleteRecord(table: TablePath, recordId: string) {
    return ourFetch(getUrl(`${table}/${recordId}`), { method: 'DELTE' });
}

interface Table<RecordType> {
    listRecords(options: ListRecordsOptions): Promise<RecordType[]>;
    retrieveRecord(
        recordId: RecordId,
        options: RetrieveRecordOptions
    ): Promise<RecordType | undefined>;
}

export default class Airtable<RecordType> implements Table<RecordType> {
    constructor(private _table: TablePath) {}

    public listRecords(options: ListRecordsOptions): Promise<RecordType[]> {
        return listRecords<RecordType>(this._table, options);
    }
    public retrieveRecord(
        recordId: RecordId,
        options: RetrieveRecordOptions
    ): Promise<RecordType | undefined> {
        return retrieveRecord<RecordType>(this._table, recordId, options);
    }

    public createRecord(newRecord: RecordType): Promise<RecordType> {
        return createRecord<RecordType>(this._table, newRecord);
    }
}
