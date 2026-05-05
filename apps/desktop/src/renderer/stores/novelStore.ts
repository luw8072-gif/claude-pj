import { create } from 'zustand';
import type { Novel, Volume, Chapter, Snapshot, Character, CharacterRelation, WorldEntry, WritingGoal } from '@novel-writer/core';

interface NovelState {
  novels: Novel[];
  currentNovel: Novel | null;
  volumes: Volume[];
  chapters: Record<string, Chapter[]>;
  currentChapterId: string | null;
  currentChapter: Chapter | null;
  loading: boolean;
  characters: Character[];
  characterRelations: CharacterRelation[];
  worldEntries: WorldEntry[];
  writingGoals: WritingGoal[];
  snapshots: Snapshot[];
  activeSidebarTab: 'toc' | 'characters' | 'world' | 'snapshots';

  loadNovels: () => Promise<void>;
  createNovel: (title: string) => Promise<Novel>;
  selectNovel: (novelId: string) => Promise<void>;
  createVolume: (title: string) => Promise<void>;
  deleteVolume: (volumeId: string) => Promise<void>;
  createChapter: (volumeId: string, title: string) => Promise<void>;
  selectChapter: (chapterId: string) => Promise<void>;
  updateChapterContent: (content: string) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
  loadCharacters: (novelId: string) => Promise<void>;
  createCharacter: (name: string) => Promise<void>;
  updateCharacter: (id: string, data: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  addCharacterRelation: (fromId: string, toId: string, type: string, desc?: string) => Promise<void>;
  deleteCharacterRelation: (id: string) => Promise<void>;
  loadWorldEntries: (novelId: string) => Promise<void>;
  createWorldEntry: (name: string, category?: string) => Promise<void>;
  updateWorldEntry: (id: string, data: Partial<WorldEntry>) => Promise<void>;
  deleteWorldEntry: (id: string) => Promise<void>;
  loadWritingGoals: (novelId: string) => Promise<void>;
  setWritingGoal: (date: string, target: number) => Promise<void>;
  loadSnapshots: (chapterId: string) => Promise<void>;
  setActiveSidebarTab: (tab: 'toc' | 'characters' | 'world' | 'snapshots') => void;
}

export const useNovelStore = create<NovelState>((set, get) => ({
  novels: [],
  currentNovel: null,
  volumes: [],
  chapters: {},
  currentChapterId: null,
  currentChapter: null,
  loading: false,
  characters: [],
  characterRelations: [],
  worldEntries: [],
  writingGoals: [],
  snapshots: [],
  activeSidebarTab: 'toc',

  loadNovels: async () => {
    const novels = await window.novelWriter.novel.getAll();
    set({ novels });
  },

  createNovel: async (title: string) => {
    const novel = await window.novelWriter.novel.create(title);
    const { novels } = get();
    set({ novels: [novel, ...novels] });
    return novel;
  },

  selectNovel: async (novelId: string) => {
    set({ loading: true, currentChapterId: null, currentChapter: null });
    const novel = await window.novelWriter.novel.getById(novelId);
    if (!novel) { set({ loading: false }); return; }
    const volumes = await window.novelWriter.volume.getByNovel(novelId);
    const chapters: Record<string, Chapter[]> = {};
    for (const vol of volumes) {
      chapters[vol.id] = await window.novelWriter.chapter.getByVolume(vol.id);
    }
    set({ currentNovel: novel, volumes, chapters, loading: false });
  },

  createVolume: async (title: string) => {
    const { currentNovel, volumes } = get();
    if (!currentNovel) return;
    const vol = await window.novelWriter.volume.create(currentNovel.id, title);
    set({ volumes: [...volumes, vol], chapters: { ...get().chapters, [vol.id]: [] } });
  },

  deleteVolume: async (volumeId: string) => {
    await window.novelWriter.volume.delete(volumeId);
    const { volumes, chapters } = get();
    const newChapters = { ...chapters };
    delete newChapters[volumeId];
    set({
      volumes: volumes.filter(v => v.id !== volumeId),
      chapters: newChapters,
    });
  },

  createChapter: async (volumeId: string, title: string) => {
    const chap = await window.novelWriter.chapter.create(volumeId, title);
    const { chapters } = get();
    const volChapters = [...(chapters[volumeId] || []), chap];
    set({ chapters: { ...chapters, [volumeId]: volChapters } });
  },

  selectChapter: async (chapterId: string) => {
    const chapter = await window.novelWriter.chapter.getById(chapterId);
    set({ currentChapterId: chapterId, currentChapter: chapter || null });
  },

  updateChapterContent: async (content: string) => {
    const { currentChapter } = get();
    if (!currentChapter) return;
    await window.novelWriter.chapter.updateContent(currentChapter.id, content);
    set({
      currentChapter: { ...currentChapter, content, word_count: content.replace(/\s/g, '').length },
    });
  },

  deleteChapter: async (chapterId: string) => {
    await window.novelWriter.chapter.delete(chapterId);
    const { chapters, currentChapterId } = get();
    for (const volId of Object.keys(chapters)) {
      const filtered = chapters[volId].filter(c => c.id !== chapterId);
      if (filtered.length !== chapters[volId].length) {
        set({
          chapters: { ...chapters, [volId]: filtered },
          currentChapterId: currentChapterId === chapterId ? null : currentChapterId,
          currentChapter: currentChapterId === chapterId ? null : get().currentChapter,
        });
        return;
      }
    }
  },

  loadCharacters: async (novelId: string) => {
    const characters = await window.novelWriter.character.getByNovel(novelId);
    const characterRelations = await window.novelWriter.characterRelation.getByNovel(novelId);
    set({ characters, characterRelations });
  },

  createCharacter: async (name: string) => {
    const { currentNovel, characters } = get();
    if (!currentNovel) return;
    const character = await window.novelWriter.character.create(currentNovel.id, name);
    set({ characters: [...characters, character] });
  },

  updateCharacter: async (id: string, data: Partial<Character>) => {
    await window.novelWriter.character.update(id, data);
    const { characters } = get();
    set({ characters: characters.map(c => c.id === id ? { ...c, ...data } : c) });
  },

  deleteCharacter: async (id: string) => {
    await window.novelWriter.character.delete(id);
    const { characters } = get();
    set({ characters: characters.filter(c => c.id !== id) });
  },

  addCharacterRelation: async (fromId: string, toId: string, type: string, desc?: string) => {
    const { currentNovel } = get();
    if (!currentNovel) return;
    await window.novelWriter.characterRelation.create(currentNovel.id, fromId, toId, type, desc);
    const characterRelations = await window.novelWriter.characterRelation.getByNovel(currentNovel.id);
    set({ characterRelations });
  },

  deleteCharacterRelation: async (id: string) => {
    await window.novelWriter.characterRelation.delete(id);
    set({ characterRelations: get().characterRelations.filter(r => r.id !== id) });
  },

  loadWorldEntries: async (novelId: string) => {
    const entries = await window.novelWriter.worldEntry.getByNovel(novelId);
    set({ worldEntries: entries });
  },

  createWorldEntry: async (name: string, category?: string) => {
    const { currentNovel, worldEntries } = get();
    if (!currentNovel) return;
    const entry = await window.novelWriter.worldEntry.create(currentNovel.id, name, category);
    set({ worldEntries: [...worldEntries, entry] });
  },

  updateWorldEntry: async (id: string, data: Partial<WorldEntry>) => {
    await window.novelWriter.worldEntry.update(id, data);
    set({ worldEntries: get().worldEntries.map(e => e.id === id ? { ...e, ...data } : e) });
  },

  deleteWorldEntry: async (id: string) => {
    await window.novelWriter.worldEntry.delete(id);
    set({ worldEntries: get().worldEntries.filter(e => e.id !== id) });
  },

  loadWritingGoals: async (novelId: string) => {
    const goals = await window.novelWriter.writingGoal.getByNovel(novelId);
    set({ writingGoals: goals });
  },

  setWritingGoal: async (date: string, target: number) => {
    const { currentNovel } = get();
    if (!currentNovel) return;
    await window.novelWriter.writingGoal.createOrUpdate(currentNovel.id, date, target);
    const writingGoals = await window.novelWriter.writingGoal.getByNovel(currentNovel.id);
    set({ writingGoals });
  },

  loadSnapshots: async (chapterId: string) => {
    const snapshots = await window.novelWriter.snapshot.getByChapter(chapterId);
    set({ snapshots });
  },

  setActiveSidebarTab: (tab: 'toc' | 'characters' | 'world' | 'snapshots') => {
    set({ activeSidebarTab: tab });
  },
}));
