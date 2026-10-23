import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

export type Mood = {
  date: string; // YYYY-MM-DD (하루에 하나)
  score: number; // 1~5
  note: string;
  updatedAt: string;
};

const globalForDb = globalThis as unknown as { moodDb?: DatabaseSync };

function open(): DatabaseSync {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "mood.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS moods (
      date       TEXT PRIMARY KEY,
      score      INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
      note       TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

// dev 서버의 핫 리로드에서도 연결을 하나만 유지
const db = (globalForDb.moodDb ??= open());

type Row = { date: string; score: number; note: string; updated_at: string };
const toMood = (r: Row): Mood => ({
  date: r.date,
  score: r.score,
  note: r.note,
  updatedAt: r.updated_at,
});

export function listMoods(limit = 60): Mood[] {
  const rows = db
    .prepare("SELECT * FROM moods ORDER BY date DESC LIMIT ?")
    .all(limit) as Row[];
  return rows.map(toMood);
}

export function upsertMood(date: string, score: number, note: string): Mood {
  db.prepare(
    `INSERT INTO moods (date, score, note) VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       score = excluded.score,
       note = excluded.note,
       updated_at = datetime('now')`,
  ).run(date, score, note);
  return toMood(db.prepare("SELECT * FROM moods WHERE date = ?").get(date) as Row);
}

export function deleteMood(date: string): boolean {
  return Number(db.prepare("DELETE FROM moods WHERE date = ?").run(date).changes) > 0;
}
