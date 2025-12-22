import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { TrainingProgram } from "../database/types";

/**
 * useTrainingPrograms - list programs and manage active program
 */
export function useTrainingPrograms() {
  const db = useSQLiteContext();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [active, setActive] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAll = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<TrainingProgram>(
        "SELECT * FROM training_programs ORDER BY start_date DESC"
      );
      setPrograms(rows ?? []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const loadActive = useCallback(async () => {
    if (!db) return;
    try {
      const row = await db.getFirstAsync<TrainingProgram>(
        "SELECT * FROM training_programs WHERE is_active = 1 LIMIT 1"
      );
      setActive(row ?? null);
    } catch (e) {
      // ignore here, will surface in loadAll
    }
  }, [db]);

  useEffect(() => {
    if (!db) return;
    loadAll();
    loadActive();
  }, [db, loadAll, loadActive]);

  const addProgram = useCallback(
    async (p: Omit<TrainingProgram, "id">) => {
      if (!db) throw new Error("DB not initialized");
      const res = await db.runAsync(
        "INSERT INTO training_programs (name, start_date, is_active) VALUES (?,?,?)",
        p.name,
        p.start_date,
        p.is_active ?? 0
      );
      await loadAll();
      await loadActive();
      return res.lastInsertRowId ?? null;
    },
    [db, loadAll, loadActive]
  );

  const updateProgram = useCallback(
    async (p: TrainingProgram) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE training_programs SET name = ?, start_date = ?, is_active = ? WHERE id = ?",
        p.name,
        p.start_date,
        p.is_active ? 1 : 0,
        p.id
      );
      await loadAll();
      await loadActive();
    },
    [db, loadAll, loadActive]
  );

  const deleteProgram = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM training_programs WHERE id = ?", id);
      await loadAll();
      await loadActive();
    },
    [db, loadAll, loadActive]
  );

  const setActiveProgram = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      // deactivate others then activate this
      await db.runAsync(
        "UPDATE training_programs SET is_active = 0 WHERE id != ?",
        id
      );
      await db.runAsync(
        "UPDATE training_programs SET is_active = 1 WHERE id = ?",
        id
      );
      await loadAll();
      await loadActive();
    },
    [db, loadAll, loadActive]
  );

  return {
    programs,
    active,
    loading,
    error,
    loadAll,
    loadActive,
    addProgram,
    updateProgram,
    deleteProgram,
    setActiveProgram,
  };
}
