import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { LoggedExercise, LoggedWorkout } from "../database/types";

/**
 * useLoggedWorkouts(workoutTemplateId | null) - manage logged workouts for a template
 */
export function useLoggedWorkouts(workoutTemplateId: number | null) {
  const db = useSQLiteContext();
  const [workouts, setWorkouts] = useState<LoggedWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!db || workoutTemplateId == null) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await db.getAllAsync<LoggedWorkout>(
        "SELECT * FROM logged_workouts WHERE workout_template_id = ? ORDER BY date DESC",
        workoutTemplateId
      );
      setWorkouts(rows ?? []);
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
    async (payload: Omit<LoggedWorkout, "id">) => {
      if (!db) throw new Error("DB not initialized");
      const res = await db.runAsync(
        "INSERT INTO logged_workouts (date, notes, workout_template_id) VALUES (?,?,?)",
        payload.date,
        payload.notes ?? null,
        payload.workout_template_id ?? null
      );
      await load();
      return res.lastInsertRowId ?? null;
    },
    [db, load]
  );

  const update = useCallback(
    async (payload: LoggedWorkout) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync(
        "UPDATE logged_workouts SET date = ?, notes = ?, workout_template_id = ? WHERE id = ?",
        payload.date,
        payload.notes ?? null,
        payload.workout_template_id ?? null,
        payload.id
      );
      await load();
    },
    [db, load]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) throw new Error("DB not initialized");
      await db.runAsync("DELETE FROM logged_workouts WHERE id = ?", id);
      await load();
    },
    [db, load]
  );

  /**
   * Insert a workout and its exercises in a transaction if available.
   * exercises: LoggedExercise without id (logged_workout_id will be set)
   */
  const addWithExercises = useCallback(
    async (
      payload: Omit<LoggedWorkout, "id">,
      exercises: Omit<LoggedExercise, "id" | "logged_workout_id">[]
    ) => {
      if (!db) throw new Error("DB not initialized");

      // if withTransactionAsync exists, use it; otherwise fallback to sequential
      if ((db as any).withTransactionAsync) {
        let insertedId: number | null = null;
        await (db as any).withTransactionAsync(async () => {
          const res = await db.runAsync(
            "INSERT INTO logged_workouts (date, notes, workout_template_id) VALUES (?,?,?)",
            payload.date,
            payload.notes ?? null,
            payload.workout_template_id ?? null
          );
          insertedId = res.lastInsertRowId;
          for (const ex of exercises) {
            await db.runAsync(
              "INSERT INTO logged_exercises (logged_workout_id, name, sets, reps, weight, order_index) VALUES (?,?,?,?,?,?)",
              insertedId,
              ex.name,
              ex.sets,
              ex.reps,
              ex.weight,
              ex.order_index
            );
          }
        });
        await load();
        return insertedId;
      } else {
        // fallback
        const res = await db.runAsync(
          "INSERT INTO logged_workouts (date, notes, workout_template_id) VALUES (?,?,?)",
          payload.date,
          payload.notes ?? null,
          payload.workout_template_id ?? null
        );
        const insertedId = res.lastInsertRowId;
        for (const ex of exercises) {
          await db.runAsync(
            "INSERT INTO logged_exercises (logged_workout_id, name, sets, reps, weight, order_index) VALUES (?,?,?,?,?,?)",
            insertedId,
            ex.name,
            ex.sets,
            ex.reps,
            ex.weight,
            ex.order_index
          );
        }
        await load();
        return insertedId;
      }
    },
    [db, load]
  );

  return {
    workouts,
    loading,
    error,
    load,
    add,
    update,
    remove,
    addWithExercises,
  };
}
