import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "포켓몬고 이벤트 캘린더",
  description: "대한민국 시간 기준 Pokémon GO 이벤트와 레이드 보스 변경 일정",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
