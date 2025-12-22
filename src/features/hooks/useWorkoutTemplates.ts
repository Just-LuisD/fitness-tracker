import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { WorkoutTemplate } from "../database/types";

/**
 * useWorkoutTemplates(programId) - fetch & mutate workout templates for a program
 */
export function useWorkoutTemplates(programId: number | null) {
  const db = useSQLiteContext();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!db || programId == null) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<WorkoutTemplate>(
        "SELECT * FROM workout_templates WHERE program_id = ? ORDER BY workout_number ASC",
        programId
      );
      setTemplates(rows ?? []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db, programId]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (t: Omit<WorkoutTemplate, "id">) => {
      if (!db) throw new Error("DB not initialized");
      const res = await db.runAsync(
        "INSERT INTO workout_templates (program_id, workout_number, name) VALUES (?,?,?)",
        t.program_id,
        t.workout_number,
        t.name
      );
      await load();
      return res.lastInsertRowId ?? null;
    },
    [db, load]
  );

  const update = useCallback(
    async (t: WorkoutTemplate) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE workout_templates SET program_id = ?, workout_number = ?, name = ? WHERE id = ?",
        t.program_id,
        t.workout_number,
        t.name,
        t.id
      );
      await load();
    },
    [db, load]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM workout_templates WHERE id = ?", id);
      await load();
    },
    [db, load]
  );

  return {
    templates,
    loading,
    error,
    load,
    add,
    update,
    remove,
  };
}
