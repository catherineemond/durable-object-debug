export default `CREATE TABLE IF NOT EXISTS flags
(
  clientHandle             TEXT PRIMARY KEY,
  handle                   TEXT NOT NULL,
  version                  TEXT NOT NULL,
  createdAt                TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt                TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;
