import type { DailyNote } from "@/types";

const today = new Date().toISOString().slice(0, 10);

export const mockDailyNotes: DailyNote[] = [
  {
    id: "note-001",
    student_id: "student-001",
    branch_id: "branch-001",
    class_id: "class-001",
    date: today,
    mood: "happy",
    meal: "all",
    nap: "well",
    health: "Healthy and full of energy.",
    activity_summary:
      "Worked on shape sorting and joined the music circle with enthusiasm.",
    teacher_comment:
      "Ava had a wonderful day. She helped a friend build a tall block tower.",
    visibility_status: "published",
    published_at: `${today}T15:45:00Z`,
    created_by: "teacher-001",
    created_at: `${today}T15:30:00Z`,
    updated_at: `${today}T15:45:00Z`,
  },
  {
    id: "note-002",
    student_id: "student-002",
    branch_id: "branch-001",
    class_id: "class-001",
    date: today,
    mood: "excited",
    meal: "most",
    nap: "short",
    health: "Slight runny nose this morning, otherwise fine.",
    activity_summary: "Loved finger-painting and asked for a second sheet.",
    teacher_comment:
      "Noah was very curious about the spring planting station today.",
    visibility_status: "draft",
    created_by: "teacher-001",
    created_at: `${today}T15:00:00Z`,
    updated_at: `${today}T15:00:00Z`,
  },
  {
    id: "note-003",
    student_id: "student-003",
    branch_id: "branch-001",
    class_id: "class-001",
    date: today,
    mood: "neutral",
    meal: "some",
    nap: "well",
    health: "Healthy.",
    activity_summary: "Quiet morning, opened up during outdoor play.",
    teacher_comment: "Mia warmed up after circle time and joined in songs.",
    visibility_status: "published",
    published_at: `${today}T15:50:00Z`,
    created_by: "teacher-001",
    created_at: `${today}T15:35:00Z`,
    updated_at: `${today}T15:50:00Z`,
  },
];
