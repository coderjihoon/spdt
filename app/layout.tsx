import type { Metadata } from "next";
import "./globals.css";

// ponytail: metadataBase는 실제 배포 도메인으로 바꾸세요 (env NEXT_PUBLIC_SITE_URL 우선)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spdt.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SPDT | 상세페이지 제작 서비스",
  description:
    "제품의 매력과 구매 이유가 한눈에 보이도록 설계하는 상세페이지 제작 서비스 웹사이트입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "SPDT",
    title: "SPDT | 상세페이지 제작 서비스",
    description:
      "제품의 매력과 구매 이유가 한눈에 보이도록 설계하는 상세페이지 제작 서비스 웹사이트입니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPDT | 상세페이지 제작 서비스",
    description:
      "제품의 매력과 구매 이유가 한눈에 보이도록 설계하는 상세페이지 제작 서비스 웹사이트입니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
