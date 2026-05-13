"use client";

import * as React from "react";

/**
 * 클라이언트에서 localStorage(`pond_logged_in`)를 읽어 로그인 여부를 반환.
 * SSR에서는 false로 시작했다가 마운트 직후 실제 값으로 동기화.
 */
export function useLoginState(): boolean {
  const [loggedIn, setLoggedIn] = React.useState(false);

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
