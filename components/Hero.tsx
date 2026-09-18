import { siteConfig } from "@/data/site";

const keywords = ["기획", "카피", "디자인", "전환 흐름"];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pb-24 lg:pt-16">
      <div className="absolute inset-x-0 top-56 h-[420px] bg-[radial-gradient(circle_at_center,rgba(98,84,255,0.18),transparent_58%)] blur-3xl" />

      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-[720px] text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-medium tracking-[0.24em] text-slate-500">
            DETAIL PAGE STRATEGY STUDIO
          </span>

          <h1 className="mx-auto mt-5 max-w-[16ch] text-[34px] font-medium leading-[0.98] tracking-[-0.055em] text-slate-950 [text-wrap:balance] sm:mt-6 sm:max-w-none sm:text-[54px] lg:text-[72px]">
            예쁜 상세페이지가 아니라
            <br />
            팔리는 이유가 보이는 상세페이지를 만듭니다.
          </h1>

          <p className="mx-auto mt-6 max-w-[330px] text-[17px] leading-[1.5] text-slate-600 sm:mt-8 sm:max-w-[620px] lg:text-[20px] lg:leading-[1.5]">
            제품의 강점만 보지 않습니다. 고객이 망설이는 지점까지 분석해
            구매로 이어지는 상세페이지를 만듭니다.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
            <a
              href={siteConfig.ctaHref}
              className="inline-flex min-w-40 items-center justify-center rounded-[12px] bg-[#463fa6] px-7 py-4 text-[12px] font-medium text-white transition hover:bg-[#3d3691]"
            >
              무료 진단 문의하기
            </a>
            <a
              href="#portfolio"
              className="inline-flex min-w-40 items-center justify-center rounded-[12px] bg-[#f1f3f9] px-7 py-4 text-[12px] font-medium text-slate-700 transition hover:bg-[#e9ecf6]"
            >
              포트폴리오 보기
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-8 h-[330px] max-w-[1120px] sm:mt-12 sm:h-[390px] lg:h-[430px]">
          <div className="absolute left-1/2 top-[54%] h-40 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(118,108,255,0.24),rgba(118,108,255,0.06)_42%,transparent_72%)] blur-3xl" />

          <div className="absolute left-[3%] top-[4%] w-[7.5rem] rounded-[20px] bg-[#f7f7fb] p-3.5 ring-1 ring-inset ring-[#ececf4] shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:left-[2%] sm:top-[8%] sm:w-[10.5rem] sm:p-5">
            <p className="text-[11px] font-medium tracking-[0.2em] text-slate-500">기획</p>
            <div className="mt-4 flex -space-x-2">
              {["#5b57d9", "#7c7af2", "#b7b5ff"].map((color) => (
                <span
                  key={color}
                  className="h-8 w-8 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="mt-3 text-[13px] font-medium leading-5 text-slate-700 sm:mt-4 sm:text-sm sm:leading-6">
              고객 질문 순서대로
              <br />
              정보 구조 정리
            </p>
          </div>

          <div className="absolute bottom-[8%] left-[15%] hidden w-[9rem] rounded-[20px] bg-white p-4 ring-1 ring-inset ring-[#ececf4] shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:block">
            <p className="text-[11px] tracking-[0.18em] text-slate-400">성과 체크</p>
            <p className="mt-4 text-[34px] font-medium tracking-[-0.04em] text-slate-900">
              3.4
            </p>
            <p className="mt-1 text-sm text-slate-500">이탈 포인트 정리</p>
          </div>

          <div className="absolute left-1/2 top-[24%] w-[min(100%-1rem,42rem)] -translate-x-1/2 rounded-[20px] bg-white p-4 ring-1 ring-inset ring-[#ececf4] shadow-[0_20px_54px_rgba(15,23,42,0.06)] sm:top-[20%] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium tracking-[0.2em] text-slate-500">
                  DETAIL FLOW
                </p>
                <p className="mt-2 text-[16px] font-medium tracking-[-0.03em] text-slate-900 sm:text-2xl">
                  첫 화면 메시지부터 CTA까지
                </p>
              </div>
              <span className="rounded-[10px] bg-[#463fa6] px-3 py-2 text-[11px] font-medium text-white">
                Premium Flow
              </span>
            </div>

            <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
              {[
                ["구매 이유 한 줄 정리", "상단 후킹"],
                ["의심 해결 섹션 배치", "신뢰 보강"],
                ["비교 / 후기 / 인증 정리", "전환 근거"],
                ["모바일 스크롤 리듬 설계", "가독성 개선"],
              ].map(([title, label]) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-[14px] bg-[#f7f7fb] px-3.5 py-3 sm:px-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#463fa6]" />
                    <span className="text-[13px] font-medium text-slate-700 sm:text-sm">
                      {title}
                    </span>
                  </div>
                  <span className="hidden text-[11px] text-slate-400 sm:block">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-[3%] top-[6%] w-[8.8rem] rounded-[20px] bg-[#f7f7fb] p-3.5 ring-1 ring-inset ring-[#ececf4] shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:right-[4%] sm:top-[10%] sm:w-[12rem] sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] tracking-[0.18em] text-slate-500">카피</p>
              <span className="h-2 w-2 rounded-full bg-[#463fa6]" />
            </div>
            <p className="mt-3 text-[13px] font-medium leading-5 text-slate-700 sm:text-sm sm:leading-6">
              장점 나열이 아니라
              <br />
              구매 이유로 문장 정리
            </p>
            <div className="mt-4 space-y-2">
              <div className="h-2 rounded-full bg-white" />
              <div className="h-2 w-4/5 rounded-full bg-white" />
            </div>
          </div>

          <div className="absolute bottom-[11%] right-[7%] hidden w-[12rem] rounded-[16px] bg-white p-4 ring-1 ring-inset ring-[#ececf4] shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:block">
            <p className="text-[11px] tracking-[0.18em] text-slate-500">전환 흐름</p>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-700">
              디자인보다 먼저 고객이
              <br />
              어디서 멈추는지부터 설계
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
