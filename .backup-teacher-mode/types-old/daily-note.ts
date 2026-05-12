export type NoteVisibility = "draft" | "published" | "hidden";
export type Mood = "happy" | "neutral" | "sad" | "tired" | "excited";
export type MealStatus = "all" | "most" | "some" | "none";
export type NapStatus = "well" | "short" | "none";

export interface DailyNote {
  id: string;
  student_id: string;
  branch_id: string;
  class_id: string;
  date: string;
  mood: Mood;
  meal: MealStatus;
  nap: NapStatus;
  health: string;
  activity_summary: string;
  teacher_comment: string;
  visibility_status: NoteVisibility;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
