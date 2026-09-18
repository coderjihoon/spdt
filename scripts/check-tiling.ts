/**
 * toImageBlocks() 비용 점검 스크립트 (API 호출 없음)
 *
 * 실제 이미지(myodam_test)로 전처리만 돌려서, 설정별로
 *  - 만들어지는 조각(블록) 수
 *  - 우리가 보내는 픽셀 (전처리 후)
 *  - Claude Sonnet 5가 실제로 "보는" 픽셀 (2576px 장변 상한 적용 후)  ← 토큰의 실체
 *  - 추정 이미지 토큰 (= 유효 픽셀 / 750)
 * 를 before/after로 비교한다.
 *
 * 실행:  pnpm tsx scripts/check-tiling.ts [이미지폴더]   (기본 myodam_test)
 *
 * ponytail: sharp로 실제 리사이즈까지 해서 조각 치수를 뽑고, Claude의 다운스케일은
 *           문서화된 규칙(장변 2576px, ~3.588MP)으로 계산만 한다. 토큰은 area/750 근사.
 */
import sharp from "sharp";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

// Claude Sonnet 5 비전 상한 (claude-api 스킬 기준)
const CLAUDE_LONG_EDGE = 2576; // 장변 이 값 초과 시 다운스케일
const CLAUDE_MAX_MP = 3_588_000; // ~3.588MP (≈4784토큰) 초과 시 추가 다운스케일
const TOKENS_PER_PX = 1 / 750; // 이미지 토큰 근사식
const BEFORE_MAX_W = 1200;
const BEFORE_TILE_H = 7000;
const OPERATING_MAX_W = 680;
const OPERATING_TILE_H = 7900;

const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

// scripts/diagnose.ts의 toImageBlocks와 동일 로직. 치수만 뽑으므로 base64는 생략.
async function tiles(p: string, MAX_W: number, TILE_H: number): Promise<{ w: number; h: number }[]> {
  let img = sharp(readFileSync(p));
  let { width = 0, height = 0 } = await img.metadata();
  if (width > MAX_W) {
    const buf = await img.resize({ width: MAX_W }).png().toBuffer();
    img = sharp(buf);
    ({ width = 0, height = 0 } = await img.metadata());
  }
  const out: { w: number; h: number }[] = [];
  for (let top = 0; top < height; top += TILE_H) {
    out.push({ w: width, h: Math.min(TILE_H, height - top) });
  }
  return out;
}

// Claude가 실제로 보는 치수: 장변 2576px + 3.588MP 상한 적용
function effective(w: number, h: number): { w: number; h: number } {
  let s = Math.min(1, CLAUDE_LONG_EDGE / Math.max(w, h));
  if (w * h * s * s > CLAUDE_MAX_MP) s = Math.sqrt(CLAUDE_MAX_MP / (w * h));
  return { w: Math.round(w * s), h: Math.round(h * s) };
}

async function run(dir: string, MAX_W: number, TILE_H: number, label: string) {
  const files = readdirSync(dir).filter((f) => ALLOWED.has(extname(f).toLowerCase())).sort();
  let blocks = 0, sentPx = 0, seenPx = 0, tokens = 0;
  const rows: string[] = [];
  for (const f of files) {
    const ts = await tiles(join(dir, f), MAX_W, TILE_H);
    let fSeen = 0, fTok = 0;
    for (const t of ts) {
      const e = effective(t.w, t.h);
      blocks++; sentPx += t.w * t.h; seenPx += e.w * e.h;
      fSeen += e.w * e.h; tokens += e.w * e.h * TOKENS_PER_PX;
      fTok += e.w * e.h * TOKENS_PER_PX;
    }
    const t0 = ts[0];
    const e0 = effective(t0.w, t0.h);
    rows.push(
      `  ${f.padEnd(9)} ${ts.length}조각  전처리 ${t0.w}x${t0.h}` +
        `  → Claude ${e0.w}x${e0.h}${ts.length === 1 && e0.h < t0.h ? " (다운스케일됨)" : ""}` +
        `  ~${Math.round(fTok)}tok`,
    );
  }
  console.log(`\n=== ${label}  (MAX_W=${MAX_W}, TILE_H=${TILE_H}) ===`);
  rows.forEach((r) => console.log(r));
  console.log(
    `  ─ 합계: ${blocks}조각  |  보낸 픽셀 ${(sentPx / 1e6).toFixed(1)}MP  |  ` +
      `Claude가 본 픽셀 ${(seenPx / 1e6).toFixed(1)}MP  |  추정 ~${Math.round(tokens).toLocaleString()} 이미지토큰`,
  );
  return { blocks, sentPx, seenPx, tokens };
}

(async () => {
  const dir = process.argv[2] ?? "myodam_test";
  const base = await run(dir, BEFORE_MAX_W, BEFORE_TILE_H, "BEFORE (최적화 전 기준)");
  const current = await run(dir, OPERATING_MAX_W, OPERATING_TILE_H, "AFTER (현재 운영 설정)");

  const pct = (a: number, b: number) => (((a - b) / a) * 100).toFixed(1);
  console.log("\n=== 절감률 (토큰 기준) ===");
  console.log(`  현재 운영 설정: ${pct(base.tokens, current.tokens)}% 절감   (보낸 픽셀 ${pct(base.sentPx, current.sentPx)}% 감소)`);
})();
