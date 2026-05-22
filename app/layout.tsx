import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { DrawerProvider } from "@/components/pond/drawer";
import { AppChrome } from "@/components/pond/app-chrome";
import { LandingGuard } from "@/components/pond/landing-guard";

export const metadata: Metadata = {
  title: "The Pond",
  description: "선생님과 학생을 잇는 플랫폼",
  openGraph: {
    title: "The Pond",
    description: "선생님과 학생을 잇는 플랫폼",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pond",
    description: "선생님과 학생을 잇는 플랫폼",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3E8BFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full antialiased">
        <ToastProvider>
          <Suspense fallback={null}>
            <LandingGuard />
            <AppChrome />
            <DrawerProvider>{children}</DrawerProvider>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
