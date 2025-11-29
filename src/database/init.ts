import { SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(db: SQLiteDatabase) {
  // weight tracking table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weight REAL NOT NULL,
      unit TEXT NOT NULL CHECK (unit IN ('kg', 'lb')),
      date TEXT NOT NULL
    );
   `);

  // workout programs templates
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS training_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      is_active INTEGER DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL,
      workout_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercise_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_template_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      default_sets INTEGER NOT NULL,
      default_reps INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE
    );
  `);

  // actual workouts performed
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS logged_workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      notes TEXT,
      workout_template_id INTEGER,
      FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE SET NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS logged_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      logged_workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (logged_workout_id) REFERENCES logged_workouts(id) ON DELETE CASCADE
    );
  `);
}
