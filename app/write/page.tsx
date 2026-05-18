"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";
import { LandingShell } from "@/components/pond/landing/landing-shell";
import { addPost, updatePost, getPost, type Post, type PostKind } from "@/lib/posts-store";
import { useLoginState } from "@/lib/use-login-state";
import { useToast } from "@/components/ui/toast";

const KIND_LABELS: Record<PostKind, string> = {
  notice: "공지사항",
  schedule: "학원 일정",
  photo: "사진/갤러리",
  menu: "식단/메뉴",
};

const RETURN_PATHS: Record<PostKind, string> = {
  notice: "/notices",
  schedule: "/notices",
  photo: "/gallery",
  menu: "/notices",
};

const DETAIL_PATHS: Partial<Record<PostKind, string>> = {
  notice: "/notices",
  photo: "/gallery",
};

const TAG_OPTIONS: Record<PostKind, string[]> = {
  notice: ["필독", "안내", "공지"],
  schedule: ["학사", "행사", "휴원"],
  photo: [],
  menu: [],
};

const VALID_KINDS: PostKind[] = ["notice", "schedule", "photo", "menu"];

export default function WritePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const loggedIn = useLoginState();
  const { toast } = useToast();

  const editId = sp?.get("id") || null;
  const kindParam = sp?.get("kind") as PostKind | null;

  // Edit mode: load post once and prefill
  const [editPost, setEditPost] = React.useState<Post | null>(null);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [pinned, setPinned] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!editId) {
      setEditPost(null);
      setLoaded(true);
      return;
    }
    const p = getPost(editId);
    if (p) {
      setEditPost(p);
      setTitle(p.title);
      setContent(p.content);
      setTag(p.tag ?? "");
      setPinned(!!p.pinned);
    }
    setLoaded(true);
  }, [editId]);

  const isEdit = !!editPost;
  const kind: PostKind =
    editPost?.kind ?? (kindParam && VALID_KINDS.includes(kindParam) ? kindParam : "notice");
  const returnPath = RETURN_PATHS[kind];

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  // 비로그인 시 홈으로 (확정된 false에만 동작)
  React.useEffect(() => {
    if (loggedIn === false) {
      router.replace("/");
    }
  }, [loggedIn, router]);

  if (loggedIn !== true || !loaded) {
    return (
      <LandingShell>
        <section className="mx-auto max-w-5xl px-5 py-12 text-center text-sm text-ink-tertiary">
          확인 중…
        </section>
      </LandingShell>
    );
  }

  // edit 모드인데 글이 없으면 안내
  if (editId && !editPost) {
    return (
      <LandingShell>
        <section className="mx-auto max-w-5xl px-5 py-12 text-center">
          <p className="text-sm text-ink-secondary">
            수정하려는 게시글을 찾을 수 없습니다.
          </p>
          <Link
            href="/notices"
            className="mt-4 inline-block rounded-md border border-divider bg-white px-4 py-2 text-sm font-semibold text-ink-primary hover:bg-muted"
          >
            목록으로
          </Link>
        </section>
      </LandingShell>
    );
  }

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (isEdit && editPost) {
      updatePost(editPost.id, {
        title: title.trim(),
        content: content.trim(),
        tag: tag || undefined,
        pinned,
      });
      toast({ message: "게시글이 수정되었습니다." });
      // 수정 후 상세 페이지로 (있다면)
      const detailBase = DETAIL_PATHS[kind];
      if (detailBase) router.push(`${detailBase}/${editPost.id}`);
      else router.push(returnPath);
    } else {
      addPost({
        kind,
        title: title.trim(),
        content: content.trim(),
        tag: tag || undefined,
        pinned,
        author: "Letitu 선생님",
      });
      toast({ message: "게시글이 등록되었습니다." });
      router.push(returnPath);
    }
  };

  return (
    <LandingShell>
      <section className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isEdit ? "글 수정" : "글 쓰기"}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-500">
              <Home className="h-3.5 w-3.5" />홈
            </Link>
            <span>›</span>
            <Link href={returnPath} className="hover:text-brand-500">
              {KIND_LABELS[kind]}
            </Link>
            <span>›</span>
            <span className="font-semibold text-ink-primary">
              {isEdit ? "글 수정" : "글 쓰기"}
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="overflow-hidden border-t-2 border-[#3B5072] bg-white shadow-elev1">
          <div className="flex">
            <div className="bg-[#3B5072] px-6 py-3.5 text-sm font-bold text-white">
              {KIND_LABELS[kind]} {isEdit ? "수정" : "글쓰기"}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* STEP 1 */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-[#C53A3A] px-2.5 py-1 text-[11px] font-bold text-white">
                  STEP 1
                </span>
                <span className="text-sm font-semibold">제목을 입력해 주세요.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm font-semibold text-ink-secondary md:inline">
                  [t] 글 제목
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="flex-1 rounded-md border border-divider bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
                />
              </div>
            </div>

            {/* STEP 2 */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-[#C53A3A] px-2.5 py-1 text-[11px] font-bold text-white">
                  STEP 2
                </span>
                <span className="text-sm font-semibold">내용을 써 주세요.</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="내용을 입력하세요"
                className="w-full resize-none rounded-md border border-divider bg-white px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              />
              <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
                동영상은 유튜브에 올린 후 링크를 넣으면 재생창이 생깁니다.
                <br />
                첨부파일은 PDF로 첨부해야만 학부모가 별도 앱을 깔지 않고 볼 수 있습니다.
              </p>
            </div>

            {/* STEP 3 — tags */}
            {TAG_OPTIONS[kind].length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded bg-[#C53A3A] px-2.5 py-1 text-[11px] font-bold text-white">
                    STEP 3
                  </span>
                  <span className="text-sm font-semibold">
                    태그를 선택해 주세요. <span className="text-ink-tertiary">(선택)</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS[kind].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTag(t === tag ? "" : t)}
                      className={
                        "rounded-pill px-4 py-1.5 text-xs font-semibold transition-colors " +
                        (t === tag
                          ? "bg-brand-500 text-white"
                          : "bg-muted text-ink-secondary hover:bg-brand-50 hover:text-brand-600")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned */}
            {kind === "notice" && (
              <div>
                <label className="flex items-center gap-2 text-sm text-ink-primary">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="h-4 w-4 accent-brand-500"
                  />
                  상단 고정 (필독)
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={
              isEdit && editPost && DETAIL_PATHS[kind]
                ? `${DETAIL_PATHS[kind]}/${editPost.id}`
                : returnPath
            }
            className="rounded-md border border-divider bg-white px-8 py-2.5 text-sm font-semibold text-ink-primary hover:bg-muted"
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={
              "rounded-md px-10 py-2.5 text-sm font-semibold transition-colors " +
              (canSubmit
                ? "bg-[#3B5072] text-white hover:opacity-90"
                : "cursor-not-allowed bg-muted text-ink-tertiary")
            }
          >
            {isEdit ? "수정 완료" : "등록"}
          </button>
        </div>
      </section>
    </LandingShell>
  );
}
