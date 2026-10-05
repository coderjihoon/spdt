import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import Image from "next/image";
import { calculateRenewalTier, calculateReportScore, isItemConfirmed, type Report } from "@/lib/diagnosis";
import { supabaseAdmin } from "@/lib/supabase";
import { ConsultButton } from "@/components/report/ConsultButton";

type Item = { name: string; score: number; note: string };
type Problem = { problem: string; why: string; direction: string };
type Priority = { item: string; impact: string; difficulty: string };
type DisplayReport = Report & { url?: string; generatedAt?: string; imageUrls: string[] };

/* Wanted Montage(WDS) 토큰 + 상페닥터 브랜드 인디고 */
const T = {
  accent: "#004EE0",
  pageBg: "#F7F7F8", // coolNeutral 99
  border: "#E1E2E4", // line.solid.normal (coolNeutral 96)
  text: "#171719", // label.normal (coolNeutral 10)
  sub: "#46474C", // coolNeutral 30
  muted: "#878A93", // coolNeutral 60
  faint: "#C2C4C8", // coolNeutral 90
  shadow: "0px 1px 2px -1px rgba(23,23,23,0.10)", // elevation.shadow.xsmall
  track: "#EAEBEC", // line.solid.neutral (coolNeutral 97)
};

const SIGNAL = {
  unknown: { c: "#46474C", label: "자료 확인이 필요합니다" },
  red: { c: "#E52222", label: "구매를 막는 문제가 많습니다" }, // accent.fg.red
  yellow: { c: "#D17600", label: "개선 여지가 큽니다" }, // accent.fg.orange
  green: { c: "#009632", label: "전반적으로 양호합니다" }, // accent.fg.green
} as const;

const TIER = {
  A: { label: "직접 수정 가능", desc: "전체 리뉴얼 없이 카피·일부 섹션 수정으로 개선 가능" },
  B: { label: "부분 리뉴얼 권장", desc: "전체 구조는 유지, 핵심 구간·일부 섹션 재설계 필요" },
  C: { label: "전체 리뉴얼 검토 권장", desc: "여러 핵심 구간을 함께 다시 설계할 필요가 있는지 검토" },
} as const;

const LEVEL: Record<string, { c: string; bg: string }> = {
  높음: { c: "#E52222", bg: "#E5222214" },
  중간: { c: "#D17600", bg: "#D1760014" },
  낮음: { c: "#878A93", bg: "#878A9314" },
};

function itemStatus(score: number) {
  if (score <= 2) return { label: "보완 필요", color: "#E52222", background: "#E5222214" };
  if (score === 3) return { label: "점검 필요", color: "#D17600", background: "#D1760014" };
  return { label: "잘 갖춰짐", color: "#009632", background: "#00963214" };
}

async function loadLocalReport(slug: string): Promise<DisplayReport | null> {
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return null;
  try {
    const report = JSON.parse(await readFile(join(process.cwd(), "data", "reports", `${slug}.json`), "utf8")) as Report & { invalidated?: boolean };
    if (report.invalidated) return null;
    return { ...report, imageUrls: [] };
  } catch {
    return null;
  }
}

