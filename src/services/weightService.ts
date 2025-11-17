import { SQLiteDatabase } from "expo-sqlite";

export async function getWeightEntries(db: SQLiteDatabase) {
  return db.getAllAsync("SELECT * FROM weight_entries ORDER BY date DESC");
}

export async function addWeightEntry(
  db: SQLiteDatabase,
  value: number,
  unit: "lb" | "kg"
) {
  const date = new Date().toISOString();
  await db.runAsync(
    "INSERT INTO weight_entries (weight, unit, date) VALUES (?, ?, ?)",
    value,
    unit,
    date
  );
}

export async function updateWeightEntry(
  db: SQLiteDatabase,
  id: number,
  value: number,
  unit: "lb" | "kg"
) {
  await db.runAsync(
    "UPDATE weight_entries SET weight = ?, unit = ? WHERE id = ?",
    value,
    unit,
    id
  );
}

export async function deleteWeightEntry(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM weight_entries WHERE id = ?", id);
}
