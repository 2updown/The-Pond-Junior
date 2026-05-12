import type {
  Consultation,
  Student,
  Teacher,
  ClassRoom,
  Todo,
  AttendanceRecord,
  ReportLog,
  PointLog,
  ArchiveItem,
  ScheduleEvent,
  NoticePost,
  AlimtalkSetting,
  AlimtalkLog,
  ChargeLog,
  RevenueMonth,
  PaymentRow,
  SupportTicket,
  SupportFaq,
  BoardPost,
} from "@/types";

export const CONSULTATIONS_UPCOMING: Consultation[] = [
  {
    id: "1",
    studentId: "s1",
    studentName: "김민서",
    studentInitial: "김",
    studentColor: "blue",
    subject: "수학",
    date: "2026-05-12",
    startTime: "16:00",
    endTime: "16:30",
    mode: "online",
    status: "scheduled",
    note: "지난 시간 오답노트 점검 후 단원평가 계획",
  },
  {
    id: "2",
    studentId: "s2",
    studentName: "박지호",
    studentInitial: "박",
    studentColor: "cyan",
    subject: "영어",
    date: "2026-05-12",
    startTime: "17:30",
    endTime: "18:00",
    mode: "offline",
    status: "scheduled",
    note: "단어 시험 결과 공유 및 다음 학습 진도",
  },
  {
    id: "3",
    studentId: "s3",
    studentName: "이서윤",
    studentInitial: "이",
    studentColor: "purple",
    subject: "국어",
    date: "2026-05-13",
    startTime: "15:00",
    endTime: "15:30",
    mode: "online",
    status: "scheduled",
    note: "독해 지문 분석 함께 진행",
  },
  {
    id: "4",
    studentId: "s4",
    studentName: "정유나",
    studentInitial: "정",
    studentColor: "green",
    subject: "수학",
    date: "2026-05-15",
    startTime: "19:00",
    endTime: "19:30",
    mode: "online",
    status: "scheduled",
    note: "모의고사 결과 리뷰 및 약점 보완",
  },
];

export const CONSULTATIONS_PAST: Consultation[] = [
  {
    id: "10",
    studentId: "s1",
    studentName: "김민서",
    studentInitial: "김",
    studentColor: "blue",
    subject: "수학",
    date: "2026-05-09",
    startTime: "16:00",
    endTime: "16:30",
    mode: "online",
    status: "done",
  },
  {
    id: "11",
    studentId: "s2",
    studentName: "박지호",
    studentInitial: "박",
    studentColor: "cyan",
    subject: "영어",
    date: "2026-05-09",
    startTime: "17:30",
    endTime: "18:00",
    mode: "offline",
    status: "canceled",
    note: "학생 사정으로 취소",
  },
  {
    id: "12",
    studentId: "s3",
    studentName: "이서윤",
    studentInitial: "이",
    studentColor: "purple",
    subject: "국어",
    date: "2026-05-07",
    startTime: "15:00",
    endTime: "15:30",
    mode: "online",
    status: "done",
  },
];

export const STUDENTS: Student[] = [
  { id: "s1", name: "김민서", initial: "김", color: "blue", grade: "고2", subject: "수학", phone: "010-1234-5678", status: "active", nextConsultation: "5/12 (화)", openTodos: 3 },
  { id: "s2", name: "박지호", initial: "박", color: "cyan", grade: "고1", subject: "영어", phone: "010-2345-6789", status: "active", nextConsultation: "5/12 (화)", openTodos: 1 },
  { id: "s3", name: "이서윤", initial: "이", color: "purple", grade: "중3", subject: "국어", phone: "010-3456-7890", status: "active", openTodos: 0 },
  { id: "s4", name: "정유나", initial: "정", color: "green", grade: "고3", subject: "수학", phone: "010-4567-8901", status: "active", nextConsultation: "5/15 (금)", openTodos: 2 },
  { id: "s5", name: "최도현", initial: "최", color: "blue", grade: "중2", subject: "수학", phone: "010-5678-9012", status: "active", openTodos: 0 },
];

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Letitu (본인)", initial: "L", color: "gradient", subject: "원장", phone: "010-1111-2222", role: "director", status: "active" },
  { id: "t2", name: "박선영", initial: "박", color: "cyan", subject: "수학", phone: "010-3333-4444", role: "instructor", status: "active" },
  { id: "t3", name: "김지훈", initial: "김", color: "purple", subject: "영어", phone: "010-5555-6666", role: "instructor", status: "active" },
  { id: "t4", name: "이수민", initial: "이", color: "green", subject: "국어", phone: "010-7777-8888", role: "instructor", status: "active" },
  { id: "t5", name: "정민지", initial: "정", color: "blue", subject: "사회", phone: "010-9999-0000", role: "instructor", status: "active" },
];

