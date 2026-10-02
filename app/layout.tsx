import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script id="meta-pixel" strategy="beforeInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1745198020069886');
fbq('track','PageView');`}
        </Script>
      </head>
      <body>
        {children}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1745198020069886&ev=PageView&noscript=1" alt="" />
        </noscript>
      </body>
    </html>
  );
}
