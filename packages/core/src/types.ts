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
