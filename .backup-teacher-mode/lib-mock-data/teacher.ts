import type { Teacher } from "@/types";

export const currentTeacher: Teacher = {
  id: "teacher-001",
  branch_id: "branch-001",
  branch_name: "Sunshine Branch",
  name: "Ms. Olivia Chen",
  email: "olivia.chen@hcis.edu",
  role: "teacher",
  hasAdminPermission: true,
  profile_image: "https://i.pravatar.cc/120?img=47",
  created_at: "2025-08-01T09:00:00Z",
  updated_at: "2026-04-30T09:00:00Z",
};

export const teachersById: Record<string, Pick<Teacher, "id" | "name">> = {
  "teacher-001": { id: "teacher-001", name: "Ms. Olivia Chen" },
  "teacher-002": { id: "teacher-002", name: "Mr. Daniel Park" },
  "teacher-003": { id: "teacher-003", name: "Ms. Hana Kim" },
};
