import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { getStopNamesByIds } from './ingress/stop-enricher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../db/gtfs.db');

const TOD_TOKEN = process.env['TOD_TOKEN'];

if (!TOD_TOKEN) {
  throw new Error('TOD_TOKEN must be defined in the .env file');
}

const TFNSW_LIVE_DATA_URL = 'https://api.transport.nsw.gov.au/v2/gtfs/realtime/'
const TFNSW_TRAINPOS_URL = 'https://api.transport.nsw.gov.au/v2/gtfs/vehiclepos/'
const TFNSW_SCHEDULE_URL = 'https://api.transport.nsw.gov.au/v1/gtfs/schedule/'
const TFNSW_TRIPPLANNER_URL = 'https://api.transport.nsw.gov.au/v1/tp/';
const TFNSW_TRAIN_PATH = 'sydneytrains';
const TFNSW_STOP_FINDER = 'stop_finder';

// This will be used by a HEAD request to check if the data has been updated since the last fetch
// when it has been updated, the new data will be fetched and processed, otherwise the cached data will be used
// const TFNSW_TIMETABLES_URL = 'https://api.transport.nsw.gov.au/v1/publictransport/timetables/complete';
// const TFNSW_TRAIN_TIMETABLE_PATH = 'gtfs';

async function fetchTrainData(db: Database) {
  // const response = await fetch(`${TFNSW_SCHEDULE_URL}${TFNSW_TRAIN_PATH}`, {
  //   headers: {
  //     'Authorization': `apikey ${TOD_TOKEN}`,
  //   },
  // });
  const params = new URLSearchParams();
  params.append('outputFormat', 'rapidJSON');
  params.append('type_sf', 'any');
  params.append('name_sf', 'North');
  params.append('coordOutputFormat', 'EPSG:4326');
  params.append('anyMaxSizeHitList', '10');
  const urlWithParams = `${TFNSW_TRIPPLANNER_URL}${TFNSW_STOP_FINDER}?${params.toString()}`;
  const response = await fetch(urlWithParams, {
    headers: {
      'Authorization': `apikey ${TOD_TOKEN}`,
    },
  });


  if (!response.ok) {
    const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
    throw error;
  }

  const data = await response.json();
  const locations = data?.locations || [];
  const stops = locations.filter((loc: any) => loc.type === 'stop' && loc.modes?.includes(1));
  console.log('Stop Finder Response:', JSON.stringify(stops, null, 2));



  // const buffer = await response.arrayBuffer();
  // const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
  //
  // const test_data = feed.entity[1];
  // feed.entity.forEach((entity, index) => console.log(`--- Entity ${index + 1} ---`, Object.keys(entity)));
  // const update = test_data?.tripUpdate;
  // // console.log("update:", update);
  // const stopTimeUpdate = update?.stopTimeUpdate;
  //
  // if (!stopTimeUpdate) {
  //   console.log('No stopTimeUpdate found in the first entity.');
  //   return;
  // }
  // stopTimeUpdate.forEach((u, index) => {
  //   console.log(`--- StopTimeUpdate ${index + 1} ---`);
  //   console.log(`Stop ID: ${u.stopId}`);
  //   console.log(`Arrival keys: ${Object.keys(u.arrival || {})}`);
  //   console.log(`Departure keys: ${Object.keys(u.departure || {})}`);
  //   // console.log(`Arrival Time: ${u.arrival}`);
  //   // console.log(`Departure Time: ${u.departure}`);
  // });

  // const stop_ids = stopTimeUpdate
  //   .map((u) => u.stopId)
  //   .filter((id): id is string => !!id);
  //
  // if (stop_ids.length === 0) {
  //   console.log('No stop IDs found.');
  //   return;
  // }
  //
  // const stopIdToName = await getStopNamesByIds(db, stop_ids);
  //
  // console.log('--- Stop ID to Name Mapping ---');
  // stop_ids.forEach(id => {
  //   console.log(`${id}: ${stopIdToName[id] || 'Unknown Stop'}`);
  // });
}

async function main() {
  let db;
  try {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    await fetchTrainData(db);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (db) {
      await db.close();
    }
  }
}

main();
