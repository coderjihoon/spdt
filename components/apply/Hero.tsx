import { applyHeroStats, applySiteConfig } from "@/data/apply";

const reportRows = [
  { label: "첫 화면", value: "핵심 메시지 약함", tone: "bg-[#d66f49]" },
  { label: "흐름", value: "구매 근거 순서 조정", tone: "bg-[#c3a047]" },
  { label: "카피", value: "고객 언어로 재정리", tone: "bg-[#748456]" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f3] px-4 pb-16 pt-12 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(116,132,86,0.08)_1px,transparent_1px),linear-gradient(rgba(116,132,86,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-[#f1eadc] to-transparent" />

      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.78fr)] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-[#d8d0bd] bg-[#fffdf8] px-4 py-2 text-[12px] font-semibold tracking-[0.18em] text-[#748456]">
            DETAIL PAGE CLINIC
          </p>

          <h1 className="mt-6 max-w-[760px] text-[42px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#1f2a24] [text-wrap:balance] sm:text-[58px] lg:text-[72px]">
            상세페이지,
            <br />
            어디서 막히는지
            <br className="hidden sm:block" />
            무료로 진단해드립니다.
          </h1>

          <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-[#586257] sm:text-[19px]">
            제품 URL 또는 상세페이지 이미지를 보내주세요. 상페닥터가 구조, 카피,
            디자인 흐름을 확인하고 구매를 막는 요소 3가지를 짚어드립니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={applySiteConfig.ctaHref}
              className="inline-flex items-center justify-center rounded-[16px] bg-[#748456] px-7 py-4 text-[15px] font-semibold text-[#fffdf8] shadow-[0_16px_40px_rgba(92,105,67,0.24)] transition hover:bg-[#657548]"
            >
              무료 진단 신청하기
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-[16px] border border-[#d8d0bd] bg-[#fffdf8] px-7 py-4 text-[15px] font-semibold text-[#1f2a24] transition hover:border-[#bfb69e]"
            >
              홈페이지로 돌아가기
            </a>
          </div>

          <dl className="mt-10 grid max-w-[700px] gap-3 sm:grid-cols-3">
            {applyHeroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-[#ded7c7] bg-[#fffdf8]/82 p-4 backdrop-blur"
              >
                <dt className="text-[22px] font-semibold tracking-[-0.04em] text-[#1f2a24]">
                  {item.value}
                </dt>
                <dd className="mt-1 text-[13px] leading-5 text-[#697166]">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="rounded-[28px] border border-[#d8d0bd] bg-[#fffdf8] p-4 shadow-[0_28px_80px_rgba(31,42,36,0.12)] sm:p-5">
            <div className="rounded-[22px] border border-[#e7dfcf] bg-[#faf8f3] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.18em] text-[#748456]">
                    FREE REPORT
                  </p>
                  <h2 className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.04em] text-[#1f2a24]">
                    구매를 막는 요소
                    <br />
                    3가지 진단
                  </h2>
                </div>
                <span className="rounded-full bg-[#1f2a24] px-3 py-1.5 text-[11px] font-semibold text-[#faf8f3]">
                  24h check
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {reportRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-[18px] border border-[#e2dac8] bg-[#fffdf8] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.tone}`} />
                        <p className="text-[13px] font-semibold text-[#697166]">{row.label}</p>
                      </div>
                      <p className="truncate text-[14px] font-semibold text-[#1f2a24]">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] bg-[#1f2a24] p-5 text-[#faf8f3]">
                <p className="text-[12px] font-semibold tracking-[0.16em] text-[#cdd7b2]">
                  NEXT ACTION
                </p>
                <p className="mt-3 text-[18px] font-semibold leading-7 tracking-[-0.03em]">
                  단순히 예쁘게 고치는 것이 아니라,
                  <br />
                  고객이 구매까지 읽게 되는 순서를 제안합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-3 hidden rounded-[18px] border border-[#d8d0bd] bg-[#fffdf8] p-4 shadow-[0_18px_50px_rgba(31,42,36,0.12)] sm:block">
            <p className="text-[12px] font-semibold text-[#697166]">접수 자료</p>
            <p className="mt-1 text-[17px] font-semibold text-[#1f2a24]">URL 또는 이미지 1개</p>
          </div>
        </div>
      </div>
    </section>
  );
}
