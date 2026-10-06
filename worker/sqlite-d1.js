import { DatabaseSync } from 'node:sqlite';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Connects directly to the real Wrangler D1 SQLite database
export function getWranglerD1Database() {
  const d1Dir = join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
  let sqliteFile = null;

  if (existsSync(d1Dir)) {
    const files = readdirSync(d1Dir);
    const mainSqlite = files.find(f => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
    if (mainSqlite) {
      sqliteFile = join(d1Dir, mainSqlite);
    }
  }

  if (!sqliteFile) {
    sqliteFile = join(process.cwd(), '.local-d1.sqlite');
  }

  const rawDb = new DatabaseSync(sqliteFile);

  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              try {
                const stmt = rawDb.prepare(sql);
                const info = stmt.run(...args);
                return { success: true, meta: info };
              } catch (e) {
                console.error('D1 Run Error:', e.message, 'SQL:', sql, 'Args:', args);
                throw e;
              }
            },
            async first() {
              try {
                const stmt = rawDb.prepare(sql);
                const row = stmt.get(...args);
                return row || null;
              } catch (e) {
                console.error('D1 First Error:', e.message, 'SQL:', sql, 'Args:', args);
                throw e;
              }
            },
            async all() {
              try {
                const stmt = rawDb.prepare(sql);
                const results = stmt.all(...args);
                return { results };
              } catch (e) {
                console.error('D1 All Error:', e.message, 'SQL:', sql, 'Args:', args);
                throw e;
              }
            }
          };
        },
        async run() {
          try {
            const stmt = rawDb.prepare(sql);
            const info = stmt.run();
            return { success: true, meta: info };
          } catch (e) {
            console.error('D1 Run Error:', e.message, 'SQL:', sql);
            throw e;
          }
        },
        async first() {
          try {
            const stmt = rawDb.prepare(sql);
            const row = stmt.get();
            return row || null;
          } catch (e) {
            console.error('D1 First Error:', e.message, 'SQL:', sql);
            throw e;
          }
        },
        async all() {
          try {
            const stmt = rawDb.prepare(sql);
            const results = stmt.all();
            return { results };
          } catch (e) {
            console.error('D1 All Error:', e.message, 'SQL:', sql);
            throw e;
          }
        }
      };
    }
  };
}