async function loadReport(slug: string): Promise<DisplayReport | null> {
  // 신청 결과는 UUID 토큰, CLI에서 저장한 파일은 별도 이름으로 조회한다.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)) return loadLocalReport(slug);
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("diagnoses")
      .select("product_url, completed_at, input_paths, report")
      .eq("access_token", slug)
      .eq("status", "complete")
      .maybeSingle();
    if (error) throw error;
    if (!data?.report) return null;
    if ((data.report as Report).inputValid === false) return null;
    const paths = Array.isArray(data.input_paths) ? data.input_paths : [];
    const signed = await Promise.all(paths.map(async (path) => {
      const { data: signedUrl } = await supabase.storage.from("diagnosis-inputs").createSignedUrl(path, 60 * 60 * 24 * 7);
      return signedUrl?.signedUrl;
    }));
    return {
      ...(data.report as Report),
      url: data.product_url ?? undefined,
      generatedAt: data.completed_at?.slice(0, 10),
      imageUrls: signed.filter((u): u is string => Boolean(u)),
    };
  } catch (error) {
    console.error("Diagnosis report lookup failed", error);
    return null;
  }
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border bg-white p-7 sm:p-8 ${className}`}
      style={{ borderColor: T.border, boxShadow: T.shadow }}
    >
      <h2 className="text-[13px] font-semibold tracking-[0.04em]" style={{ color: T.muted }}>{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stored = await loadReport(slug);
  if (!stored) notFound();
  const r = { ...stored, ...calculateReportScore(stored.items), ...calculateRenewalTier(stored.items) };
  const sig = SIGNAL[r.signal] ?? SIGNAL.yellow;
  const tier = r.renewalTier ? TIER[r.renewalTier] : null;
  const confirmedItems = r.items.filter(isItemConfirmed);
  const itemSum = confirmedItems.reduce((sum, item) => sum + item.score, 0);
  const consult = { code: slug.slice(0, 6).toUpperCase(), productUrl: r.url, imageUrls: r.imageUrls };

  return (
    <main className="min-h-screen" style={{ backgroundColor: T.pageBg }}>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white px-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4">
          <a href="/" aria-label="상페닥터 홈" className="inline-flex items-center">
            <Image src="/logo%20final2.png" alt="상페닥터" width={1154} height={339} className="h-12 w-auto" priority />
          </a>
          <ConsultButton {...consult} header />
        </div>
      </header>
      <div className="mx-auto max-w-[760px] px-5 py-14 sm:py-20">
        {/* 헤더 */}
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold tracking-[0.14em]" style={{ color: T.accent }}>상페닥터 진단 리포트</span>
          {r.generatedAt && <span style={{ color: T.faint }}>{r.generatedAt}</span>}
        </div>
        {r.url && (
          <a href={r.url} target="_blank" rel="noreferrer" className="mt-1.5 block truncate text-[12px] hover:underline" style={{ color: T.muted }}>
            {r.url}
          </a>
        )}
        {r.productName && <p className="mt-3 text-[15px] font-semibold" style={{ color: T.text }}>분석한 상품 · {r.productName}</p>}

        {/* 점수 히어로 */}
        <section className="mt-5 rounded-2xl border bg-white p-7 sm:p-9" style={{ borderColor: T.border, boxShadow: T.shadow }}>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[56px] font-bold leading-none tracking-[-0.03em]" style={{ color: T.text }}>{r.score ?? "—"}</span>
            {r.score !== null && <span className="text-[15px] font-medium" style={{ color: T.muted }}>/ 100</span>}
          </div>
          <span
            className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium"
            style={{ backgroundColor: `${sig.c}14`, color: sig.c }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sig.c }} />
            {sig.label}
          </span>
          {/* 점수 게이지 */}
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: T.track }}>
            <div className="h-full rounded-full" style={{ width: `${r.score ?? 0}%`, backgroundColor: sig.c }} />
          </div>
          <p className="mt-3 text-[12px] leading-6" style={{ color: T.sub }}>확인된 {confirmedItems.length}개 / 전체 {r.items.length}개 항목의 평가입니다. 확인이 필요한 항목은 점수에서 제외하며, 실제 구매 전환율을 뜻하지 않습니다.</p>
          <details className="mt-3 text-[12px] leading-6" style={{ color: T.sub }}>
            <summary className="cursor-pointer rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">점수는 어떻게 계산하나요?</summary>
            <div className="mt-2 space-y-1">
              <p>항목별 1점은 0점, 3점은 50점, 5점은 100점으로 환산합니다. 확인된 항목을 같은 비중으로 평균 내고 반올림합니다.</p>
              {r.score !== null && <p>이 진단서: (항목 점수 합계 {itemSum} − 평가 항목 {confirmedItems.length}) ÷ ({confirmedItems.length} × 4) × 100 = {r.score}점.</p>}
              <p>확인된 항목이 하나라도 있으면 점수를 표시합니다. 0~39점은 빨간 신호, 40~84점은 노란 신호입니다. 초록 신호는 85점 이상이고 16개 중 14개 이상 확인됐을 때만 표시합니다.</p>
              <p>이미지에서 확인한 정보와 구성에 대한 평가이며, 점수가 매출이나 개선 효과를 보장하지는 않습니다.</p>
            </div>
          </details>
          <p className="mt-6 text-[15px] leading-8" style={{ color: T.sub }}>{r.summary}</p>
        </section>

        <div className="mt-4 space-y-4">
          {/* 가장 큰 문제 */}
          <Card title="가장 큰 문제">
            <div className="space-y-5">
              {!r.problems.length && <p className="text-[14px] leading-7" style={{ color: T.sub }}>제출 자료에서 우선 수정할 뚜렷한 문제는 확인되지 않았습니다. 항목별 확인 사항을 점검해 주세요.</p>}
              {r.problems.map((p, i) => (
                <article key={i} className="border-b pb-5 last:border-0 last:pb-0" style={{ borderColor: T.track }}>
                  <div className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px] font-bold" style={{ backgroundColor: `${T.accent}14`, color: T.accent }}>{i + 1}</span>
                    <h3 className="text-[15px] font-semibold leading-6" style={{ color: T.text }}>{p.problem}</h3>
                  </div>
                  <dl className="mt-2.5 space-y-1.5 pl-[30px] text-[14px] leading-7">
                    {p.relatedItem && <div className="text-[12px]" style={{ color: T.sub }}>관련 항목 · <a href={`#item-${encodeURIComponent(p.relatedItem)}`} className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">{p.relatedItem} 평가 보기</a></div>}
                    <div><dt className="inline" style={{ color: T.muted }}>왜 문제인가 · </dt><dd className="inline" style={{ color: T.sub }}>{p.why}</dd></div>
                    <div><dt className="inline font-medium" style={{ color: T.accent }}>개선 방향 · </dt><dd className="inline" style={{ color: T.text }}>{p.direction}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </Card>

          {/* 수정 우선순위 */}
          <Card title="수정 우선순위">
            <div>
              {!r.priorities.length && <p className="text-[14px] leading-7" style={{ color: T.sub }}>현재 자료에서 권장할 우선 수정 사항이 없습니다.</p>}
              {r.priorities.map((p, i) => {
                const lv = LEVEL[p.impact] ?? LEVEL.낮음;
                return (
                  <div key={i} className="flex flex-wrap items-center gap-3 border-b py-3 first:pt-0 last:border-0 last:pb-0" style={{ borderColor: T.track }}>
                    <span className="w-7 text-[12px] font-bold" style={{ color: T.faint }}>{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1 basis-[calc(100%-40px)] text-[14px] sm:basis-0" style={{ color: T.sub }}>
                      <p>{p.item}</p>
                      {p.relatedItem && <a href={`#item-${encodeURIComponent(p.relatedItem)}`} className="mt-1 inline-block text-[12px] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">{p.relatedItem} 평가 보기</a>}
                    </div>
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: lv.bg, color: lv.c }}>영향 {p.impact}</span>
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `${T.muted}14`, color: T.sub }}>난이도 {p.difficulty}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 16개 항목 */}
          <Card title="항목별 진단">
            <p className="mb-5 text-[12px] leading-6" style={{ color: T.sub }}>1~2점 보완 필요 · 3점 점검 필요 · 4~5점 잘 갖춰짐. 확인 필요 항목은 채점하지 않습니다.</p>
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {r.items.map((it) => {
                const status = isItemConfirmed(it) ? itemStatus(it.score) : { label: "확인 필요", color: T.sub, background: T.track };
                return (
                  <div key={it.name} id={`item-${it.name}`} className="scroll-mt-28">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-medium" style={{ color: T.text }}>{it.name}</span>
                      <span className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ color: status.color, backgroundColor: status.background }}>{isItemConfirmed(it) && `${it.score}/5 · `}{status.label}</span>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-6" style={{ color: T.sub }}>{it.note}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 리뉴얼 판정 */}
          <Card title="리뉴얼 판정">
            {r.renewalTier === null ? <p className="text-[14px] leading-7" style={{ color: T.sub }}>{r.renewalReason}</p> : (
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[19px] font-bold text-white" style={{ backgroundColor: T.accent }}>{r.renewalTier}</span>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: T.text }}>{tier?.label}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: T.muted }}>{tier?.desc}</p>
                <p className="mt-3 text-[14px] leading-7" style={{ color: T.sub }}>{r.renewalReason}</p>
              </div>
            </div>
            )}
            <details className="mt-4 text-[12px] leading-6" style={{ color: T.sub }}>
              <summary className="cursor-pointer rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]">A·B·C는 어떻게 정하나요?</summary>
              <p className="mt-2">확인된 항목의 점수로 판정합니다. A: 14개 이상 평가, 85점 이상, 1~2점 항목이 없고 핵심 구조 5개가 모두 4점 이상. C: 40점 미만이거나, 60점 미만이면서 핵심 구조의 1~2점 항목이 2개 이상. 나머지는 B입니다. 핵심 구조는 첫 화면, 제품 이해, 타깃, 구매 이유, 정보 순서 5개 항목입니다. 확인되지 않은 항목은 결함으로 보지 않으며, 자료가 추가되면 점수와 등급이 달라질 수 있습니다.</p>
            </details>
          </Card>

          {/* 다음 행동 */}
          <section className="rounded-2xl p-7 text-white sm:p-8" style={{ backgroundColor: T.accent }}>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-white/60">다음 행동</p>
            <p className="mt-2.5 text-[15px] leading-8">{r.nextAction}</p>
            <ConsultButton {...consult} />
          </section>
        </div>

        <p className="mt-8 text-center text-[11px]" style={{ color: T.faint }}>본 진단은 상세페이지 이미지를 기반으로 자동 생성되었습니다.</p>
      </div>
    </main>
  );
}
