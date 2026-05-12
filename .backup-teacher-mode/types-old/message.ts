export type SenderRole = "teacher" | "parent";

export interface Conversation {
  id: string;
  branch_id: string;
  student_id: string;
  student_name: string;
  parent_id: string;
  parent_name: string;
  teacher_id: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: SenderRole;
  message: string;
  read_at?: string;
  created_at: string;
}
