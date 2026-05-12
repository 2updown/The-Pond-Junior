// Shared types for The Pond

export type ConsultationStatus = "scheduled" | "done" | "canceled";
export type ConsultationMode = "online" | "offline";

export interface Consultation {
  id: string;
  studentId: string;
  studentName: string;
  studentInitial: string;
  studentColor: AvatarColor;
  subject: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  mode: ConsultationMode;
  status: ConsultationStatus;
  note?: string;
}

export type AvatarColor = "blue" | "cyan" | "purple" | "green" | "gradient";

export interface Student {
  id: string;
  name: string;
  initial: string;
  color: AvatarColor;
  grade: string;
  subject: string;
  phone: string;
  status: "active" | "paused" | "withdrawn";
  nextConsultation?: string;
  openTodos: number;
}

export interface Teacher {
  id: string;
  name: string;
  initial: string;
  color: AvatarColor;
  subject: string;
  phone: string;
  role: "director" | "instructor";
  status: "active" | "resigned";
}

export interface ClassRoom {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  capacity: number;
  current: number;
  waitlist?: number;
}

export interface Todo {
  id: string;
  title: string;
  classOrStudent: string;
  daysLeft: number;
  submitted: number;
  total: number;
  status: "active" | "done";
  description?: string;
  submissions?: Submission[];
}

export interface Submission {
  studentId: string;
  studentName: string;
  initial: string;
  color: AvatarColor;
  submittedAt?: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  initial: string;
  color: AvatarColor;
  time?: string;
  status: "present" | "late" | "absent";
  alimtalkSent?: boolean;
}

export interface ReportLog {
  id: string;
  title: string;
  count: number;
  sentAt: string;
  status: "sent" | "partial";
}

export interface PointLog {
  id: string;
  studentName: string;
  initial: string;
  color: AvatarColor;
  reason: string;
  date: string;
  amount: number;
}

export interface ArchiveItem {
  id: string;
  title: string;
  meta: string;
  status: "done" | "progress" | "pending";
}

export interface ScheduleEvent {
  id: string;
  date: string;
  label: string;
  category: "학사" | "행사" | "휴원";
}

export interface NoticePost {
  id: string;
  title: string;
  date: string;
  views: number;
  pinned?: boolean;
}

export interface AlimtalkSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AlimtalkLog {
  id: string;
  title: string;
  meta: string;
  status: "success" | "failed";
}

export interface ChargeLog {
  id: string;
  title: string;
  meta: string;
  status: "done";
}

export interface RevenueMonth {
  label: string;
  height: number; // 0-100
}

export interface PaymentRow {
  id: string;
  studentName: string;
  initial: string;
  color: AvatarColor;
  meta: string;
  status: "completed" | "unpaid";
}

export interface SupportTicket {
  id: string;
  title: string;
  date: string;
  status: "answered" | "pending";
  answeredAt?: string;
}

export interface SupportFaq {
  id: string;
  title: string;
}

export interface BoardPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  pinned?: boolean;
}
