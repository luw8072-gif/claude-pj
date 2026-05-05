export { getDb, closeDb, getDbPath } from './database.js';
export { up as runMigrations } from './migrations/001_initial.js';
export { novelDao } from './dao/novelDao.js';
export { volumeDao } from './dao/volumeDao.js';
export { chapterDao } from './dao/chapterDao.js';
export { snapshotDao } from './dao/snapshotDao.js';
export type { Novel, Volume, Chapter, Snapshot } from './types.js';
