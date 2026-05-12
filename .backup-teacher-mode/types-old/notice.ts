export type NoticeStatus = "draft" | "published" | "scheduled" | "archived";
export type NoticeTarget = "all_branch" | "class" | "selected_students";

export interface Notice {
  id: string;
  branch_id: string;
  class_id?: string;
  target_type: NoticeTarget;
  target_student_ids?: string[];
  title: string;
  content: string;
  status: NoticeStatus;
  published_at?: string;
  scheduled_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
