export { getDb, closeDb, getDbPath } from './database.js';
export { runMigrations } from './migrations/runner.js';
export { novelDao } from './dao/novelDao.js';
export { volumeDao } from './dao/volumeDao.js';
export { chapterDao } from './dao/chapterDao.js';
export { snapshotDao } from './dao/snapshotDao.js';
export { characterDao } from './dao/characterDao.js';
export { characterRelationDao } from './dao/characterRelationDao.js';
export { worldEntryDao } from './dao/worldEntryDao.js';
export { entryLinkDao } from './dao/entryLinkDao.js';
export { writingGoalDao } from './dao/writingGoalDao.js';
export type {
  Novel, Volume, Chapter, Snapshot,
  Character, CharacterRelation,
  WorldEntry, EntryLink, WritingGoal,
} from './types.js';
