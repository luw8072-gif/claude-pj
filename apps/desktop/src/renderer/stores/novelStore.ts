import { create } from 'zustand';
import type { Novel, Volume, Chapter } from '@novel-writer/core';

interface NovelState {
  novels: Novel[];
  currentNovel: Novel | null;
  volumes: Volume[];
  chapters: Record<string, Chapter[]>;
  currentChapterId: string | null;
  currentChapter: Chapter | null;
  loading: boolean;

  loadNovels: () => Promise<void>;
  createNovel: (title: string) => Promise<Novel>;
  selectNovel: (novelId: string) => Promise<void>;
  createVolume: (title: string) => Promise<void>;
  deleteVolume: (volumeId: string) => Promise<void>;
  createChapter: (volumeId: string, title: string) => Promise<void>;
  selectChapter: (chapterId: string) => Promise<void>;
  updateChapterContent: (content: string) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
}

export const useNovelStore = create<NovelState>((set, get) => ({
  novels: [],
  currentNovel: null,
  volumes: [],
  chapters: {},
  currentChapterId: null,
  currentChapter: null,
  loading: false,

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
}));
