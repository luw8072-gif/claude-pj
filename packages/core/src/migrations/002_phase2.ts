import type Database from 'better-sqlite3';

export function up(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      novel_id TEXT NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT '',
      aliases TEXT NOT NULL DEFAULT '',
      attributes TEXT NOT NULL DEFAULT '{}',
      bio TEXT NOT NULL DEFAULT '',
      avatar_path TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_characters_novel_id ON characters(novel_id);

    CREATE TABLE IF NOT EXISTS character_relations (
      id TEXT PRIMARY KEY,
      novel_id TEXT NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
      from_character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      to_character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      relation_type TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_char_rel_from ON character_relations(from_character_id);
    CREATE INDEX IF NOT EXISTS idx_char_rel_novel ON character_relations(novel_id);

    CREATE TABLE IF NOT EXISTS world_entries (
      id TEXT PRIMARY KEY,
      novel_id TEXT NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_world_entries_novel ON world_entries(novel_id);
    CREATE INDEX IF NOT EXISTS idx_world_entries_cat ON world_entries(novel_id, category);

    CREATE TABLE IF NOT EXISTS entry_links (
      id TEXT PRIMARY KEY,
      from_entry_id TEXT NOT NULL REFERENCES world_entries(id) ON DELETE CASCADE,
      to_entry_id TEXT NOT NULL REFERENCES world_entries(id) ON DELETE CASCADE,
      link_type TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_entry_links_from ON entry_links(from_entry_id);

    CREATE TABLE IF NOT EXISTS writing_goals (
      id TEXT PRIMARY KEY,
      novel_id TEXT NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
      target_date TEXT NOT NULL,
      target_word_count INTEGER NOT NULL DEFAULT 0,
      actual_word_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(novel_id, target_date)
    );
    CREATE INDEX IF NOT EXISTS idx_goals_novel_date ON writing_goals(novel_id, target_date);
  `);

  db.prepare('INSERT OR IGNORE INTO migrations (name) VALUES (?)').run('002_phase2');
}

export function down(db: Database.Database): void {
  db.exec(`
    DROP TABLE IF EXISTS entry_links;
    DROP TABLE IF EXISTS world_entries;
    DROP TABLE IF EXISTS character_relations;
    DROP TABLE IF EXISTS characters;
    DROP TABLE IF EXISTS writing_goals;
    DELETE FROM migrations WHERE name = '002_phase2';
  `);
}
