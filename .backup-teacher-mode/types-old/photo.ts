export type PhotoVisibility = "private" | "shared" | "archived";

export interface Photo {
  id: string;
  branch_id: string;
  class_id: string;
  student_ids: string[];
  uploaded_by: string;
  date: string;
  image_url: string;
  caption?: string;
  visibility_status: PhotoVisibility;
  created_at: string;
  updated_at: string;
}
