import type { Metadata } from "next";

const cta = "/#diagnosis-form";

export const metadata: Metadata = {
  title: "상페닥터 | 고객이 이해하고 구매하는 상세페이지",
  description: "제품의 장점을 고객의 구매 이유로 정리합니다. 상세페이지의 첫 화면, 설명 순서, 신뢰 근거를 진단해보세요.",
  openGraph: { url: "/story1", title: "상페닥터 | 고객이 이해하고 구매하는 상세페이지" },
};

const problems = [
  ["첫 화면에 답이 없습니다.", "고객은 제품을 알아보기 전에 이 페이지가 자신과 관련 있는지부터 판단합니다.", "lg:col-start-1"],
  ["장점이 한꺼번에 쏟아집니다.", "좋은 정보도 우선순위 없이 쌓이면 구매 이유가 아니라 읽어야 할 숙제가 됩니다.", "lg:col-start-5"],
  ["믿을 근거가 늦게 나옵니다.", "후기와 인증은 의심이 생긴 자리에서 보여야 고객의 다음 질문으로 이어집니다.", "lg:col-start-3"],
];
const steps = [
  ["자료 보내기", "제품 URL이나 상세페이지 이미지를 보내주세요."],
  ["막히는 곳 찾기", "첫 화면, 카피, 구매 흐름을 고객의 시선으로 살펴봅니다."],
  ["순서 다시 세우기", "먼저 고칠 요소 3가지와 개선 방향을 확인하세요."],
];

