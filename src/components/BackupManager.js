const backupKey = 'backup';

export default class BackupManager {
  #storageManager;

  constructor(storageManager) {
    this.#storageManager = storageManager;
  }
  getBackup() {
    return this.#storageManager.get(backupKey);
  }
  setBackup(data) {
    this.#storageManager.set(backupKey, data);
  }
  clearBackup() {
    this.#storageManager.delete(backupKey);
  }
}