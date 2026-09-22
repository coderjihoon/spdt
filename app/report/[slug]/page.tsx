import { notFound } from "next/navigation";
import type { Report } from "@/lib/diagnosis";
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
  red: { c: "#E52222", label: "구매를 막는 문제가 많습니다" }, // accent.fg.red
  yellow: { c: "#D17600", label: "개선 여지가 큽니다" }, // accent.fg.orange
  green: { c: "#009632", label: "전반적으로 양호합니다" }, // accent.fg.green
} as const;

const TIER = {
  A: { label: "직접 수정 가능", desc: "전체 리뉴얼 없이 카피·일부 섹션 수정으로 개선 가능" },
  B: { label: "부분 리뉴얼 권장", desc: "전체 구조는 유지, 핵심 구간·일부 섹션 재설계 필요" },
  C: { label: "전체 리뉴얼 권장", desc: "현재 구조가 구매 흐름과 맞지 않아 다시 설계하는 편이 효율적" },
} as const;

const LEVEL: Record<string, { c: string; bg: string }> = {
  높음: { c: "#E52222", bg: "#E5222214" },
  중간: { c: "#D17600", bg: "#D1760014" },
  낮음: { c: "#878A93", bg: "#878A9314" },
};

async function loadReport(slug: string): Promise<DisplayReport | null> {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("diagnoses")
      .select("product_url, completed_at, input_paths, report")
      .eq("access_token", slug)
      .eq("status", "complete")
      .maybeSingle();
    if (error || !data?.report) return null;
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
  } catch {
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
  const r = await loadReport(slug);
  if (!r) notFound();
  const sig = SIGNAL[r.signal] ?? SIGNAL.yellow;
  const tier = TIER[r.renewalTier] ?? TIER.B;

  return (
    <main className="min-h-screen" style={{ backgroundColor: T.pageBg }}>
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

        {/* 점수 히어로 */}
        <section className="mt-5 rounded-2xl border bg-white p-7 sm:p-9" style={{ borderColor: T.border, boxShadow: T.shadow }}>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[56px] font-bold leading-none tracking-[-0.03em]" style={{ color: T.text }}>{r.score}</span>
            <span className="text-[15px] font-medium" style={{ color: T.muted }}>/ 100</span>
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
            <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: sig.c }} />
          </div>
          <p className="mt-6 text-[15px] leading-8" style={{ color: T.sub }}>{r.summary}</p>
        </section>

        <div className="mt-4 space-y-4">
          {/* 가장 큰 문제 */}
          <Card title="가장 큰 문제">
            <div className="space-y-5">
              {r.problems.map((p, i) => (
                <article key={i} className="border-b pb-5 last:border-0 last:pb-0" style={{ borderColor: T.track }}>
                  <div className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px] font-bold" style={{ backgroundColor: `${T.accent}14`, color: T.accent }}>{i + 1}</span>
                    <h3 className="text-[15px] font-semibold leading-6" style={{ color: T.text }}>{p.problem}</h3>
                  </div>
                  <dl className="mt-2.5 space-y-1.5 pl-[30px] text-[14px] leading-7">
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
              {r.priorities.map((p, i) => {
                const lv = LEVEL[p.impact] ?? LEVEL.낮음;
                return (
                  <div key={i} className="flex items-center gap-3 border-b py-3 first:pt-0 last:border-0 last:pb-0" style={{ borderColor: T.track }}>
                    <span className="w-7 text-[12px] font-bold" style={{ color: T.faint }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[14px]" style={{ color: T.sub }}>{p.item}</span>
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: lv.bg, color: lv.c }}>영향 {p.impact}</span>
                    <span className="hidden rounded-md px-2 py-0.5 text-[11px] font-medium sm:inline" style={{ backgroundColor: `${T.muted}14`, color: T.muted }}>난이도 {p.difficulty}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 16개 항목 */}
          <Card title="항목별 진단">
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {r.items.map((it) => (
                <div key={it.name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium" style={{ color: T.text }}>{it.name}</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <span key={n} className="h-1 w-3.5 rounded-full" style={{ backgroundColor: n < it.score ? T.accent : T.track }} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-6" style={{ color: T.muted }}>{it.note}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 리뉴얼 판정 */}
          <Card title="리뉴얼 판정">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[19px] font-bold text-white" style={{ backgroundColor: T.accent }}>{r.renewalTier}</span>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: T.text }}>{tier.label}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: T.muted }}>{tier.desc}</p>
                <p className="mt-3 text-[14px] leading-7" style={{ color: T.sub }}>{r.renewalReason}</p>
              </div>
            </div>
          </Card>

          {/* 다음 행동 */}
          <section className="rounded-2xl p-7 text-white sm:p-8" style={{ backgroundColor: T.accent }}>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-white/60">다음 행동</p>
            <p className="mt-2.5 text-[15px] leading-8">{r.nextAction}</p>
            <ConsultButton
              code={slug.slice(0, 6).toUpperCase()}
              reportUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://spdt.studio"}/report/${slug}`}
              productUrl={r.url}
              imageUrls={r.imageUrls}
            />
          </section>
        </div>

        <p className="mt-8 text-center text-[11px]" style={{ color: T.faint }}>본 진단은 상세페이지 이미지를 기반으로 자동 생성되었습니다.</p>
      </div>
    </main>
  );
}
