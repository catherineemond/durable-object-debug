### About

This is a minimal setup to reproduce a production issue observed with DurableObject's SQLite storage.

### Issue

The issue happens with Cloudflare workers in production environment and can be reproduced locally. Specific columns in existing rows are unexpectedly becoming null.

### Likely explanation

Migration `002` recreates the table every time the migrations are run.  The columns added in the subsequent migrations (`003` and `004`) are not included and the values are lost.

### Steps to reproduce

* Start worker: `pnpm install` and `pnpm dev`
* POST request:

```
curl -X POST "http://localhost:8787/api/flags" \
  -H "Content-Type: application/json" \
  -d "{\"handle\":\"flag_1\",\"clientHandle\":\"test\",\"version\":1,\"telemetrySchemaId\":\"123\",\"controlConfig\":\"{'valid':true}\"}"
```

**What you should see**: `200 OK` response; database updated.

* GET request:

```
curl -X GET "http://localhost:8787/api/flags?handle=test"
```

**What you should see**: `200 OK` response; some fields `null` both in response and in database. This is unexpected.

### Important

* The initial GET request can return a valid response (with values present).
* Wait ~1 min & let the worker be idle, then make the GET request.

### Example response

```
{"clientHandle":"test","handle":"flag_1","version":1,"createdAt":"2025-04-26 00:24:51","updatedAt":"2025-04-26 00:24:51","telemetrySchemaId":null,"controlConfig":null}
```

### Check SQLite

* `cd .wrangler/state/v3/do/durable-object-starter-FlagDO`
* `sqlite3 <do-hexadecimal-id>.sqlite`
* `select * from flags;`
