import { applyAiEngineDataCount, applyDiagnosisItems } from "@/data/apply";

export function DiagnosisSection() {
  return (
    <section id="diagnosis" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">DIAGNOSIS</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">감이 아니라<br />고객이 멈추는 곳을 봅니다.</h2>
          <p className="mt-5 max-w-[480px] text-[16px] leading-7 text-slate-600">상세페이지 {applyAiEngineDataCount}건을 학습한 AI 진단 엔진이 첫 화면부터 결제 버튼까지, 고객이 망설일 만한 지점을 다섯 가지 기준으로 봅니다.</p>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {applyDiagnosisItems.map((item, index) => (
            <article key={item.title} className="grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:gap-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#004EE0] text-[12px] font-medium text-white">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[22px] font-medium tracking-[-0.035em] text-slate-900">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
