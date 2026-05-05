import { getDb } from '../database.js';
import type { WritingGoal } from '../types.js';

export const writingGoalDao = {
  createOrUpdate(novelId: string, targetDate: string, targetWordCount: number): WritingGoal {
    const db = getDb();
    const now = new Date().toISOString();
    const existing = db.prepare(
      'SELECT id FROM writing_goals WHERE novel_id = ? AND target_date = ?'
    ).get(novelId, targetDate) as { id: string } | undefined;

    if (existing) {
      db.prepare(
        'UPDATE writing_goals SET target_word_count = ?, updated_at = ? WHERE id = ?'
      ).run(targetWordCount, now, existing.id);
      return this.getById(existing.id)!;
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO writing_goals (id, novel_id, target_date, target_word_count, actual_word_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(id, novelId, targetDate, targetWordCount, now, now);
    return this.getById(id)!;
  },

  getById(id: string): WritingGoal | undefined {
    return getDb().prepare('SELECT * FROM writing_goals WHERE id = ?').get(id) as WritingGoal | undefined;
  },

  getByNovel(novelId: string): WritingGoal[] {
    return getDb().prepare(
      'SELECT * FROM writing_goals WHERE novel_id = ? ORDER BY target_date DESC'
    ).all(novelId) as WritingGoal[];
  },

  getByDate(novelId: string, targetDate: string): WritingGoal | undefined {
    return getDb().prepare(
      'SELECT * FROM writing_goals WHERE novel_id = ? AND target_date = ?'
    ).get(novelId, targetDate) as WritingGoal | undefined;
  },

  updateActualCount(id: string, count: number): void {
    getDb().prepare('UPDATE writing_goals SET actual_word_count = ?, updated_at = ? WHERE id = ?')
      .run(count, new Date().toISOString(), id);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM writing_goals WHERE id = ?').run(id);
  },
};
