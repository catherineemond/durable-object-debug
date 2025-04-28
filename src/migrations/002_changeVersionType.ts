export default `CREATE TABLE IF NOT EXISTS flags_v2
(
  clientHandle             TEXT PRIMARY KEY,
  handle                   TEXT    NOT NULL,
  version                  INTEGER NOT NULL,
  createdAt                TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt                TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR
REPLACE INTO flags_v2 (clientHandle,
                       handle,
                       version,
                       createdAt,
                       updatedAt)
SELECT clientHandle,
       handle,
       version,
       createdAt,
       updatedAt
FROM flags;

DROP TABLE flags;
ALTER TABLE flags_v2
  RENAME TO flags;`;