export const ATTENDANCE_TODAY: AttendanceRecord[] = [
  { studentId: "s1", studentName: "김민서", initial: "김", color: "blue", time: "15:58 자동 출결", status: "present" },
  { studentId: "s2", studentName: "박지호", initial: "박", color: "cyan", time: "16:04 자동 출결", status: "present" },
  { studentId: "s3", studentName: "이서윤", initial: "이", color: "purple", time: "16:12 (예정 16:00)", status: "late" },
  { studentId: "s4", studentName: "정유나", initial: "정", color: "green", status: "absent", alimtalkSent: true },
  { studentId: "s5", studentName: "최도현", initial: "최", color: "blue", time: "16:00 자동 출결", status: "present" },
];

export const CLASSES: ClassRoom[] = [
  { id: "c1", name: "고2 수학 심화 A", teacher: "박선영 강사", schedule: "월/수/금 16:00", capacity: 8, current: 6 },
  { id: "c2", name: "고1 영어 기본", teacher: "김지훈 강사", schedule: "화/목 17:30", capacity: 8, current: 5 },
  { id: "c3", name: "중3 국어 종합", teacher: "이수민 강사", schedule: "월/수 15:00", capacity: 8, current: 7 },
  { id: "c4", name: "고3 수능 수학 파이널", teacher: "박선영 강사", schedule: "매일 19:00", capacity: 8, current: 8, waitlist: 2 },
  { id: "c5", name: "중2 수학 기본", teacher: "박선영 강사", schedule: "화/목 16:00", capacity: 6, current: 4 },
];

export const TODOS_ACTIVE: Todo[] = [
  { id: "t1", title: "단원 4 오답노트 정리", classOrStudent: "김민서, 박지호 +2명", daysLeft: 2, submitted: 3, total: 5, status: "active", description: "4단원 중 틀린 문제 모아 오답 풀이 작성. 풀이 과정 손글씨로 사진 첨부." },
  { id: "t2", title: "영단어 시험지 풀기", classOrStudent: "박지호", daysLeft: 5, submitted: 0, total: 1, status: "active" },
  { id: "t3", title: "독해 지문 5세트", classOrStudent: "이서윤", daysLeft: 1, submitted: 1, total: 1, status: "active" },
  { id: "t4", title: "모의고사 채점하기", classOrStudent: "정유나", daysLeft: 3, submitted: 1, total: 2, status: "active" },
];

export const TODOS_DONE: Todo[] = [
  { id: "td1", title: "단원 3 풀이 노트", classOrStudent: "김민서 · 5/8 완료", daysLeft: 0, submitted: 1, total: 1, status: "done" },
  { id: "td2", title: "단어장 1단원", classOrStudent: "박지호 · 5/7 완료", daysLeft: 0, submitted: 1, total: 1, status: "done" },
];

export const REPORT_LOGS: ReportLog[] = [
  { id: "r1", title: "5월 1주차 주간 리포트", count: 24, sentAt: "5/5 22:00", status: "sent" },
  { id: "r2", title: "4월 월말 리포트", count: 24, sentAt: "4/30 22:00", status: "sent" },
  { id: "r3", title: "4월 4주차 주간 리포트", count: 24, sentAt: "4/28 22:00", status: "sent" },
  { id: "r4", title: "4월 3주차 주간 리포트", count: 23, sentAt: "4/21 22:00", status: "partial" },
  { id: "r5", title: "중간고사 결과 리포트", count: 12, sentAt: "4/22", status: "sent" },
];

