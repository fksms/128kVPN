import Database from 'better-sqlite3';
import { maxInterfaceNameLength, maxInterfaces } from '@/env';

const db = new Database('wg_interfaces.db');

// テーブル作成（重複作成はされない）
db.exec(`
  CREATE TABLE IF NOT EXISTS wg_interfaces (
    id INTEGER NOT NULL PRIMARY KEY,
    userid TEXT NOT NULL,
    name TEXT NOT NULL CHECK(name <> '') CHECK(LENGTH(name) <= ${maxInterfaceNameLength}),
    ip_address TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    UNIQUE(userid, name)
  );
`);

// トリガー削除（重複作成防止）
db.exec(`DROP TRIGGER IF EXISTS limit_interface_count`);

// トリガー作成
db.exec(`
  CREATE TRIGGER limit_interface_count
  BEFORE INSERT ON wg_interfaces
  WHEN (
    (SELECT COUNT(*) FROM wg_interfaces WHERE userid = NEW.userid) >= ${maxInterfaces}
  )
  BEGIN
    SELECT RAISE(ABORT, 'The maximum number of interfaces has been exceeded');
  END;
`);

export { db };
