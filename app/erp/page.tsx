"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/pond/topbar";
import { AppShell } from "@/components/pond/app-shell";
import { Avatar } from "@/components/pond/avatar";
import { Chip } from "@/components/pond/chip";
import { InfoBox } from "@/components/pond/info-box";
import { REVENUE_MONTHS, PAYMENT_ROWS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "revenue" | "payment" | "textbook" | "online" | "expense" | "stats";

const TABS: { id: Tab; label: string }[] = [
  { id: "revenue", label: "매출" },
  { id: "payment", label: "수강료" },
  { id: "textbook", label: "교재비" },
  { id: "online", label: "온라인" },
  { id: "expense", label: "지출" },
  { id: "stats", label: "통계" },
];

export default function ErpPage() {
  const sp = useSearchParams();
  const initial = (sp?.get("tab") as Tab) || "revenue";
  const [tab, setTab] = React.useState<Tab>(initial);

  React.useEffect(() => {
    if (sp?.get("tab")) setTab(sp.get("tab") as Tab);
  }, [sp]);

  return (
    <>
      <Topbar title="경영관리 / ERP" />
      <AppShell hideBottomNav>
        <div className="flex overflow-x-auto border-b border-divider">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-none whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold -mb-px transition-colors",
                tab === t.id
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-ink-tertiary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "revenue" && <RevenueTab />}
        {tab === "payment" && <PaymentTab />}
        {tab === "textbook" && <TextbookTab />}
        {tab === "online" && <OnlineTab />}
        {tab === "expense" && <ExpenseTab />}
        {tab === "stats" && <StatsTab />}
      </AppShell>
    </>
  );
}

function RevenueTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">이번 달 매출</div>
          <div className="text-xl font-bold">18,420,000</div>
          <div className="text-[11px] font-semibold text-success">▲ 12.4% vs 4월</div>
        </div>
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">미수금</div>
          <div className="text-xl font-bold">1,250,000</div>
          <div className="text-[11px] font-semibold text-danger">▼ 3건</div>
        </div>
      </div>
      <div className="pond-card">
        <div className="text-[11px] font-semibold text-ink-secondary">최근 6개월 매출</div>
        <BarChart />
      </div>
      <InfoBox>월별 매출현황 PC 페이지에서 카테고리·반별 상세 분석 가능.</InfoBox>
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">5월 결제 완료</div>
          <div className="text-xl font-bold">21명</div>
        </div>
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">미납</div>
          <div className="text-xl font-bold">3명</div>
          <div className="text-[11px] font-semibold text-danger">알림톡 발송됨</div>
        </div>
      </div>
      <InfoBox variant="brand">
        PG사 연동으로 자동 결제 처리 · 미납 학생은 학부모 알림톡 자동 발송됩니다.
      </InfoBox>
      <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
        {PAYMENT_ROWS.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0"
          >
            <Avatar initial={p.initial} color={p.color} size="sm" />
            <div className="flex-1">
              <div className="text-[13px] font-medium">{p.studentName}</div>
              <div className="text-[11px] text-ink-secondary">{p.meta}</div>
            </div>
            <Chip variant={p.status === "completed" ? "done" : "canceled"}>
              {p.status === "completed" ? "완료" : "미납"}
            </Chip>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextbookTab() {
  const rows = [
    { id: "tb1", title: "능률 영어 Reading Plus 1", meta: "5명 청구 · 18,000원 × 5", status: "결제 4/5" },
    { id: "tb2", title: "수능특강 영어 (EBS)", meta: "12명 청구 · 14,000원 × 12", status: "결제 12/12" },
    { id: "tb3", title: "자체 모의고사 Set", meta: "8명 청구 · 8,000원 × 8", status: "청구중" },
    { id: "tb4", title: "국어 자습서 (천재)", meta: "7명 청구 · 16,000원 × 7", status: "결제 7/7" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0">
          <div className="flex-1">
            <div className="text-[13px] font-medium">{r.title}</div>
            <div className="text-[11px] text-ink-secondary">{r.meta}</div>
          </div>
          <Chip variant={r.status.includes("청구") ? "scheduled" : "done"}>{r.status}</Chip>
        </div>
      ))}
    </div>
  );
}

function OnlineTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="pond-card">
        <div className="text-[11px] font-semibold text-ink-tertiary">5월 본사 청구서</div>
        <div className="mt-1.5 text-2xl font-bold">324,000원</div>
        <div className="text-xs text-ink-secondary">활성 학생 27명 × 12,000원 · 결제 기한 5/15</div>
      </div>
      <button className="h-12 rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600">
        청구서 확인 및 결제
      </button>
      <div className="px-1 pt-2 text-xs font-semibold text-ink-tertiary">최근 결제 내역</div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
        {["2026년 4월 · 활성 26명 · 312,000원", "2026년 3월 · 활성 25명 · 300,000원", "2026년 2월 · 활성 24명 · 288,000원"].map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0">
            <div className="flex-1 text-[13px]">{m}</div>
            <Chip variant="done">결제완료</Chip>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpenseTab() {
  const items = [
    { label: "임대료", meta: "5/1 자동이체", amount: -2200000 },
    { label: "강사 급여 (3명)", meta: "5/10 이체", amount: -2400000 },
    { label: "교재 매입 (5월분)", meta: "5/4 카드", amount: -680000 },
    { label: "사무용품", meta: "5/8 카드", amount: -120000 },
    { label: "온라인 사용료 (4월)", meta: "5/2 자동이체", amount: -312000 },
    { label: "전기·수도 (4월분)", meta: "5/15 자동이체 예정", amount: -180000, pending: true },
  ];
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">5월 지출</div>
          <div className="text-xl font-bold">5,820,000</div>
        </div>
        <div className="pond-card">
          <div className="text-[11px] font-semibold text-ink-secondary">예산 대비</div>
          <div className="text-xl font-bold">78%</div>
          <div className="text-[11px] font-semibold text-success">정상</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-elev1">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-divider px-4 py-3 last:border-b-0">
            <div className="flex-1">
              <div className="text-[13px] font-medium">{it.label}</div>
              <div className="text-[11px] text-ink-secondary">{it.meta}</div>
            </div>
            <span className={cn("font-bold", it.pending ? "text-ink-tertiary" : "text-danger")}>
              {it.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <InfoBox>지출 항목 생성·내역 입력은 PC에서 진행해주세요.</InfoBox>
    </div>
  );
}

function StatsTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="pond-card">
        <div className="text-[11px] font-semibold text-ink-tertiary">
          2026년 5월 일일 집계 (오늘)
        </div>
        <div className="mt-2 flex gap-3.5">
          <StatCol label="수입" value="+680,000" color="text-success" />
          <StatCol label="지출" value="-120,000" color="text-danger" />
          <StatCol label="순익" value="560,000" />
        </div>
      </div>
      <div className="pond-card">
        <div className="text-[11px] font-semibold text-ink-tertiary">5월 누적 (5/12 기준)</div>
        <div className="mt-2 flex gap-3.5">
          <StatCol label="수입" value="+18,420,000" color="text-success" />
          <StatCol label="지출" value="-5,820,000" color="text-danger" />
          <StatCol label="순익" value="12,600,000" />
        </div>
      </div>
      <div className="pond-card">
        <div className="text-[11px] font-semibold text-ink-secondary">월별 수입·지출 (최근 6개월)</div>
        <BarChart />
      </div>
    </div>
  );
}

function StatCol({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] text-ink-secondary">{label}</div>
      <div className={cn("text-lg font-bold", color)}>{value}</div>
    </div>
  );
}

function BarChart() {
  return (
    <div className="relative mt-2 flex h-[120px] items-end gap-2 px-1 pt-2">
      {REVENUE_MONTHS.map((m) => (
        <div key={m.label} className="relative flex-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-b from-brand-500 to-[#7BB1FF]"
            style={{ height: `${m.height}%`, minHeight: 4 }}
          />
          <span className="absolute -bottom-[18px] left-0 right-0 text-center text-[10px] font-semibold text-ink-tertiary">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
