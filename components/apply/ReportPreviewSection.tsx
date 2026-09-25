const T = {
  accent: "#004EE0",
  border: "#E1E2E4",
  text: "#171719",
  sub: "#46474C",
  muted: "#878A93",
  faint: "#C2C4C8",
  track: "#EAEBEC",
};

const SIGNAL = { c: "#D17600", label: "개선 여지가 큽니다" };

const sampleProblems = [
  {
    problem: "첫 화면에 제품명과 이미지만 있고 구매 이유가 없습니다",
    why: "광고를 보고 들어온 고객은 3초 안에 '나에게 필요한 이유'를 찾습니다. 지금은 스크롤해야 이유가 나옵니다.",
    direction: "첫 화면 문구를 고객 상황 중심으로 바꾸고, 핵심 효과 1가지를 바로 보여주세요.",
  },
  {
    problem: "후기와 인증 정보가 페이지 맨 아래에만 있습니다",
    why: "가격을 확인하는 시점에 신뢰 근거가 없으면 고객은 이탈합니다.",
    direction: "가격 근처로 대표 후기 2~3개와 인증 마크를 옮기세요.",
  },
];

const sampleItems = [
  { name: "첫 화면 후킹", score: 2, note: "제품 이름만 있고 구매 이유가 없음" },
  { name: "카피 설득력", score: 2, note: "장점 나열 위주, 고객 언어로 재구성 필요" },
  { name: "공신력 근거", score: 1, note: "인증·후기가 페이지 하단에만 위치" },
  { name: "CTA", score: 3, note: "버튼은 명확하나 문구가 일반적" },
];

function itemStatus(score: number) {
  if (score <= 2) return { label: "보완 필요", color: "#E52222", background: "#E5222214" };
  if (score === 3) return { label: "점검 필요", color: "#D17600", background: "#D1760014" };
  return { label: "잘 갖춰짐", color: "#009632", background: "#00963214" };
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-6 sm:p-7" style={{ borderColor: T.border }}>
      <h3 className="text-[12px] font-semibold tracking-[0.04em]" style={{ color: T.muted }}>{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ReportPreviewSection() {
  return (
    <section id="report-preview" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[880px]">
        <div className="text-center">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">REPORT PREVIEW</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.1] tracking-[-0.05em] text-slate-950 sm:text-[40px]">
            실제 진단서는 이렇게 도착합니다.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-7 text-slate-600">
            아래는 예시로 만든 진단서입니다. 실제 점수와 지적 내용은 상세페이지 상태에 따라 매번 다르게 나오며, 신청하시면 이 형식 그대로 결과 페이지가 발급됩니다.
          </p>
        </div>

        <div className="relative mt-10 rounded-[24px] p-3 ring-1 ring-inset ring-[#ececf4] sm:p-5" style={{ backgroundColor: "#F7F7F8" }}>
          <span className="absolute -top-3 left-6 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium tracking-[0.1em] text-white">
            SAMPLE
          </span>

          <div className="rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold tracking-[0.14em]" style={{ color: T.accent }}>상페닥터 진단 리포트</span>
              <span style={{ color: T.faint }}>2026-01-15</span>
            </div>
            <p className="mt-1.5 truncate text-[12px]" style={{ color: T.muted }}>https://example-store.com/products/sample</p>

            <section className="mt-5 rounded-2xl border bg-white p-6 sm:p-7" style={{ borderColor: T.border }}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[48px] font-bold leading-none tracking-[-0.03em]" style={{ color: T.text }}>61</span>
                <span className="text-[14px] font-medium" style={{ color: T.muted }}>/ 100</span>
              </div>
              <span
                className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium"
                style={{ backgroundColor: `${SIGNAL.c}14`, color: SIGNAL.c }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SIGNAL.c }} />
                {SIGNAL.label}
              </span>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: T.track }}>
                <div className="h-full rounded-full" style={{ width: "61%", backgroundColor: SIGNAL.c }} />
              </div>
              <p className="mt-5 text-[14px] leading-7" style={{ color: T.sub }}>
                첫 화면에서 제품의 핵심 가치가 바로 보이지 않아 고객이 이탈하고 있어요. 구매 근거는 있지만 순서가 뒤섞여 있어 설득력이 떨어집니다.
              </p>
            </section>

            <div className="mt-4 space-y-4">
              <Card title="가장 큰 문제">
                <div className="space-y-4">
                  {sampleProblems.map((p, i) => (
                    <article key={p.problem} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: T.track }}>
                      <div className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px] font-bold" style={{ backgroundColor: `${T.accent}14`, color: T.accent }}>{i + 1}</span>
                        <h4 className="text-[14px] font-semibold leading-6" style={{ color: T.text }}>{p.problem}</h4>
                      </div>
                      <dl className="mt-2 space-y-1 pl-[30px] text-[13px] leading-6">
                        <div><dt className="inline" style={{ color: T.muted }}>왜 문제인가 · </dt><dd className="inline" style={{ color: T.sub }}>{p.why}</dd></div>
                        <div><dt className="inline font-medium" style={{ color: T.accent }}>개선 방향 · </dt><dd className="inline" style={{ color: T.text }}>{p.direction}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>
              </Card>

              <Card title="항목별 진단">
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {sampleItems.map((it) => {
                    const status = itemStatus(it.score);
                    return (
                      <div key={it.name}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[13px] font-medium" style={{ color: T.text }}>{it.name}</span>
                          <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ color: status.color, backgroundColor: status.background }}>{status.label}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-5" style={{ color: T.muted }}>{it.note}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <section className="rounded-2xl p-6 text-white sm:p-7" style={{ backgroundColor: T.accent }}>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-white/60">다음 행동</p>
                <p className="mt-2 text-[14px] leading-7">첫 화면 문구와 후기 위치부터 먼저 수정해보세요. 그래도 전환이 안 오르면 부분 리뉴얼을 제안드립니다.</p>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#diagnosis-form" className="inline-flex items-center justify-center rounded-[12px] bg-[#004EE0] px-7 py-4 text-[12px] font-medium text-white transition hover:bg-[#042E7B]">
            내 상세페이지도 진단받기 →
          </a>
        </div>
      </div>
    </section>
  );
}
