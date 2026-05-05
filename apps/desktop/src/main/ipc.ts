import { ipcMain } from 'electron';
import { novelDao, volumeDao, chapterDao, snapshotDao } from '@novel-writer/core';

export function registerIpcHandlers(): void {
  // Novel CRUD
  ipcMain.handle('novel:create', (_e, title: string) => novelDao.create(title));
  ipcMain.handle('novel:getAll', () => novelDao.getAll());
  ipcMain.handle('novel:getById', (_e, id: string) => novelDao.getById(id));
  ipcMain.handle('novel:update', (_e, id: string, data: Record<string, unknown>) => novelDao.update(id, data));
  ipcMain.handle('novel:delete', (_e, id: string) => novelDao.delete(id));

  // Volume CRUD
  ipcMain.handle('volume:create', (_e, novelId: string, title: string) => volumeDao.create(novelId, title));
  ipcMain.handle('volume:getByNovel', (_e, novelId: string) => volumeDao.getByNovel(novelId));
  ipcMain.handle('volume:update', (_e, id: string, data: Record<string, unknown>) => volumeDao.update(id, data));
  ipcMain.handle('volume:delete', (_e, id: string) => volumeDao.delete(id));
  ipcMain.handle('volume:reorder', (_e, ids: string[]) => volumeDao.reorder(ids));

  // Chapter CRUD
  ipcMain.handle('chapter:create', (_e, volumeId: string, title: string) => chapterDao.create(volumeId, title));
  ipcMain.handle('chapter:getByVolume', (_e, volumeId: string) => chapterDao.getByVolume(volumeId));
  ipcMain.handle('chapter:getById', (_e, id: string) => chapterDao.getById(id));
  ipcMain.handle('chapter:updateContent', (_e, id: string, content: string) => chapterDao.updateContent(id, content));
  ipcMain.handle('chapter:update', (_e, id: string, data: Record<string, unknown>) => chapterDao.update(id, data));
  ipcMain.handle('chapter:delete', (_e, id: string) => chapterDao.delete(id));
  ipcMain.handle('chapter:reorder', (_e, ids: string[]) => chapterDao.reorder(ids));

  // Snapshot
  ipcMain.handle('snapshot:create', (_e, chapterId: string, content: string) => snapshotDao.create(chapterId, content));
  ipcMain.handle('snapshot:getByChapter', (_e, chapterId: string) => snapshotDao.getByChapter(chapterId));
}
