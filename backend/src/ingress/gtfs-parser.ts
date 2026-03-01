import type { transit_realtime } from 'gtfs-realtime-bindings';

/**
 * Parses the timestamp from a GTFS TripUpdate into a native TypeScript Date object.
 * GTFS timestamps are typically in seconds since the Unix epoch.
 */
export function parseTripUpdateTimestamp(tripUpdate: transit_realtime.ITripUpdate | null | undefined): Date | null {
  const timestamp = tripUpdate?.timestamp;
  if (timestamp === null || timestamp === undefined) {
    return null;
  }

  // Handle both long (from some Protobuf implementations) and number
  const timestampNumber = typeof timestamp === 'number' ? timestamp : Number(timestamp);

  if (isNaN(timestampNumber)) {
    return null;
  }

  return new Date(timestampNumber * 1000);
}
