const diagnosisPerspectives = [
  {
    number: "01",
    title: "살 이유가 보이는가",
    description: "제품의 핵심 장점과 고객이 얻는 이점이 명확하게 전달되는지 확인합니다.",
    checks: "핵심 소구점 · 고객이 얻는 이점",
  },
  {
    number: "02",
    title: "설득 순서가 자연스러운가",
    description: "고객이 궁금해할 정보가 필요한 시점에 나오는지 확인합니다.",
    checks: "정보 우선순위 · 설명 흐름",
  },
  {
    number: "03",
    title: "구매를 망설일 이유가 남아 있는가",
    description: "효과에 대한 근거, 사용법, 옵션 등 결정에 필요한 정보가 빠져 있는지 확인합니다.",
    checks: "신뢰 근거 · 사용법 · 옵션 안내",
  },
];

export function EmpathyDiagnosisSection() {
  return (
    <section id="guide" aria-labelledby="empathy-diagnosis-title" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[850px]">
          <p className="text-[14px] font-medium text-[#004EE0]">상세페이지의 문제를 함께 찾는 가이드</p>
          <h2 id="empathy-diagnosis-title" className="mt-4 text-[clamp(30px,8vw,38px)] font-medium leading-[1.12] tracking-[-0.04em] text-slate-950 sm:text-[44px] lg:text-[52px]">
            어디부터 고쳐야 할지 막막한 상세페이지,<br className="hidden sm:block" /> 함께 짚어드립니다.
          </h2>
          <div className="mt-6 max-w-[720px] space-y-3 text-[16px] leading-7 text-slate-600">
            <p>사진을 바꾸고 설명을 추가해도 판매가 나아지지 않으면, 다음에는 무엇을 바꿔야 할지 고민됩니다.</p>
            <p>상페닥터는 고객이 제품을 이해하고 구매를 결정하는 흐름을 따라, 상세페이지의 문제와 수정 우선순위를 짚어드립니다.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 lg:mt-16 lg:pt-10">
          <h3 className="text-[20px] font-medium tracking-[-0.03em] text-slate-900 sm:text-[22px]">상페닥터는 이 세 가지를 확인합니다.</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {diagnosisPerspectives.map((item) => (
              <article key={item.number} className="flex flex-col rounded-[20px] border border-[#ececf4] bg-white p-6 sm:p-7 lg:p-8">
                <span className="text-[14px] font-medium tracking-[0.12em] text-[#004EE0]">{item.number}</span>
                <h4 className="mt-7 text-[22px] font-medium leading-[1.4] tracking-[-0.035em] text-slate-900 lg:min-h-[62px]">{item.title}</h4>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">{item.description}</p>
                <p className="mt-8 border-t border-slate-100 pt-5 text-[13px] leading-6 text-slate-500 lg:mt-auto lg:pt-5">{item.checks}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
