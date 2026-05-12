import {
  LayoutDashboard,
  Users,
  School,
  ClipboardCheck,
  NotebookPen,
  Image as ImageIcon,
  Megaphone,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/teacher/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/teacher/students", labelKey: "nav.students", icon: Users },
  { href: "/teacher/classes", labelKey: "nav.classes", icon: School },
  { href: "/teacher/attendance", labelKey: "nav.attendance", icon: ClipboardCheck },
  { href: "/teacher/daily-notes", labelKey: "nav.dailyNotes", icon: NotebookPen },
  { href: "/teacher/photos", labelKey: "nav.photos", icon: ImageIcon },
  { href: "/teacher/notices", labelKey: "nav.notices", icon: Megaphone },
  { href: "/teacher/messages", labelKey: "nav.messages", icon: MessagesSquare },
];

// 5 most important items for mobile bottom nav
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[3], // Attendance
  NAV_ITEMS[4], // Daily Notes
  NAV_ITEMS[7], // Messages
];
