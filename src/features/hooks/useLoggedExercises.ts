import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { LoggedExercise } from "../database/types";

/**
 * useLoggedExercises(loggedWorkoutId) - manage exercises for a logged workout
 */
export function useLoggedExercises(loggedWorkoutId: number | null) {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!db || loggedWorkoutId == null) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<LoggedExercise>(
        "SELECT * FROM logged_exercises WHERE logged_workout_id = ? ORDER BY order_index ASC",
        loggedWorkoutId
      );
      setExercises(rows ?? []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db, loggedWorkoutId]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (payload: Omit<LoggedExercise, "id">) => {
      if (!db) throw new Error("DB not initialized");
      const res = await db.runAsync(
        "INSERT INTO logged_exercises (logged_workout_id, name, sets, reps, weight, order_index) VALUES (?,?,?,?,?,?)",
        payload.logged_workout_id,
        payload.name,
        payload.sets,
        payload.reps,
        payload.weight,
        payload.order_index
      );
      await load();
      return res.lastInsertRowId ?? null;
    },
    [db, load]
  );

  const update = useCallback(
    async (payload: LoggedExercise) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE logged_exercises SET logged_workout_id = ?, name = ?, sets = ?, reps = ?, weight = ?, order_index = ? WHERE id = ?",
        payload.logged_workout_id,
        payload.name,
        payload.sets,
        payload.reps,
        payload.weight,
        payload.order_index,
        payload.id
      );
      await load();
    },
    [db, load]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM logged_exercises WHERE id = ?", id);
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
