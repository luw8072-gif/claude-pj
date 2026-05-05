import { getDb } from '../database.js';
import type { Character } from '../types.js';

export const characterDao = {
  create(novelId: string, name: string): Character {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const maxOrder = db.prepare(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM characters WHERE novel_id = ?'
    ).get(novelId) as { next: number };
    db.prepare(`
      INSERT INTO characters (id, novel_id, name, aliases, attributes, bio, avatar_path, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, '', '{}', '', '', ?, ?, ?)
    `).run(id, novelId, name, maxOrder.next, now, now);
    return this.getById(id)!;
  },

  getByNovel(novelId: string): Character[] {
    return getDb().prepare(
      'SELECT * FROM characters WHERE novel_id = ? ORDER BY sort_order ASC'
    ).all(novelId) as Character[];
  },

  getById(id: string): Character | undefined {
    return getDb().prepare('SELECT * FROM characters WHERE id = ?').get(id) as Character | undefined;
  },

  update(id: string, data: Partial<Character>): void {
    const fields = Object.keys(data)
      .filter(k => k !== 'id' && k !== 'novel_id')
      .map(k => `${k} = ?`);
    const values = Object.entries(data)
      .filter(([k]) => k !== 'id' && k !== 'novel_id')
      .map(([k, v]) => k === 'attributes' && typeof v === 'object' ? JSON.stringify(v) : v);
    if (fields.length === 0) return;
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    getDb().prepare(`UPDATE characters SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM characters WHERE id = ?').run(id);
  },

  reorder(ids: string[]): void {
    const stmt = getDb().prepare('UPDATE characters SET sort_order = ? WHERE id = ?');
    getDb().transaction(() => {
      ids.forEach((id, index) => stmt.run(index, id));
    })();
  },
};
