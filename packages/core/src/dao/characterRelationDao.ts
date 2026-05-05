import { getDb } from '../database.js';
import type { CharacterRelation } from '../types.js';

export const characterRelationDao = {
  create(novelId: string, fromCharacterId: string, toCharacterId: string, relationType: string, description = ''): CharacterRelation {
    const id = crypto.randomUUID();
    getDb().prepare(`
      INSERT INTO character_relations (id, novel_id, from_character_id, to_character_id, relation_type, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, novelId, fromCharacterId, toCharacterId, relationType, description, new Date().toISOString());
    return this.getById(id)!;
  },

  getById(id: string): CharacterRelation | undefined {
    return getDb().prepare('SELECT * FROM character_relations WHERE id = ?').get(id) as CharacterRelation | undefined;
  },

  getByNovel(novelId: string): CharacterRelation[] {
    return getDb().prepare(
      'SELECT * FROM character_relations WHERE novel_id = ? ORDER BY created_at DESC'
    ).all(novelId) as CharacterRelation[];
  },

  getByCharacter(characterId: string): CharacterRelation[] {
    return getDb().prepare(
      'SELECT * FROM character_relations WHERE from_character_id = ? OR to_character_id = ? ORDER BY created_at DESC'
    ).all(characterId, characterId) as CharacterRelation[];
  },

  update(id: string, data: Partial<CharacterRelation>): void {
    const fields = Object.keys(data)
      .filter(k => k !== 'id' && k !== 'novel_id')
      .map(k => `${k} = ?`);
    const values = Object.entries(data)
      .filter(([k]) => k !== 'id' && k !== 'novel_id')
      .map(([, v]) => v);
    if (fields.length === 0) return;
    values.push(id);
    getDb().prepare(`UPDATE character_relations SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM character_relations WHERE id = ?').run(id);
  },
};
