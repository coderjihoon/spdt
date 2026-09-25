import type { Metadata } from "next";

const diagnosisHref = "/#diagnosis-form";
const consultHref = "https://open.kakao.com/me/spdt";

export const metadata: Metadata = {
  title: "상페닥터 | 구매가 멈추는 이유를 찾는 상세페이지 진단",
  description:
    "상세페이지 URL이나 이미지를 보내주세요. 첫 화면, 카피, 구매 흐름을 살펴보고 먼저 고칠 요소 3가지를 정리해드립니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/story",
    title: "상페닥터 | 구매가 멈추는 이유를 찾는 상세페이지 진단",
    description: "고객이 망설이는 지점을 찾고, 먼저 고칠 부분을 정리해드립니다.",
  },
};

const problems = [
  {
    title: "첫 화면에 장점이 너무 많습니다",
    description: "고객은 여러 기능을 읽기 전에 이 제품이 왜 필요한지부터 알고 싶어 합니다.",
  },
  {
    title: "믿을 근거가 늦게 나옵니다",
    description: "후기와 인증이 있어도 고객이 망설이는 순간에 보이지 않으면 도움이 되기 어렵습니다.",
  },
  {
    title: "설명의 순서가 고객의 질문과 다릅니다",
    description: "제품 정보를 모두 담아도 궁금한 순서대로 답하지 않으면 구매 이유가 흐려집니다.",
  },
];

const steps = [
  ["자료 보내기", "판매 중인 제품 URL이나 상세페이지 이미지 중 편한 것을 보내주세요."],
  ["진단서 확인하기", "첫 화면, 카피, 구매 흐름에서 고객이 멈출 만한 지점을 살펴봅니다."],
  ["먼저 고칠 부분 정하기", "구매를 막는 요소 3가지와 개선 방향을 확인하세요."],
];

export default function StoryPage() {
  return (
    <main className="overflow-x-clip bg-white text-slate-950">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="/" className="text-lg font-semibold tracking-[-0.03em] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
            상페닥터
          </a>
          <a href={diagnosisHref} className="rounded-lg bg-[#004EE0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003DB2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">
            무료 진단 시작하기
          </a>
        </div>
      </header>

      <section className="px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.12] tracking-[-0.04em] [text-wrap:balance]">
            좋은 제품인데,<br />상세페이지에서 구매가 멈추나요?
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
            고객이 제품의 가치를 이해하고 믿을 수 있도록, 먼저 구매를 망설이는 이유부터 찾아드립니다.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={diagnosisHref} className="inline-flex items-center justify-center rounded-xl bg-[#004EE0] px-6 py-4 text-sm font-semibold text-white hover:bg-[#003DB2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">
              무료 진단 시작하기
            </a>
            <a href={consultHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">
              제작 상담하기
            </a>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-500">제품 URL 또는 상세페이지 이미지 하나로 신청할 수 있습니다.</p>
        </div>
      </section>

      <section className="bg-[#F7F7FB] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl [text-wrap:balance]">
            고객은 제품이 부족해서만 망설이지 않습니다.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            구매를 결정하는 데 필요한 답을 페이지에서 찾지 못할 때도 멈춥니다.
          </p>
          <div className="mt-12 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-3">
            {problems.map((problem) => (
              <div key={problem.title}>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{problem.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:gap-20">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl [text-wrap:balance]">
              상페닥터가 고객의 시선으로 읽어봅니다.
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              첫 화면에서 무엇이 보이는지, 설명이 어떤 순서로 이어지는지, 믿을 근거가 필요한 자리에 있는지 살펴봅니다.
            </p>
            <a href="/#report-preview" className="mt-7 inline-flex text-sm font-semibold text-[#004EE0] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              진단서 예시 보기
            </a>
          </div>
          <div className="rounded-2xl bg-[#F7F7FB] p-7 sm:p-9">
            <h3 className="text-lg font-semibold">진단서에서 확인할 내용</h3>
            <ul className="mt-6 space-y-5 text-base leading-7 text-slate-700">
              <li className="border-t border-slate-200 pt-5">구매 이유가 첫 화면에서 보이는지</li>
              <li className="border-t border-slate-200 pt-5">카피가 고객의 질문에 답하는지</li>
              <li className="border-t border-slate-200 pt-5">후기·인증·제품 정보가 자연스럽게 이어지는지</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7FB] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
            시작은 간단합니다.
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map(([title, description], index) => (
              <li key={title} className="border-t border-slate-300 pt-5">
                <span className="text-sm font-semibold text-[#004EE0]">{index + 1}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#004EE0] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl [text-wrap:balance]">
              지금 상세페이지에서 막히는 곳을 확인해보세요.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
              제품 URL이나 이미지를 보내면 먼저 고칠 요소 3가지를 정리해드립니다.
            </p>
          </div>
          <a href={diagnosisHref} className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-4 text-sm font-semibold text-[#003DAD] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            무료 진단 시작하기
          </a>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl [text-wrap:balance]">
            고객의 망설임을 그대로 두면, 설명을 더해도 같은 곳에서 멈출 수 있습니다.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            구매 이유가 늦게 나오거나 신뢰 근거가 흩어져 있다면, 고객은 필요한 답을 찾기 전에 페이지를 떠날 수 있습니다. 무엇부터 바꿀지 먼저 확인하는 이유입니다.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F7FB] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl [text-wrap:balance]">
            고객이 필요한 답을 순서대로 만나는 상세페이지로.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            제품의 강점을 구매 이유로 정리하고, 의심이 생기는 지점에는 근거를 놓습니다. 무료 진단으로 지금 페이지에서 시작할 부분을 찾아보세요.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={diagnosisHref} className="inline-flex items-center justify-center rounded-xl bg-[#004EE0] px-6 py-4 text-sm font-semibold text-white hover:bg-[#003DB2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">
              무료 진단 시작하기
            </a>
            <a href={consultHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">
              제작 상담하기
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>상페닥터</span>
          <a href="/" className="underline underline-offset-4 hover:text-slate-800">메인 페이지로 돌아가기</a>
        </div>
      </footer>
    </main>
  );
}
