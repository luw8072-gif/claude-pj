export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Volume {
  id: string;
  novel_id: string;
  title: string;
  sort_order: number;
  summary: string;
}

export interface Chapter {
  id: string;
  volume_id: string;
  title: string;
  sort_order: number;
  content: string;
  word_count: number;
  status: 'draft' | 'review' | 'published';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Snapshot {
  id: string;
  chapter_id: string;
  content: string;
  word_count: number;
  created_at: string;
}

export interface Character {
  id: string;
  novel_id: string;
  name: string;
  aliases: string;
  attributes: Record<string, unknown>;
  bio: string;
  avatar_path: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterRelation {
  id: string;
  novel_id: string;
  from_character_id: string;
  to_character_id: string;
  relation_type: string;
  description: string;
  created_at: string;
}

export interface WorldEntry {
  id: string;
  novel_id: string;
  name: string;
  category: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EntryLink {
  id: string;
  from_entry_id: string;
  to_entry_id: string;
  link_type: string;
  created_at: string;
}

export interface WritingGoal {
  id: string;
  novel_id: string;
  target_date: string;
  target_word_count: number;
  actual_word_count: number;
  created_at: string;
  updated_at: string;
}
