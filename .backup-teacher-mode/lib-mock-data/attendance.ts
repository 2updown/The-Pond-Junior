import type { Attendance } from "@/types";
import { mockStudents } from "./students";

const today = new Date().toISOString().slice(0, 10);

const statuses: Attendance["status"][] = [
  "present",
  "present",
  "present",
  "late",
  "absent",
  "present",
  "sick",
  "present",
];

export const mockAttendance: Attendance[] = mockStudents
  .filter((s) => s.class_id === "class-001" && s.status === "active")
  .map((student, idx) => ({
    id: `att-${student.id}-${today}`,
    student_id: student.id,
    class_id: student.class_id,
    branch_id: student.branch_id,
    date: today,
    status: statuses[idx % statuses.length],
    check_in_time:
      statuses[idx % statuses.length] === "absent" ? undefined : "09:0" + (idx % 9),
    check_out_time:
      statuses[idx % statuses.length] === "absent" ? undefined : "15:30",
    memo: idx === 3 ? "Arrived after morning circle" : undefined,
    created_by: "teacher-001",
    created_at: `${today}T09:00:00Z`,
    updated_at: `${today}T09:00:00Z`,
  }));
