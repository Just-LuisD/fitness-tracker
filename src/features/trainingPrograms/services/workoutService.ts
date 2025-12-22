import { SQLiteDatabase } from "expo-sqlite";
import {
  ExerciseTemplate,
  LoggedExercise,
  LoggedWorkout,
  TrainingProgram,
  WorkoutTemplate,
} from "../../../database/types";

export async function getTrainingPrograms(db: SQLiteDatabase) {
  return db.getAllAsync("SELECT * FROM training_programs");
}

export async function getTrainingProgram(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync(
    "SELECT * FROM training_programs WHERE id = ? LIMIT 1",
    id
  );
}

export async function getActiveTrainingProgram(db: SQLiteDatabase) {
  return db.getFirstAsync(
    "SELECT * FROM training_programs WHERE is_active = 1 LIMIT 1"
  );
}

export async function addTrainingProgram(
  db: SQLiteDatabase,
  name: string,
  start_date: string,
  is_active: 0 | 1
) {
  await db.runAsync(
    "INSERT INTO training_programs (name, start_date, is_active) VALUES (?,?,?)",
    name,
    start_date,
    is_active
  );
}

export async function updateTrainingProgram(
  db: SQLiteDatabase,
  { id, name, start_date, is_active }: TrainingProgram
) {
  await db.runAsync(
    "UPDATE training_programs SET name = ?, start_date = ?, is_active = ? WHERE id = ?",
    name,
    start_date,
    is_active,
    id
  );
}

export async function deleteTrainingProgram(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM training_programs WHERE id = ?", id);
}

export async function deactivateAllOtherPrograms(
  db: SQLiteDatabase,
  id: number
) {
  await db.runAsync(
    "UPDATE training_programs SET is_active = 0 WHERE id != ?",
    id
  );
}

export async function getWorkoutTemplates(
  db: SQLiteDatabase,
  program_id: number
) {
  return await db.getAllAsync(
    "SELECT * FROM workout_templates WHERE program_id = ? ORDER BY workout_number ASC",
    program_id
  );
}

export async function addWorkoutTemplate(
  db: SQLiteDatabase,
  program_id: number,
  workout_number: number,
  name: string
) {
  await db.runAsync(
    "INSERT INTO workout_templates (program_id, workout_number, name) VALUES (?,?,?)",
    program_id,
    workout_number,
    name
  );
}

export async function updateWorkoutTemplate(
  db: SQLiteDatabase,
  { id, program_id, workout_number, name }: WorkoutTemplate
) {
  await db.runAsync(
    "UPDATE workout_templates SET program_id = ?, workout_number = ?, name = ? WHERE id = ?",
    program_id,
    workout_number,
    name,
    id
  );
}

export async function deleteWorkoutTemplate(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM workout_templates WHERE id = ?", id);
}

export async function getExerciseTemplates(
  db: SQLiteDatabase,
  workout_template_id: number
) {
  return await db.getAllAsync(
    "SELECT * FROM exercise_templates WHERE workout_template_id = ? ORDER BY order_index ASC",
    workout_template_id
  );
}

export async function addExerciseTemplate(
  db: SQLiteDatabase,
  workout_template_id: number,
  name: string,
  default_sets: number,
  default_reps: number,
  order_index: number
) {
  await db.runAsync(
    "INSERT INTO exercise_templates (workout_template_id, name, default_sets, default_reps, order_index) VALUES (?,?,?,?,?)",
    workout_template_id,
    name,
    default_sets,
    default_reps,
    order_index
  );
}

export async function updateExerciseTemplate(
  db: SQLiteDatabase,
  {
    id,
    workout_template_id,
    name,
    default_sets,
    default_reps,
    order_index,
  }: ExerciseTemplate
) {
  await db.runAsync(
    "UPDATE exercise_templates SET workout_template_id = ?, name = ?, default_sets = ?, default_reps = ?, order_index = ? WHERE id = ?",
    workout_template_id,
    name,
    default_sets,
    default_reps,
    order_index,
    id
  );
}

export async function deleteExerciseTemplate(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM exercise_templates WHERE id = ?", id);
}

export async function getLoggedWorkouts(
  db: SQLiteDatabase,
  workout_template_id: number
) {
  return await db.getAllAsync(
    "SELECT * FROM logged_workouts WHERE workout_template_id = ? ORDER BY date DESC",
    workout_template_id
  );
}

export async function getLoggedWorkout(db: SQLiteDatabase, id: number) {
  return await db.getFirstAsync(
    "SELECT * FROM logged_workouts WHERE id = ? LIMIT 1",
    id
  );
}

export async function addLoggedWorkout(
  db: SQLiteDatabase,
  { date, notes, workout_template_id }: LoggedWorkout
) {
  await db.runAsync(
    "INSERT INTO logged_workouts (date, notes, workout_template_id) VALUES (?,?,?)",
    date,
    notes ?? null,
    workout_template_id
  );
}

export async function updateLoggedWorkout(
  db: SQLiteDatabase,
  { id, date, notes, workout_template_id }: LoggedWorkout
) {
  await db.runAsync(
    "UPDATE logged_workouts SET date = ?, notes = ?, workout_template_id = ? WHERE id = ?",
    date,
    notes ?? null,
    workout_template_id,
    id
  );
}

export async function deleteLoggedWorkout(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM logged_workouts WHERE id = ?", id);
}

export async function getLoggedExercises(
  db: SQLiteDatabase,
  logged_workout_id: number
) {
  return await db.getAllAsync(
    "SELECT * FROM logged_exercises WHERE logged_workout_id = ?",
    logged_workout_id
  );
}

export async function addLoggedExercise(
  db: SQLiteDatabase,
  { logged_workout_id, name, sets, reps, weight, order_index }: LoggedExercise
) {
  await db.runAsync(
    "INSERT INTO logged_exercises (logged_workout_id, name, sets, reps, weight, order_index) VALUES (?,?,?,?,?,?)",
    logged_workout_id,
    name,
    sets,
    reps,
    weight,
    order_index
  );
}

export async function updateLoggedExercise(
  db: SQLiteDatabase,
  {
    id,
    logged_workout_id,
    name,
    sets,
    reps,
    weight,
    order_index,
  }: LoggedExercise
) {
  await db.runAsync(
    "UPDATE logged_exercises SET logged_workout_id = ?, name = ?, sets = ?, reps = ?, weight = ?, order_index = ? WHERE id = ?",
    logged_workout_id,
    name,
    sets,
    reps,
    weight,
    order_index,
    id
  );
}

export async function deleteLoggedExercise(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM logged_exercises WHERE id = ?", id);
}
