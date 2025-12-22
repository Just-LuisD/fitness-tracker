import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { WeightEntry, WeightUnit } from "../database/types";

/**
 * useWeight - load, add, update, delete weight entries.
 */
export function useWeight() {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<WeightEntry>(
        "SELECT * FROM weight_entries ORDER BY date DESC"
      );
      setEntries(rows ?? []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    let mounted = true;
    if (!db) return;
    load();
    return () => {
      mounted = false;
    };
  }, [db, load]);

  const add = useCallback(
    async (value: number, unit: WeightUnit, date?: string) => {
      if (!db) throw new Error("DB not initialized");
      const entryDate = date ?? new Date().toISOString();
      const res = await db.runAsync(
        "INSERT INTO weight_entries (weight, unit, date) VALUES (?, ?, ?)",
        value,
        unit,
        entryDate
      );
      // lastInsertRowId is returned on runAsync
      await load();
      return res?.lastInsertRowId ?? null;
    },
    [db, load]
  );

  const update = useCallback(
    async (id: number, value: number, unit: WeightUnit) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE weight_entries SET weight = ?, unit = ? WHERE id = ?",
        value,
        unit,
        id
      );
      await load();
    },
    [db, load]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM weight_entries WHERE id = ?", id);
      await load();
    },
    [db, load]
  );

  const stats = useCallback(async () => {
    if (!db) throw new Error("DB not initialized");
    const row = await db.getFirstAsync<{
      min: number;
      max: number;
      avg: number;
    }>(
      "SELECT MIN(weight) as min, MAX(weight) as max, AVG(weight) as avg FROM weight_entries"
    );
    return row ?? { min: 0, max: 0, avg: 0 };
  }, [db]);

  return {
    entries,
    loading,
    error,
    load,
    add,
    update,
    remove,
    stats,
  };
}
