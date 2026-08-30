import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

export interface Database {
  users: any[];
}

let db: Database = { users: [] };

if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB_FILE', err);
  }
}

export function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getDb() {
  return db;
}
