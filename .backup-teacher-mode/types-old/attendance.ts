export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_leave"
  | "sick";

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  branch_id: string;
  date: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  memo?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
