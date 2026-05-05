import type { Novel, Volume, Chapter, Snapshot } from '@novel-writer/core';

export interface NovelWriterAPI {
  novel: {
    create: (title: string) => Promise<Novel>;
    getAll: () => Promise<Novel[]>;
    getById: (id: string) => Promise<Novel | undefined>;
    update: (id: string, data: Partial<Novel>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  volume: {
    create: (novelId: string, title: string) => Promise<Volume>;
    getByNovel: (novelId: string) => Promise<Volume[]>;
    update: (id: string, data: Partial<Volume>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    reorder: (ids: string[]) => Promise<void>;
  };
  chapter: {
    create: (volumeId: string, title: string) => Promise<Chapter>;
    getByVolume: (volumeId: string) => Promise<Chapter[]>;
    getById: (id: string) => Promise<Chapter | undefined>;
    updateContent: (id: string, content: string) => Promise<void>;
    update: (id: string, data: Partial<Chapter>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    reorder: (ids: string[]) => Promise<void>;
  };
  snapshot: {
    create: (chapterId: string, content: string) => Promise<Snapshot>;
    getByChapter: (chapterId: string) => Promise<Snapshot[]>;
  };
  export: {
    txt: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
    epub: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
  };
}

declare global {
  interface Window {
    novelWriter: NovelWriterAPI;
  }
}
