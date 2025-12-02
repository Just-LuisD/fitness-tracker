import { SQLiteDatabase } from "expo-sqlite";
import { TrainingProgram, WorkoutTemplate } from "../database/types";

export async function getTrainingPrograms(db: SQLiteDatabase) {
  return db.getAllAsync("SELECT * FROM training_programs");
}

export async function getActiveTrainingProgram(db: SQLiteDatabase) {
  return db.runAsync(
    "SELECT * FROM training_programs WHERE is_active = 1 LIMIT 1"
  );
}

export async function addTrainingProgram(
  db: SQLiteDatabase,
  { name, start_date, is_active }: TrainingProgram
) {
  await db.runAsync(
    "INSERT INTO training_programs (name, start_date, is_active) (?,?,?)",
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

export async function deactivateAllPrograms(db: SQLiteDatabase, id: number) {
  await db.runAsync(
    "UPDATE training_programs SET is_active = 0 WHERE id != ?",
    id
  );
}

export async function getTrainingProgramWorkouts(
  db: SQLiteDatabase,
  program_id: number
) {
  return await db.getAllAsync(
    "SELECT * FROM workout_templates WHERE program_id = ?",
    program_id
  );
}

export async function addWorkout(
  db: SQLiteDatabase,
  { program_id, workout_number, name }: WorkoutTemplate
) {
  await db.runAsync(
    "INSERT INTO workout_templates (program_id, workout_number, name) (?,?,?)",
    program_id,
    workout_number,
    name
  );
}

export async function updateWorkout(
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

export async function deleteWorkout(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM workout_templates WHERE id = ?", id);
}
