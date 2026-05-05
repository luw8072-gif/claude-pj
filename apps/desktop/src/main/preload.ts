import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('novelWriter', {
  novel: {
    create: (title: string) => ipcRenderer.invoke('novel:create', title),
    getAll: () => ipcRenderer.invoke('novel:getAll'),
    getById: (id: string) => ipcRenderer.invoke('novel:getById', id),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('novel:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('novel:delete', id),
  },
  volume: {
    create: (novelId: string, title: string) => ipcRenderer.invoke('volume:create', novelId, title),
    getByNovel: (novelId: string) => ipcRenderer.invoke('volume:getByNovel', novelId),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('volume:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('volume:delete', id),
    reorder: (ids: string[]) => ipcRenderer.invoke('volume:reorder', ids),
  },
  chapter: {
    create: (volumeId: string, title: string) => ipcRenderer.invoke('chapter:create', volumeId, title),
    getByVolume: (volumeId: string) => ipcRenderer.invoke('chapter:getByVolume', volumeId),
    getById: (id: string) => ipcRenderer.invoke('chapter:getById', id),
    updateContent: (id: string, content: string) => ipcRenderer.invoke('chapter:updateContent', id, content),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('chapter:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('chapter:delete', id),
    reorder: (ids: string[]) => ipcRenderer.invoke('chapter:reorder', ids),
  },
  snapshot: {
    create: (chapterId: string, content: string) => ipcRenderer.invoke('snapshot:create', chapterId, content),
    getByChapter: (chapterId: string) => ipcRenderer.invoke('snapshot:getByChapter', chapterId),
    getById: (id: string) => ipcRenderer.invoke('snapshot:getById', id),
  },
  character: {
    create: (novelId: string, name: string) => ipcRenderer.invoke('character:create', novelId, name),
    getByNovel: (novelId: string) => ipcRenderer.invoke('character:getByNovel', novelId),
    getById: (id: string) => ipcRenderer.invoke('character:getById', id),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('character:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('character:delete', id),
    reorder: (ids: string[]) => ipcRenderer.invoke('character:reorder', ids),
  },
  characterRelation: {
    create: (novelId: string, fromCharId: string, toCharId: string, relationType: string, description?: string) =>
      ipcRenderer.invoke('characterRelation:create', novelId, fromCharId, toCharId, relationType, description),
    getByNovel: (novelId: string) => ipcRenderer.invoke('characterRelation:getByNovel', novelId),
    getByCharacter: (characterId: string) => ipcRenderer.invoke('characterRelation:getByCharacter', characterId),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('characterRelation:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('characterRelation:delete', id),
  },
  worldEntry: {
    create: (novelId: string, name: string, category?: string) => ipcRenderer.invoke('worldEntry:create', novelId, name, category),
    getByNovel: (novelId: string) => ipcRenderer.invoke('worldEntry:getByNovel', novelId),
    getByCategory: (novelId: string, category: string) => ipcRenderer.invoke('worldEntry:getByCategory', novelId, category),
    getById: (id: string) => ipcRenderer.invoke('worldEntry:getById', id),
    update: (id: string, data: Record<string, unknown>) => ipcRenderer.invoke('worldEntry:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('worldEntry:delete', id),
  },
  entryLink: {
    create: (fromEntryId: string, toEntryId: string, linkType?: string) => ipcRenderer.invoke('entryLink:create', fromEntryId, toEntryId, linkType),
    getByEntry: (entryId: string) => ipcRenderer.invoke('entryLink:getByEntry', entryId),
    delete: (id: string) => ipcRenderer.invoke('entryLink:delete', id),
  },
  writingGoal: {
    createOrUpdate: (novelId: string, date: string, targetWordCount: number) => ipcRenderer.invoke('writingGoal:createOrUpdate', novelId, date, targetWordCount),
    getByNovel: (novelId: string) => ipcRenderer.invoke('writingGoal:getByNovel', novelId),
    getByDate: (novelId: string, date: string) => ipcRenderer.invoke('writingGoal:getByDate', novelId, date),
    updateActualCount: (id: string, count: number) => ipcRenderer.invoke('writingGoal:updateActualCount', id, count),
    delete: (id: string) => ipcRenderer.invoke('writingGoal:delete', id),
  },
  export: {
    txt: () => ipcRenderer.invoke('export:txt'),
    epub: () => ipcRenderer.invoke('export:epub'),
  },
  license: {
    verify: (key: string) => ipcRenderer.invoke('license:verify', key),
    save: (key: string, email?: string) => ipcRenderer.invoke('license:save', key, email),
    load: () => ipcRenderer.invoke('license:load'),
    isActivated: () => ipcRenderer.invoke('license:isActivated'),
    clear: () => ipcRenderer.invoke('license:clear'),
  },
});
