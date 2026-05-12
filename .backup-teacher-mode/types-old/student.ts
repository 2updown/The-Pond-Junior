export type StudentStatus = "active" | "inactive";
export type Gender = "male" | "female" | "other";

export interface ParentLink {
  parent_id: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  relationship: "mother" | "father" | "guardian" | "other";
}

export interface Student {
  id: string;
  branch_id: string;
  class_id: string;
  name: string;
  birth_date: string;
  gender: Gender;
  profile_image?: string;
  status: StudentStatus;
  parent_id: string;
  parent?: ParentLink;
  created_at: string;
  updated_at: string;
}
