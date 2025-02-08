import { openDB } from "idb";

// Database Config
const DB_NAME = "fantasyRunningDB";
const STORE_NAME = "runs";

// Initialize IndexedDB
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  },
});

// Define Run Type
export interface RunData {
  id?: number;
  date: string;
  distance: number;
  duration: string;
}

// Save a Run
export async function saveRun(runData: RunData): Promise<void> {
  const db = await dbPromise;
  await db.add(STORE_NAME, runData);
}

// Get All Runs
export async function getRuns(): Promise<RunData[]> {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

// Clear Runs (Debugging)
export async function clearRuns(): Promise<void> {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
}
