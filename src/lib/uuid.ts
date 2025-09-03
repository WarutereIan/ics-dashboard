import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new UUID v4
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a UUID for a new outcome
 */
export function generateOutcomeId(): string {
  return generateUuid();
}

/**
 * Generate a UUID for a new activity
 */
export function generateActivityId(): string {
  return generateUuid();
}

/**
 * Generate a UUID for a new KPI
 */
export function generateKpiId(): string {
  return generateUuid();
}

/**
 * Generate a UUID for a new project
 */
export function generateProjectId(): string {
  return generateUuid();
}
