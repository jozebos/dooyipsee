-- Dooyipsee D1 Schema

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_anon ON sessions (anonymous_id, created_at DESC);

CREATE TABLE IF NOT EXISTS readings (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  anonymous_id TEXT NOT NULL,
  spread_type TEXT NOT NULL,
  deck_id TEXT NOT NULL DEFAULT 'classic',
  persona_id TEXT NOT NULL,
  question TEXT,
  cards_json TEXT NOT NULL,
  reading_text TEXT NOT NULL,
  reading_excerpt TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_readings_anon ON readings (anonymous_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_created ON readings (created_at DESC);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  reading_id TEXT NOT NULL,
  anonymous_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('like', 'dislike')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reading_id) REFERENCES readings(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_feedback_unique ON feedback (reading_id, anonymous_id);

CREATE TABLE IF NOT EXISTS shared_readings (
  id TEXT PRIMARY KEY,
  reading_id TEXT NOT NULL UNIQUE,
  share_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reading_id) REFERENCES readings(id)
);
