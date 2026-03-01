import { Database } from 'sqlite';

/**
 * Enriches a list of stop IDs with their corresponding names from the database.
 * @param db The SQLite database connection.
 * @param stopIds An array of stop_id strings.
 * @returns A promise resolving to a record mapping stop_id to stop_name.
 */
export async function getStopNamesByIds(db: Database, stopIds: string[]): Promise<Record<string, string>> {
  if (stopIds.length === 0) {
    return {};
  }

  // Deduplicate IDs to minimize query size
  const uniqueIds = [...new Set(stopIds)];
  const placeholders = uniqueIds.map(() => '?').join(',');
  const query = `SELECT stop_id, stop_name FROM stops WHERE stop_id IN (${placeholders})`;
  
  const rows = await db.all(query, ...uniqueIds);
  
  return Object.fromEntries(
    rows.map((row: any) => [row.stop_id, row.stop_name])
  );
}
