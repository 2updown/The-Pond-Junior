"use client";

import * as React from "react";

/**
 * 클라이언트에서 localStorage(`pond_logged_in`)를 읽어 로그인 여부를 반환.
 * - 초기 마운트 전: `null` (확정되지 않음)
 * - 확정 후: `true` 또는 `false`
 *
 * Truthy/falsy 체크(`{loggedIn && ...}`)는 그대로 동작하고,
 * redirect 같은 분기는 `loggedIn === false`로 명시적 확정 후에만 동작하도록 작성.
 */
export function useLoginState(): boolean | null {
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const sync = () => {
      try {
        setLoggedIn(localStorage.getItem("pond_logged_in") === "true");
      } catch {
        setLoggedIn(false);
      }
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return loggedIn;
}
