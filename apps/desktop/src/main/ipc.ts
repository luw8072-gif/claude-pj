import { ipcMain, dialog } from 'electron';
import { novelDao, volumeDao, chapterDao, snapshotDao, characterDao, characterRelationDao, worldEntryDao, entryLinkDao, writingGoalDao } from '@novel-writer/core';
import { exportTxt, exportEpub } from '@novel-writer/export';
import { verifyLicense, saveLicense, loadLicense, isActivated, clearLicense } from './license.js';

export function registerIpcHandlers(): void {
  // Novel CRUD
  ipcMain.handle('novel:create', (_e, title: string) => novelDao.create(title));
  ipcMain.handle('novel:getAll', () => novelDao.getAll());
  ipcMain.handle('novel:getById', (_e, id: string) => novelDao.getById(id));
  ipcMain.handle('novel:update', (_e, id: string, data) => novelDao.update(id, data as any));
  ipcMain.handle('novel:delete', (_e, id: string) => novelDao.delete(id));

  // Volume CRUD
  ipcMain.handle('volume:create', (_e, novelId: string, title: string) => volumeDao.create(novelId, title));
  ipcMain.handle('volume:getByNovel', (_e, novelId: string) => volumeDao.getByNovel(novelId));
  ipcMain.handle('volume:update', (_e, id: string, data) => volumeDao.update(id, data as any));
  ipcMain.handle('volume:delete', (_e, id: string) => volumeDao.delete(id));
  ipcMain.handle('volume:reorder', (_e, ids: string[]) => volumeDao.reorder(ids));

  // Chapter CRUD
  ipcMain.handle('chapter:create', (_e, volumeId: string, title: string) => chapterDao.create(volumeId, title));
  ipcMain.handle('chapter:getByVolume', (_e, volumeId: string) => chapterDao.getByVolume(volumeId));
  ipcMain.handle('chapter:getById', (_e, id: string) => chapterDao.getById(id));
  ipcMain.handle('chapter:updateContent', (_e, id: string, content: string) => chapterDao.updateContent(id, content));
  ipcMain.handle('chapter:update', (_e, id: string, data) => chapterDao.update(id, data as any));
  ipcMain.handle('chapter:delete', (_e, id: string) => chapterDao.delete(id));
  ipcMain.handle('chapter:reorder', (_e, ids: string[]) => chapterDao.reorder(ids));

  // Snapshot
  ipcMain.handle('snapshot:create', (_e, chapterId: string, content: string) => snapshotDao.create(chapterId, content));
  ipcMain.handle('snapshot:getByChapter', (_e, chapterId: string) => snapshotDao.getByChapter(chapterId));
  ipcMain.handle('snapshot:getById', (_e, id: string) => snapshotDao.getById(id));

  // Character CRUD
  ipcMain.handle('character:create', (_e, novelId: string, name: string) => characterDao.create(novelId, name));
  ipcMain.handle('character:getByNovel', (_e, novelId: string) => characterDao.getByNovel(novelId));
  ipcMain.handle('character:getById', (_e, id: string) => characterDao.getById(id));
  ipcMain.handle('character:update', (_e, id: string, data) => characterDao.update(id, data as any));
  ipcMain.handle('character:delete', (_e, id: string) => characterDao.delete(id));
  ipcMain.handle('character:reorder', (_e, ids: string[]) => characterDao.reorder(ids));

  // Character Relation CRUD
  ipcMain.handle('characterRelation:create', (_e, novelId: string, from: string, to: string, type: string, desc?: string) =>
    characterRelationDao.create(novelId, from, to, type, desc));
  ipcMain.handle('characterRelation:getByNovel', (_e, novelId: string) => characterRelationDao.getByNovel(novelId));
  ipcMain.handle('characterRelation:getByCharacter', (_e, charId: string) => characterRelationDao.getByCharacter(charId));
  ipcMain.handle('characterRelation:update', (_e, id: string, data) => characterRelationDao.update(id, data as any));
  ipcMain.handle('characterRelation:delete', (_e, id: string) => characterRelationDao.delete(id));

  // World Entry CRUD
  ipcMain.handle('worldEntry:create', (_e, novelId: string, name: string, category?: string) => worldEntryDao.create(novelId, name, category));
  ipcMain.handle('worldEntry:getByNovel', (_e, novelId: string) => worldEntryDao.getByNovel(novelId));
  ipcMain.handle('worldEntry:getByCategory', (_e, novelId: string, category: string) => worldEntryDao.getByCategory(novelId, category));
  ipcMain.handle('worldEntry:getById', (_e, id: string) => worldEntryDao.getById(id));
  ipcMain.handle('worldEntry:update', (_e, id: string, data) => worldEntryDao.update(id, data as any));
  ipcMain.handle('worldEntry:delete', (_e, id: string) => worldEntryDao.delete(id));

  // Entry Link CRUD
  ipcMain.handle('entryLink:create', (_e, fromId: string, toId: string, type?: string) => entryLinkDao.create(fromId, toId, type));
  ipcMain.handle('entryLink:getByEntry', (_e, entryId: string) => entryLinkDao.getByEntry(entryId));
  ipcMain.handle('entryLink:delete', (_e, id: string) => entryLinkDao.delete(id));

  // Writing Goal CRUD
  ipcMain.handle('writingGoal:createOrUpdate', (_e, novelId: string, date: string, target: number) => writingGoalDao.createOrUpdate(novelId, date, target));
  ipcMain.handle('writingGoal:getByNovel', (_e, novelId: string) => writingGoalDao.getByNovel(novelId));
  ipcMain.handle('writingGoal:getByDate', (_e, novelId: string, date: string) => writingGoalDao.getByDate(novelId, date));
  ipcMain.handle('writingGoal:updateActualCount', (_e, id: string, count: number) => writingGoalDao.updateActualCount(id, count));
  ipcMain.handle('writingGoal:delete', (_e, id: string) => writingGoalDao.delete(id));

  // License
  ipcMain.handle('license:verify', (_e, key: string) => verifyLicense(key));
  ipcMain.handle('license:save', (_e, key: string, email?: string) => {
    saveLicense(key, email);
    return { success: true };
  });
  ipcMain.handle('license:load', () => loadLicense());
  ipcMain.handle('license:isActivated', () => isActivated());
  ipcMain.handle('license:clear', () => { clearLicense(); return { success: true }; });

  // Export
  ipcMain.handle('export:txt', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled) return { success: false, error: 'cancelled' };
    const novels = novelDao.getAll();
    if (novels.length === 0) return { success: false, error: 'no novels' };
    const novel = novels[0];
    const volumes = volumeDao.getByNovel(novel.id);
    const chaptersByVolume: Record<string, import('@novel-writer/core').Chapter[]> = {};
    for (const vol of volumes) {
      chaptersByVolume[vol.id] = chapterDao.getByVolume(vol.id);
    }
    return exportTxt(novel, volumes, chaptersByVolume, result.filePaths[0]);
  });

  ipcMain.handle('export:epub', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled) return { success: false, error: 'cancelled' };
    const novels = novelDao.getAll();
    if (novels.length === 0) return { success: false, error: 'no novels' };
    const novel = novels[0];
    const volumes = volumeDao.getByNovel(novel.id);
    const chaptersByVolume: Record<string, import('@novel-writer/core').Chapter[]> = {};
    for (const vol of volumes) {
      chaptersByVolume[vol.id] = chapterDao.getByVolume(vol.id);
    }
    return exportEpub(novel, volumes, chaptersByVolume, result.filePaths[0]);
  });
}