export const POINT_LOGS: PointLog[] = [
  { id: "p1", studentName: "김민서", initial: "김", color: "blue", reason: "숙제 만점", date: "5/11", amount: 500 },
  { id: "p2", studentName: "박지호", initial: "박", color: "cyan", reason: "출석 보너스", date: "5/11", amount: 100 },
  { id: "p3", studentName: "이서윤", initial: "이", color: "purple", reason: "단어 100점", date: "5/10", amount: 300 },
  { id: "p4", studentName: "정유나", initial: "정", color: "green", reason: "포인트 상점 교환", date: "5/9", amount: -1000 },
  { id: "p5", studentName: "최도현", initial: "최", color: "blue", reason: "숙제 제출", date: "5/9", amount: 200 },
];

export const VOCA_ARCHIVE: ArchiveItem[] = [
  { id: "v1", title: "고2 수능 핵심 단어 1", meta: "512개 · AI 문장 생성 완료", status: "done" },
  { id: "v2", title: "고1 영단어 5월 시험 범위", meta: "120개 · AI 문장 생성 완료", status: "done" },
  { id: "v3", title: "중3 영단어 기본", meta: "320개 · AI 문장 생성 중", status: "progress" },
  { id: "v4", title: "수능 빈출 표현 100", meta: "100개 · 미생성", status: "pending" },
];

export const SENTENCE_ARCHIVE: ArchiveItem[] = [
  { id: "se1", title: "능률 영어 Reading Plus 1", meta: "PDF 14페이지 · 추출 완료 · 240문장", status: "done" },
  { id: "se2", title: "EBS 수능특강 영어 Unit 1-3", meta: "이미지 32장 · OCR 완료 · 180문장", status: "done" },
  { id: "se3", title: "모의고사 3월 시행 31-34번", meta: "이미지 4장 · OCR 진행 중", status: "progress" },
  { id: "se4", title: "학원 자체 모의고사 Set 4", meta: "PDF 8페이지 · 빈칸 생성 중", status: "progress" },
];

export const SCHEDULE: ScheduleEvent[] = [
  { id: "ev1", date: "5/14 (목)", label: "중간고사 대비 특강 시작", category: "학사" },
  { id: "ev2", date: "5/20 (수)", label: "학부모 상담 주간 시작 (~5/24)", category: "학사" },
  { id: "ev3", date: "5/25 (월)", label: "석가탄신일 휴원", category: "휴원" },
  { id: "ev4", date: "5/28 (목)", label: "중간고사 결과 분석 리포트 발송", category: "학사" },
  { id: "ev5", date: "6/1 (월)", label: "6월 신규 등록 안내", category: "행사" },
];

export const NOTICES: NoticePost[] = [
  { id: "n1", title: "[필독] 5월 휴원 일정 안내", date: "2026.05.01", views: 142, pinned: true },
  { id: "n2", title: "중간고사 대비 특강 신청 안내", date: "2026.04.28", views: 218 },
  { id: "n3", title: "학부모 상담 주간 신청 방법", date: "2026.04.25", views: 96 },
  { id: "n4", title: "신규 강사 인사 — 김지훈 선생님 (영어)", date: "2026.04.10", views: 73 },
  { id: "n5", title: "학원 출입 NFC 카드 사용 안내", date: "2026.03.20", views: 305 },
];

export const ALIMTALK_SETTINGS: AlimtalkSetting[] = [
  { id: "a1", label: "출결 알림", description: "출석·지각·결석 시 자동 발송", enabled: true },
  { id: "a2", label: "온라인 학습 완료 알림", description: "숙제·시험 완료 시", enabled: true },
  { id: "a3", label: "수강료 납부 안내", description: "결제일 3일 전, 당일, 미납 시", enabled: true },
  { id: "a4", label: "교재비 청구 안내", description: "청구 발송 시", enabled: true },
  { id: "a5", label: "상담 일정 안내", description: "상담 예약 확정·24시간 전", enabled: false },
  { id: "a6", label: "월간 학습 리포트", description: "매월 말일 22:00 발송", enabled: true },
];

