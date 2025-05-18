import Database from "better-sqlite3";

export type InterfaceItem = {
  userid: string;
  interface_name: string;
  ip_address: string;
}

const db = new Database("./database/interfaces.db");

// 初回起動時のみテーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS interfaces (
    userid TEXT NOT NULL PRIMARY KEY,
    interface_name TEXT NOT NULL,
    ip_address TEXT NOT NULL
  );
`);

export default db;
