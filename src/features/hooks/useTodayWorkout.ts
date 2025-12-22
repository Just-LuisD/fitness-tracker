import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import type { TrainingProgram, WorkoutTemplate } from "../database/types";

/**
 * useTodayWorkout() - determine today's WorkoutTemplate based on the active program and its start_date
 * Returns { workoutTemplate, dayNumber, totalDays }
 */
export function useTodayWorkout() {
  const db = useSQLiteContext();
  const [result, setResult] = useState<{
    workoutTemplate: WorkoutTemplate | null;
    dayNumber: number | null;
    totalDays: number | null;
  }>({ workoutTemplate: null, dayNumber: null, totalDays: null });

  const compute = useCallback(async () => {
    if (!db) return;
    // get active program
    const program = await db.getFirstAsync<TrainingProgram>(
      "SELECT * FROM training_programs WHERE is_active = 1 LIMIT 1"
    );
    if (!program) {
      setResult({ workoutTemplate: null, dayNumber: null, totalDays: null });
      return;
    }

    // count how many template workouts exist for this program
    const templates = await db.getAllAsync<WorkoutTemplate>(
      "SELECT * FROM workout_templates WHERE program_id = ? ORDER BY workout_number ASC",
      program.id
    );
    if (!templates || templates.length === 0) {
      setResult({ workoutTemplate: null, dayNumber: null, totalDays: 0 });
      return;
    }

    const totalDays = templates.length;

    // parse ISO dates and compute day difference in calendar days
    const start = new Date(program.start_date);
    const today = new Date();
    // normalize to local midnight for day-diff
    const utcStart = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const utcToday = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const diffDays = Math.floor((utcToday - utcStart) / (1000 * 60 * 60 * 24));
    const index = ((diffDays % totalDays) + totalDays) % totalDays; // safe mod
    const dayNumber = index + 1;

    // pick the template with workout_number === dayNumber, or fallback to templates[index]
    let selected =
      templates.find((t) => t.workout_number === dayNumber) ?? templates[index];

    setResult({ workoutTemplate: selected ?? null, dayNumber, totalDays });
  }, [db]);

  useEffect(() => {
    compute();
  }, [db, compute]);

  return result;
}
