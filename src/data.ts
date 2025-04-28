import { DurableObject } from 'cloudflare:workers';
import { migrations } from './migrations/index';

export class FlagDO extends DurableObject {
    sql: SqlStorage;
  
    constructor(ctx: DurableObjectState, env: unknown) {
      super(ctx, env);
      this.sql = ctx.storage.sql;
      console.log(`>>> DO Constructor called for ID: ${this.ctx.id.toString()}`);
      this.migrate();
    }
  
    migrate() {
      migrations.forEach((migration: string) => {
        this.sql.exec(migration);
      });
    }
  
    async upsertFlag(flag: any) {
      const clientHandle = flag.clientHandle || 'UNKNOWN';
      console.log(`>>> upsertFlag called for clientHandle: ${clientHandle}`);
  
      const allColumns = [
        'clientHandle', 'handle',
        'version', 'telemetrySchemaId', 'controlConfig'
      ];
  
      const placeholders = allColumns.map(() => '?').join(',');
      const query = `INSERT OR REPLACE INTO flags (${allColumns.join(',')}) VALUES (${placeholders});`;
  
      const values = [
        flag.clientHandle,
        flag.handle || 'default-handle',
        flag.version || 1,
        flag.telemetrySchemaId || null,
        flag.controlConfig || null
      ];
  
      try {
        const result = this.sql.exec(query, ...values);
        console.log(`>>> upsertFlag completed, rowsWritten: ${result.rowsWritten}`);
        return { success: true };
      } catch (e) {
        console.error(`Error during upsertFlag:`, e);
        throw e;
      }
    }
  
    async getFlagByClientHandle(clientHandle: string) {
      console.log(`>>> getFlagByClientHandle called for: ${clientHandle}`);
      try {
        const flag = this.sql.exec(
          `SELECT * FROM flags WHERE clientHandle = ?;`, 
          clientHandle
        ).one();
        return flag;
      } catch (e) {
        console.error(`Error getting flag:`, e);
        return null;
      }
    }
  }
  