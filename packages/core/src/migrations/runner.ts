import type Database from 'better-sqlite3';
import { up as up001 } from './001_initial.js';
import { up as up002 } from './002_phase2.js';

interface Migration {
  name: string;
  up: (db: Database.Database) => void;
}

const migrations: Migration[] = [
  { name: '001_initial', up: up001 },
  { name: '002_phase2', up: up002 },
];

export function runMigrations(db: Database.Database): void {
  const applied = new Set(
    db.prepare('SELECT name FROM migrations').all().map((r: any) => r.name)
  );
  for (const m of migrations) {
    if (!applied.has(m.name)) {
      m.up(db);
      db.prepare('INSERT OR IGNORE INTO migrations (name) VALUES (?)').run(m.name);
    }
  }
}
