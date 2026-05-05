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
