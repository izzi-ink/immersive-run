import { openDB } from "idb";

// Define run data structure
export interface RunData {
  id?: number;
  date: string;
  // Store route as array of {lat, lng} objects instead of number tuples
  route: Array<{lat: number, lng: number}>;
  distance: number;
  duration: string;
}

const DB_NAME = "fantasyRunningDB";
const STORE_NAME = "runs";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  },
});

export async function saveRun(runData: RunData): Promise<void> {
  const db = await dbPromise;
  await db.add(STORE_NAME, runData);
}

export async function getRuns(): Promise<RunData[]> {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

export async function clearRuns(): Promise<void> {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
}