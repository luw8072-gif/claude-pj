import { getDb } from '../database.js';
import type { Chapter } from '../types.js';

function countWords(text: string): number {
  return text.replace(/[\s\n\r\t]+/g, '').length;
}

export const chapterDao = {
  create(volumeId: string, title: string): Chapter {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const vol = db.prepare('SELECT novel_id FROM volumes WHERE id = ?').get(volumeId) as { novel_id: string } | undefined;
    if (!vol) throw new Error('Volume not found');
    const maxOrder = db.prepare(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM chapters WHERE volume_id = ?'
    ).get(volumeId) as { next: number };
    db.prepare(`
      INSERT INTO chapters (id, volume_id, title, sort_order, content, word_count, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, '', 0, 'draft', '', ?, ?)
    `).run(id, volumeId, title, maxOrder.next, now, now);
    db.prepare('UPDATE novels SET updated_at = ? WHERE id = ?').run(now, vol.novel_id);
    return this.getById(id)!;
  },

  getByVolume(volumeId: string): Chapter[] {
    return getDb().prepare(
      'SELECT * FROM chapters WHERE volume_id = ? ORDER BY sort_order ASC'
    ).all(volumeId) as Chapter[];
  },

  getById(id: string): Chapter | undefined {
    return getDb().prepare('SELECT * FROM chapters WHERE id = ?').get(id) as Chapter | undefined;
  },

  updateContent(id: string, content: string): void {
    const db = getDb();
    const now = new Date().toISOString();
    const wordCount = countWords(content);
    const chap = db.prepare(
      'SELECT v.novel_id FROM chapters c JOIN volumes v ON c.volume_id = v.id WHERE c.id = ?'
    ).get(id) as { novel_id: string } | undefined;
    db.prepare(
      'UPDATE chapters SET content = ?, word_count = ?, updated_at = ? WHERE id = ?'
    ).run(content, wordCount, now, id);
    if (chap) {
      db.prepare('UPDATE novels SET updated_at = ? WHERE id = ?').run(now, chap.novel_id);
    }
  },

  update(id: string, data: Partial<Chapter>): void {
    const fields = Object.keys(data)
      .filter(k => k !== 'id' && k !== 'volume_id')
      .map(k => `${k} = ?`);
    const values = Object.entries(data)
      .filter(([k]) => k !== 'id' && k !== 'volume_id')
      .map(([, v]) => v);
    if (fields.length === 0) return;
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    getDb().prepare(`UPDATE chapters SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  delete(id: string): void {
    const db = getDb();
    const now = new Date().toISOString();
    const chap = db.prepare(
      'SELECT v.novel_id FROM chapters c JOIN volumes v ON c.volume_id = v.id WHERE c.id = ?'
    ).get(id) as { novel_id: string } | undefined;
    db.prepare('DELETE FROM chapters WHERE id = ?').run(id);
    if (chap) {
      db.prepare('UPDATE novels SET updated_at = ? WHERE id = ?').run(now, chap.novel_id);
    }
  },

  reorder(ids: string[]): void {
    const db = getDb();
    const stmt = db.prepare('UPDATE chapters SET sort_order = ? WHERE id = ?');
    const tx = db.transaction(() => {
      ids.forEach((id, index) => stmt.run(index, id));
    });
    tx();
  },
};
