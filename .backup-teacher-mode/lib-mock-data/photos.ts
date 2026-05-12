import type { Photo } from "@/types";

const today = new Date().toISOString().slice(0, 10);

export const mockPhotos: Photo[] = [
  {
    id: "photo-001",
    branch_id: "branch-001",
    class_id: "class-001",
    student_ids: ["student-001", "student-002"],
    uploaded_by: "teacher-001",
    date: today,
    image_url:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=70",
    caption: "Block tower teamwork during free play.",
    visibility_status: "shared",
    created_at: `${today}T11:00:00Z`,
    updated_at: `${today}T11:00:00Z`,
  },
  {
    id: "photo-002",
    branch_id: "branch-001",
    class_id: "class-001",
    student_ids: [],
    uploaded_by: "teacher-001",
    date: today,
    image_url:
      "https://images.unsplash.com/photo-1587653263995-422546a7a569?auto=format&fit=crop&w=800&q=70",
    caption: "Outdoor circle time in the spring sunshine.",
    visibility_status: "shared",
    created_at: `${today}T10:30:00Z`,
    updated_at: `${today}T10:30:00Z`,
  },
  {
    id: "photo-003",
    branch_id: "branch-001",
    class_id: "class-001",
    student_ids: ["student-003"],
    uploaded_by: "teacher-001",
    date: today,
    image_url:
      "https://images.unsplash.com/photo-1597413545419-4013431dbfec?auto=format&fit=crop&w=800&q=70",
    caption: "Mia's finger painting masterpiece.",
    visibility_status: "private",
    created_at: `${today}T09:45:00Z`,
    updated_at: `${today}T09:45:00Z`,
  },
  {
    id: "photo-004",
    branch_id: "branch-001",
    class_id: "class-001",
    student_ids: [],
    uploaded_by: "teacher-001",
    date: today,
    image_url:
      "https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&w=800&q=70",
    caption: "Snack time stories.",
    visibility_status: "shared",
    created_at: `${today}T09:15:00Z`,
    updated_at: `${today}T09:15:00Z`,
  },
];
