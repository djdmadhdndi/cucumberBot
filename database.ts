import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const imageDir = path.join(process.cwd(), 'images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}
const dbPath = path.join(process.cwd(), 'data.db');
const db: Database.Database = new Database(dbPath);
// const db = new Database(dbPath);
// 에러가 생기는 이유: typescript가 db의 정확한 타입을 모름
// 해결법: Database.Database로 타입을 명시해줌
db.exec(`
    CREATE TABLE IF NOT EXISTS image_memes(
        keyword TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        original_name TEXT,
        creator_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);
    export default db;