import { RunRecord } from '../types/run-record';
import Airtable from './airtable';

const table = new Airtable<RunRecord>('appAKclu9CamqSKB4/Table%201');
export default table;
