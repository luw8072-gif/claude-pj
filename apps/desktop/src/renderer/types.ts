import type { Novel, Volume, Chapter, Snapshot, Character, CharacterRelation, WorldEntry, EntryLink, WritingGoal } from '@novel-writer/core';

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
    getById: (id: string) => Promise<Snapshot | undefined>;
  };
  character: {
    create: (novelId: string, name: string) => Promise<Character>;
    getByNovel: (novelId: string) => Promise<Character[]>;
    getById: (id: string) => Promise<Character | undefined>;
    update: (id: string, data: Partial<Character>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    reorder: (ids: string[]) => Promise<void>;
  };
  characterRelation: {
    create: (novelId: string, fromCharId: string, toCharId: string, relationType: string, description?: string) => Promise<CharacterRelation>;
    getByNovel: (novelId: string) => Promise<CharacterRelation[]>;
    getByCharacter: (characterId: string) => Promise<CharacterRelation[]>;
    update: (id: string, data: Partial<CharacterRelation>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  worldEntry: {
    create: (novelId: string, name: string, category?: string) => Promise<WorldEntry>;
    getByNovel: (novelId: string) => Promise<WorldEntry[]>;
    getByCategory: (novelId: string, category: string) => Promise<WorldEntry[]>;
    getById: (id: string) => Promise<WorldEntry | undefined>;
    update: (id: string, data: Partial<WorldEntry>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  entryLink: {
    create: (fromEntryId: string, toEntryId: string, linkType?: string) => Promise<EntryLink>;
    getByEntry: (entryId: string) => Promise<EntryLink[]>;
    delete: (id: string) => Promise<void>;
  };
  writingGoal: {
    createOrUpdate: (novelId: string, date: string, targetWordCount: number) => Promise<WritingGoal>;
    getByNovel: (novelId: string) => Promise<WritingGoal[]>;
    getByDate: (novelId: string, date: string) => Promise<WritingGoal | undefined>;
    updateActualCount: (id: string, count: number) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  export: {
    txt: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
    epub: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
  };
  license: {
    verify: (key: string) => Promise<{ valid: boolean; message: string }>;
    save: (key: string, email?: string) => Promise<{ success: boolean }>;
    load: () => Promise<{ key: string; activatedAt: string; email?: string } | null>;
    isActivated: () => Promise<boolean>;
    clear: () => Promise<{ success: boolean }>;
  };
}

declare global {
  interface Window {
    novelWriter: NovelWriterAPI;
  }
}
