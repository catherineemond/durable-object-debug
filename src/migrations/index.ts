import createFlagsTable from './001_createFlagsTable';
import changeVersionType from './002_changeVersionType';
import addSchemaId from './003_addSchemaId';
import addControlConfig from './004_addControlConfig';

export const migrations = [
  createFlagsTable,
  changeVersionType,
  addSchemaId,
  addControlConfig,
];
