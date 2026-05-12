export type TeacherRole = "teacher";

export interface Teacher {
  id: string;
  branch_id: string;
  branch_name: string;
  name: string;
  email: string;
  role: TeacherRole;
  hasAdminPermission: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}
