CREATE TABLE IF NOT EXISTS image_assets (
  slot TEXT PRIMARY KEY,
  photo_id INTEGER NOT NULL,
  object_key TEXT NOT NULL,
  photographer TEXT NOT NULL,
  photographer_url TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
