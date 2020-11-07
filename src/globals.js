import StorageManager from './StorageManager';
import {isDevelopment} from './flags.js';

export const storageManager = new StorageManager('jsgist');
export const clientId = isDevelopment
    ? 'b7822ff167d2bbe9a361'
    : 'c055b54872b13c10e4bd';

