export type ListRecordsOptions = {
    [key: string]: any;
};

export interface RecordInterface {
    id: string;
}

export interface Table<RecordType extends RecordInterface> {
    listRecords(options: ListRecordsOptions): Promise<RecordType[]>;
    createRecord(newRecord: RecordType): Promise<RecordType>;
    updateRecord(record: RecordType): Promise<RecordType>;
    deleteRecord(recordId: string): Promise<any>;
}
