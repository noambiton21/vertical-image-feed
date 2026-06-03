import { db } from './connection.js';

const likeStmt = db.prepare('INSERT INTO likes (photo_id) VALUES (?) ON CONFLICT DO NOTHING');
const unlikeStmt = db.prepare('DELETE FROM likes WHERE photo_id = ?');

export function like(photoId: string): void {
  likeStmt.run(photoId);
}

export function unlike(photoId: string): void {
  unlikeStmt.run(photoId);
}

export function getLikedSet(photoIds: string[]): Set<string> {
  if (photoIds.length === 0) return new Set();

  const placeholders = photoIds.map(() => '?').join(', ');
  const rows = db
    .prepare(`SELECT photo_id FROM likes WHERE photo_id IN (${placeholders})`)
    .all(...photoIds) as Array<{ photo_id: string }>;

  return new Set(rows.map((row) => row.photo_id));
}
