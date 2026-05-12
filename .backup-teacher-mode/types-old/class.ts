export type ClassStatus = "active" | "inactive";

export interface ClassRoom {
  id: string;
  branch_id: string;
  name: string;
  teacher_id: string;
  teacher_name?: string;
  age_group: string;
  description?: string;
  status: ClassStatus;
  student_count?: number;
  created_at: string;
  updated_at: string;
}
