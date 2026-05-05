import { getDb } from '../database.js';
import type { Snapshot } from '../types.js';

export const snapshotDao = {
  create(chapterId: string, content: string): Snapshot {
    const id = crypto.randomUUID();
    const wordCount = content.replace(/[\s\n\r\t]+/g, '').length;
    getDb().prepare(`
      INSERT INTO snapshots (id, chapter_id, content, word_count, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, chapterId, content, wordCount, new Date().toISOString());
    return this.getById(id)!;
  },

  getByChapter(chapterId: string): Snapshot[] {
    return getDb().prepare(
      'SELECT * FROM snapshots WHERE chapter_id = ? ORDER BY created_at DESC'
    ).all(chapterId) as Snapshot[];
  },

  getById(id: string): Snapshot | undefined {
    return getDb().prepare('SELECT * FROM snapshots WHERE id = ?').get(id) as Snapshot | undefined;
  },

  deleteOld(chapterId: string, keepCount: number = 50): void {
    getDb().prepare(`
      DELETE FROM snapshots WHERE id IN (
        SELECT id FROM snapshots WHERE chapter_id = ?
        ORDER BY created_at DESC LIMIT -1 OFFSET ?
      )
    `).run(chapterId, keepCount);
  },
};
