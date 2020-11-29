import { Schema, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type ObjectId = Types.ObjectId;

/**
 * Hash user password using bcrypt
 * @param value
 */
export function toHash(value: string, rounds = 10): string {
  return value ? bcrypt.hashSync(value, rounds) : value;
}

/**
 * Return value as objectId if the value is a valid bson ObjectId, else return the value
 * @param value
 */
export function toObjectId(value: string) {
  return Types.ObjectId.isValid(value) ? Types.ObjectId(value) : value;
}

/**
 * Return the ObjectId id as a 24 byte hex string representation
 * @param value
 */
export function toHexString(value: ObjectId) {
  return value.toHexString();
}

/**
 * Checks the filter object for a valid objectID string then transforms it into ObjectID format
 * @param filter
 */
export function checkFilterForObjectId(filter: Object) {
  const [key, value] = Object.entries(filter)[0] as [string, string];
  if (Types.ObjectId.isValid(value) && typeof value == 'string') {
    filter[key] = Types.ObjectId(value);
  }

  return filter;
}

/**
 * Creates inclusion projection object with all the fields in the schema model
 * @param schema model schema in database
 * @param include extra values to include in projection
 */
export function createInclusionProjection(schema: Schema, include?: string[]) {
  const keys = Object.keys(schema.obj);
  if (include) keys.push(...include);

  let projection: Object = {};
  for (const key of keys) {
    projection[key] = 1;
  }

  return projection;
}