export const ALIMTALK_LOGS: AlimtalkLog[] = [
  { id: "al1", title: "출결 - 김민서", meta: "5/12 15:58 · 학부모 (어머니)", status: "success" },
  { id: "al2", title: "결석 알림 - 정유나", meta: "5/12 16:00 · 학부모 (아버지)", status: "success" },
  { id: "al3", title: "수강료 안내 - 박지호 (5월)", meta: "5/11 09:00 · 학부모", status: "success" },
  { id: "al4", title: "숙제 완료 - 이서윤", meta: "5/10 22:00 · 학부모", status: "success" },
  { id: "al5", title: "월간 리포트 - 최도현", meta: "4/30 22:00 · 학부모", status: "failed" },
];

export const CHARGE_LOGS: ChargeLog[] = [
  { id: "ch1", title: "5,000건 충전", meta: "2026/05/01 · 65,000원", status: "done" },
  { id: "ch2", title: "3,000건 충전", meta: "2026/04/02 · 39,000원", status: "done" },
  { id: "ch3", title: "5,000건 충전", meta: "2026/03/03 · 65,000원", status: "done" },
];

export const REVENUE_MONTHS: RevenueMonth[] = [
  { label: "12월", height: 55 },
  { label: "1월", height: 60 },
  { label: "2월", height: 72 },
  { label: "3월", height: 68 },
  { label: "4월", height: 74 },
  { label: "5월", height: 88 },
];

export const PAYMENT_ROWS: PaymentRow[] = [
  { id: "py1", studentName: "김민서", initial: "김", color: "blue", meta: "5/5 결제 · 480,000원", status: "completed" },
  { id: "py2", studentName: "박지호", initial: "박", color: "cyan", meta: "5/5 결제 · 380,000원", status: "completed" },
  { id: "py3", studentName: "이서윤", initial: "이", color: "purple", meta: "미납 · 5/5 예정 (학부모 알림톡 발송)", status: "unpaid" },
  { id: "py4", studentName: "정유나", initial: "정", color: "green", meta: "5/5 결제 · 520,000원", status: "completed" },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "t1", title: "출결 알림톡이 두 번 발송됩니다", date: "2026.05.08 등록", status: "answered", answeredAt: "5/8 14:23" },
  { id: "t2", title: "엑셀 학생 일괄 등록 시 오류 문의", date: "2026.05.11 등록", status: "pending" },
  { id: "t3", title: "PG사 결제 영수증 출력 가능한가요?", date: "2026.04.30 등록", status: "answered", answeredAt: "5/2 11:10" },
];

export const SUPPORT_FAQS: SupportFaq[] = [
  { id: "f1", title: "학생 계정 비밀번호 초기화는 어떻게 하나요?" },
  { id: "f2", title: "알림톡이 발송되지 않을 때 확인 방법" },
  { id: "f3", title: "엑셀 일괄 등록 양식 다운로드" },
  { id: "f4", title: "교재비를 학생별로 다르게 청구하려면?" },
  { id: "f5", title: "PG사 결제 수수료 안내" },
  { id: "f6", title: "Voca / Sentence Archive AI 처리 한도" },
];

export const BOARD_POSTS: BoardPost[] = [
  { id: "b1", title: "[정기 점검] 5월 18일(일) 새벽 2-5시 점검 안내", excerpt: "서비스 안정성 향상을 위한 정기 점검이 있을 예정입니다. 점검 시간 동안 일부 기능 사용이 제한됩니다.", date: "2026.05.10", pinned: true },
  { id: "b2", title: "신규 기능 — AI 빈칸 생성 정확도 개선 안내", excerpt: "Sentence Archive에서 빈칸 생성 정확도가 약 18% 향상되었습니다.", date: "2026.05.07" },
  { id: "b3", title: "알림톡 단가 인하 안내 (건당 14원 → 13원)", excerpt: "5월 1일부터 알림톡 단가가 인하됩니다. 잔여 건수에는 영향이 없습니다.", date: "2026.04.28" },
  { id: "b4", title: "서비스 이용약관 개정 안내 (5/1 시행)", excerpt: "개인정보 처리 방침 일부가 변경됩니다. 자세한 내용은 본문을 확인해주세요.", date: "2026.04.15" },
  { id: "b5", title: "학원 ERP 결제 보고서 PDF 출력 기능 추가", excerpt: "월별 매출현황을 PDF로 출력할 수 있는 기능이 추가되었습니다.", date: "2026.03.30" },
];