export default function StoryOnePage() {
  return (
    <main className="overflow-x-clip bg-[#F4F3EF] text-[#17212B]">
      <header className="bg-[#17212B] px-5 text-white sm:px-8">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between border-b border-white/25">
          <a href="/" className="text-xl font-bold tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">상페닥터<span className="text-[#9BB7FF]">.</span></a>
          <span className="hidden text-sm text-[#B8C2CF] sm:block">상세페이지 구조 · 카피 진단</span>
          <a href={cta} className="text-sm font-semibold underline decoration-[#9BB7FF] underline-offset-8 hover:text-[#B8CDFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">무료 진단 신청 ↗</a>
        </div>
      </header>

      <section className="bg-[#17212B] px-5 pt-14 text-white sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-[1320px]">
          <h1 className="text-[clamp(3rem,8.4vw,8.5rem)] font-semibold leading-[1.06] tracking-[-0.04em]">고객이 사는<br className="sm:hidden" /> 이유를<br /><span className="text-[#AFC6FF]">페이지에<br className="sm:hidden" /> 놓습니다.</span></h1>
          <div className="mt-12 flex flex-col gap-8 pb-14 sm:mt-16 sm:pb-20 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-base leading-8 text-[#CED7E3] sm:text-xl sm:leading-9">상세페이지의 첫 문장부터 구매 버튼까지.<br />제품의 장점이 고객에게 필요한 순서로 읽히게 만듭니다.</p>
            <a href={cta} className="inline-flex min-h-14 items-center justify-center self-start rounded-md bg-[#004EE0] px-7 text-base font-semibold text-white transition-colors hover:bg-[#286EFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">내 페이지 무료 진단받기 <span aria-hidden="true" className="ml-5 text-xl">↗</span></a>
          </div>
          <div className="grid border-t border-white/25 sm:grid-cols-3">
            {["무엇을 파는가?", "내게 왜 필요한가?", "어떻게 시작하는가?"].map((question, index) => <div key={question} className="flex min-h-24 items-center gap-6 border-b border-white/25 py-5 sm:min-h-36 sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0 sm:first:pl-0"><span className="text-sm tabular-nums text-[#9BAEC6]">0{index + 1}</span><span className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">{question}</span></div>)}
          </div>
        </div>
      </section>

      <section id="outcome" className="px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <h2 className="text-[clamp(2.6rem,5.5vw,6rem)] font-semibold leading-[1.12] tracking-[-0.04em] [text-wrap:balance]">설명의 순서가<br />바뀌면,<br /><span className="text-[#004EE0]">결정이 쉬워집니다.</span></h2>
            <div className="flex flex-col justify-end"><p className="max-w-md text-lg leading-9 text-[#465565]">고객은 모든 내용을 읽고 결정하지 않습니다. 필요한 답을 만나는 순간마다 다음으로 넘어갑니다.</p><a href="#problem" className="mt-8 self-start border-b border-[#17212B] pb-1 text-sm font-semibold hover:text-[#004EE0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">고객이 멈추는 지점 보기 ↘</a></div>
          </div>
          <div className="mt-20 grid border-t-2 border-[#17212B] md:grid-cols-3">
            {[["읽힘", "무엇을 파는지 바로 보이고"], ["이해", "사용 후 변화가 그려지고"], ["선택", "믿을 근거 뒤에 행동이 놓입니다"]].map(([title, body], index) => <div key={title} className="border-b border-[#BBC1C5] py-7 md:min-h-60 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"><span className="text-xs font-semibold tabular-nums text-[#65717E]">0{index + 1} / 03</span><h3 className="mt-8 text-[clamp(2.2rem,4vw,4.5rem)] font-semibold tracking-[-0.04em]">{title}</h3><p className="mt-3 text-base leading-7 text-[#465565]">{body}</p></div>)}
          </div>
        </div>
      </section>

      <section id="problem" className="bg-white px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-8 border-b-2 border-[#17212B] pb-10 lg:flex-row lg:items-end"><h2 className="text-[clamp(2.7rem,6.5vw,7rem)] font-semibold leading-[1.1] tracking-[-0.04em] [text-wrap:balance]">좋은 제품인데,<br />왜 멈출까요?</h2><p className="max-w-sm text-lg leading-8 text-[#465565]">제품이 부족해서가 아니라, 필요한 답이 보이지 않아서일 수 있습니다.</p></div>
          <div className="grid gap-y-2 py-12 lg:grid-cols-12 lg:py-16">{problems.map(([title, body, position], index) => <article key={title} className={`${position} border-b border-[#C9D0D7] py-10 lg:col-span-7 lg:py-16`}><span className="text-sm font-semibold tabular-nums text-[#004EE0]">0{index + 1}</span><h3 className="mt-5 text-[clamp(1.9rem,3.6vw,3.6rem)] font-semibold leading-[1.2] tracking-[-0.035em]">{title}</h3><p className="mt-5 max-w-lg text-base leading-8 text-[#465565]">{body}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#DDE5F1] px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
          <div><h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">고객의 시선에서<br />다시 읽습니다.</h2><p className="mt-7 max-w-sm text-base leading-8 text-[#465565]">첫 화면, 설명의 순서, 근거가 필요한 자리를 살펴보고 구매 흐름을 정리합니다.</p><a href="/#report-preview" className="mt-8 inline-block border-b border-[#17212B] pb-1 text-sm font-semibold hover:text-[#004EE0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">진단서 예시 보기 ↗</a></div>
          <blockquote className="border-t-2 border-[#17212B] pt-8"><p className="text-[clamp(1.9rem,3.3vw,3.8rem)] font-medium leading-[1.34] tracking-[-0.035em]">“단순히 원하는 상세페이지를 만들어주는 것이 아니라 기획 단계부터 함께 고민하고, 설득력과 전달력 있는 페이지를 만들어주는 완전한 협업이었습니다.”</p><footer className="mt-9 text-sm text-[#465565]">실제 고객 후기 · 재구매 고객</footer></blockquote>
        </div>
      </section>

      <section id="process" className="px-5 py-24 sm:px-8 sm:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="text-[clamp(2.7rem,6vw,6.5rem)] font-semibold leading-[1.1] tracking-[-0.04em]">복잡하게<br />시작하지 않습니다.</h2><p className="max-w-xs text-lg leading-8 text-[#465565]">제품 URL 또는 상세페이지 이미지 하나로 신청할 수 있습니다.</p></div>
          <ol className="mt-16 grid border-t-2 border-[#17212B] md:grid-cols-3">{steps.map(([title, body], index) => <li key={title} className="border-b border-[#BBC1C5] py-8 md:min-h-80 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><span className="text-[clamp(3.8rem,6vw,6.5rem)] font-semibold leading-none tracking-[-0.04em] text-[#B6C1CD]">0{index + 1}</span><h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-4 max-w-xs text-base leading-7 text-[#465565]">{body}</p></li>)}</ol>
        </div>
      </section>

      <section className="bg-[#004EE0] px-5 py-24 text-white sm:px-8 sm:py-32"><div className="mx-auto max-w-[1320px]"><h2 className="max-w-6xl text-[clamp(2.8rem,7vw,7.5rem)] font-semibold leading-[1.08] tracking-[-0.04em] [text-wrap:balance]">지금, 고객이 멈추는<br />곳부터 찾아보세요.</h2><div className="mt-12 flex flex-col gap-8 border-t border-white/40 pt-8 md:flex-row md:items-end md:justify-between"><p className="max-w-xl text-lg leading-8 text-[#D5E3FF]">제품 URL이나 이미지를 보내면 구매를 막는 요소 3가지와 개선 방향을 정리해드립니다.</p><a href={cta} className="inline-flex min-h-14 items-center justify-center self-start rounded-md bg-white px-7 text-base font-semibold text-[#003DAA] transition-colors hover:bg-[#E9F0FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">무료 진단 신청하기 <span aria-hidden="true" className="ml-6 text-xl">↗</span></a></div></div></section>

      <footer className="bg-[#17212B] px-5 py-9 text-white sm:px-8"><div className="mx-auto flex max-w-[1320px] flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between"><span className="text-lg font-bold tracking-[-0.03em]">상페닥터.</span><span className="text-[#ABB7C5]">제품의 장점을 고객의 구매 이유로.</span><a href="/" className="underline underline-offset-4 hover:text-[#B8CDFF]">메인 페이지로 이동</a></div></footer>
    </main>
  );
}
