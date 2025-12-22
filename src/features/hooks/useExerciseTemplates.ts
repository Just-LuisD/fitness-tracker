import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { ExerciseTemplate } from "../database/types";

/**
 * useExerciseTemplates(workoutTemplateId) - manage template exercises
 */
export function useExerciseTemplates(workoutTemplateId: number | null) {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!db || workoutTemplateId == null) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<ExerciseTemplate>(
        "SELECT * FROM exercise_templates WHERE workout_template_id = ? ORDER BY order_index ASC",
        workoutTemplateId
      );
      setExercises(rows ?? []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db, workoutTemplateId]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (ex: Omit<ExerciseTemplate, "id">) => {
      if (!db) throw new Error("DB not initialized");
      const res = await db.runAsync(
        "INSERT INTO exercise_templates (workout_template_id, name, default_sets, default_reps, order_index) VALUES (?,?,?,?,?)",
        ex.workout_template_id,
        ex.name,
        ex.default_sets,
        ex.default_reps,
        ex.order_index
      );
      await load();
      return res.lastInsertRowId ?? null;
    },
    [db, load]
  );

  const update = useCallback(
    async (ex: ExerciseTemplate) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE exercise_templates SET workout_template_id = ?, name = ?, default_sets = ?, default_reps = ?, order_index = ? WHERE id = ?",
        ex.workout_template_id,
        ex.name,
        ex.default_sets,
        ex.default_reps,
        ex.order_index,
        ex.id
      );
      await load();
    },
    [db, load]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM exercise_templates WHERE id = ?", id);
      await load();
    },
    [db, load]
  );

  return {
    exercises,
    loading,
    error,
    load,
    add,
    update,
    remove,
  };
}
