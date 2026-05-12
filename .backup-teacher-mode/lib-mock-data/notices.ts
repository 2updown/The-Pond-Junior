import type { Notice } from "@/types";

export const mockNotices: Notice[] = [
  {
    id: "notice-001",
    branch_id: "branch-001",
    class_id: "class-001",
    target_type: "class",
    title: "Spring Field Trip Permission Slip",
    content:
      "Dear families, we will be taking the Sunflower class to Lakeside Park on May 18. Please return the permission slip by May 12. Comfortable shoes recommended!",
    status: "published",
    published_at: "2026-05-04T09:00:00Z",
    created_by: "teacher-001",
    created_at: "2026-05-03T20:00:00Z",
    updated_at: "2026-05-04T09:00:00Z",
  },
  {
    id: "notice-002",
    branch_id: "branch-001",
    target_type: "all_branch",
    title: "Branch Closure — Memorial Day",
    content:
      "A reminder that Sunshine Branch will be closed on Monday, May 25 for the Memorial Day holiday. Regular hours resume Tuesday.",
    status: "published",
    published_at: "2026-05-01T12:00:00Z",
    created_by: "teacher-001",
    created_at: "2026-05-01T11:30:00Z",
    updated_at: "2026-05-01T12:00:00Z",
  },
  {
    id: "notice-003",
    branch_id: "branch-001",
    class_id: "class-001",
    target_type: "selected_students",
    target_student_ids: ["student-001", "student-005"],
    title: "Personalized Reading Assessment",
    content:
      "We'd like to schedule a quick reading check-in for selected students next week. We'll send a follow-up with available time slots.",
    status: "draft",
    created_by: "teacher-001",
    created_at: "2026-05-05T18:30:00Z",
    updated_at: "2026-05-05T18:30:00Z",
  },
  {
    id: "notice-004",
    branch_id: "branch-001",
    class_id: "class-001",
    target_type: "class",
    title: "Picture Day — Save the Date",
    content:
      "Picture Day is scheduled for June 3. We'll send outfit suggestions and the photographer's schedule shortly.",
    status: "scheduled",
    scheduled_at: "2026-05-15T09:00:00Z",
    created_by: "teacher-001",
    created_at: "2026-05-04T14:00:00Z",
    updated_at: "2026-05-04T14:00:00Z",
  },
];
