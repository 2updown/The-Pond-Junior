"use client";

import * as React from "react";
import Link from "next/link";
import { Rss } from "lucide-react";
import { usePosts } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { WriteButton } from "@/components/pond/write-button";
import { cn } from "@/lib/utils";

type SearchField = "title-content" | "title" | "author";

function maskAuthor(name?: string) {
  if (!name) return "관리자";
  // 첫 글자만 노출 + **
  return name[0] + "**";
}

export function NoticeBoard() {
  const allNotices = usePosts("notice");
  const loggedIn = useLoginState();
  const [searchInput, setSearchInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [searchField, setSearchField] = React.useState<SearchField>("title-content");
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!query) return allNotices;
    const q = query.toLowerCase();
    return allNotices.filter((n) => {
      if (searchField === "title") return n.title.toLowerCase().includes(q);
      if (searchField === "author") return (n.author || "").toLowerCase().includes(q);
      // title + content
      return (
        n.title.toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
      );
    });
  }, [allNotices, query, searchField]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  const handleSearch = () => {
    setQuery(searchInput.trim());
    setPage(1);
  };

  // page number list (max 10 visible)
  const pageNumbers = React.useMemo(() => {
    const max = 10;
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let startP = Math.max(1, currentPage - half);
    const endP = Math.min(totalPages, startP + max - 1);
    if (endP - startP + 1 < max) startP = Math.max(1, endP - max + 1);
    return Array.from({ length: endP - startP + 1 }, (_, i) => startP + i);
  }, [currentPage, totalPages]);

  return (
    <section className="py-8 md:py-10" id="notices">
      <div className="mx-auto max-w-6xl px-5">
        {/* Top filter bar */}
        <div className="flex flex-col gap-3 rounded-lg border border-divider bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-secondary">
            <Rss className="h-4 w-4 text-brand-500" />
            <span>
              전체 <b className="text-ink-primary">{total} 건</b>
            </span>
            <span className="mx-1 text-ink-tertiary">|</span>
            <span>
              <b className="text-ink-primary">{currentPage}</b>/{totalPages} 페이지
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-divider bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value={10}>10건</option>
              <option value={20}>20건</option>
              <option value={50}>50건</option>
            </select>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as SearchField)}
              className="rounded-md border border-divider bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand-500"
            >
              <option value="title-content">제목+내용</option>
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-32 rounded-md border border-divider bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand-500 md:w-44"
            />
            <button
              onClick={handleSearch}
              className="rounded-md bg-[#3B5072] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              검색
            </button>
          </div>
        </div>

        {/* Logged-in write button */}
        {loggedIn && (
          <div className="mt-4 flex justify-end">
            <WriteButton defaultKind="notice" />
          </div>
        )}

        {/* List table */}
        <div className="mt-4 overflow-hidden">
          <div className="border-t-2 border-[#3B5072]">
            {/* Header row */}
            <div className="grid grid-cols-[50px_minmax(0,1fr)_100px] gap-2 border-b border-divider bg-white px-4 py-3 text-xs font-semibold text-ink-secondary md:grid-cols-[60px_minmax(0,1fr)_90px_100px_70px]">
              <div className="text-center">번호</div>
              <div>제목</div>
              <div className="hidden text-center md:block">작성자</div>
              <div className="text-center">등록일</div>
              <div className="hidden text-center md:block">조회</div>
            </div>

            {items.length === 0 ? (
              <div className="bg-white px-4 py-16 text-center text-sm text-ink-tertiary">
                {query ? "검색 결과가 없습니다." : "등록된 공지가 없습니다."}
              </div>
            ) : (
              items.map((n, i) => {
                const num = total - start - i;
                return (
                  <Link
                    key={n.id}
                    href={`/notices/${n.id}`}
                    className={cn(
                      "grid grid-cols-[50px_minmax(0,1fr)_100px] gap-2 border-b border-divider bg-white px-4 py-3.5 text-[13px] transition-colors hover:bg-[#F5F8FF]",
                      "md:grid-cols-[60px_minmax(0,1fr)_90px_100px_70px]"
                    )}
                  >
                    <div className="text-center text-ink-tertiary">{num}</div>
                    <div className="truncate text-ink-primary">
                      {(n.pinned || n.tag === "필독") && (
                        <span className="mr-1.5 rounded bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-bold text-brand-600">
                          필독
                        </span>
                      )}
                      {n.title}
                    </div>
                    <div className="hidden text-center text-ink-secondary md:block">
                      {maskAuthor(n.author)}
                    </div>
                    <div className="text-center text-ink-secondary">{n.date}</div>
                    <div className="hidden text-center text-ink-secondary md:block">
                      {n.views || 0}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              aria-label="처음"
              className="px-2 py-1 text-sm text-ink-tertiary hover:text-brand-500 disabled:opacity-30"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="이전"
              className="px-2 py-1 text-sm text-ink-tertiary hover:text-brand-500 disabled:opacity-30"
            >
              ‹
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors",
                  p === currentPage
                    ? "bg-brand-500 font-bold text-white"
                    : "text-ink-secondary hover:bg-muted hover:text-brand-500"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="다음"
              className="px-2 py-1 text-sm text-ink-tertiary hover:text-brand-500 disabled:opacity-30"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막"
              className="px-2 py-1 text-sm text-ink-tertiary hover:text-brand-500 disabled:opacity-30"
            >
              »
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
