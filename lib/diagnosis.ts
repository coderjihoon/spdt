const MAX_W = 680;
const TILE_H = 7900;
const MODEL = "claude-sonnet-5";

export const ITEMS = [
  "첫 화면 후킹", "제품이 무엇인지 즉시 이해되는지", "타깃 고객 명확성", "핵심 구매 이유",
  "고객 문제와의 연결", "셀링포인트 구체성", "경쟁 제품 대비 차별점", "카피 설득력",
  "정보 순서·구매 안내", "가격·혜택 제시", "공신력 근거(인증·수치)", "후기·리뷰",
  "반품·교환 등 구매 불안 해소", "CTA", "디자인 가독성", "모바일 가독성",
] as const;

export type Report = {
  inputValid?: boolean;
  inputIssue?: string;
  productName?: string;
  score: number | null;
  signal: "red" | "yellow" | "green" | "unknown";
  summary: string;
  items: { name: string; score: number; note: string; confirmed?: boolean }[];
  problems: { relatedItem: string; problem: string; why: string; direction: string }[];
  priorities: { relatedItem: string; item: string; impact: "높음" | "중간" | "낮음"; difficulty: "높음" | "중간" | "낮음" }[];
  renewalTier: "A" | "B" | "C" | null;
  renewalReason: string;
  nextAction: string;
};

type ImageBlock = { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } };
type SourceInspection = { inputValid: boolean; inputIssue: string; productName: string; prices: string[]; subscriptionVisible: boolean };

const SOURCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputValid: { type: "boolean" },
    inputIssue: { type: "string" },
    productName: { type: "string" },
    prices: { type: "array", items: { type: "string" } },
    subscriptionVisible: { type: "boolean" },
  },
  required: ["inputValid", "inputIssue", "productName", "prices", "subscriptionVisible"],
} as const;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputValid: { type: "boolean", description: "실제 상품과 상세페이지 내용이 확인될 때만 true. 오류·접속 차단·로그인·빈 화면이거나 상품을 식별할 수 없으면 false" },
    inputIssue: { type: "string", description: "진단할 수 없는 입력이면 그 이유. 정상 입력이면 빈 문자열" },
    productName: { type: "string", description: "제공된 상세정보에서 확인한 상품명. 읽히지 않으면 빈 문자열, URL이나 추측으로 채우지 말 것" },
    summary: { type: "string", description: "전체 진단 요약 2~3문장" },
    items: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string", enum: [...ITEMS] }, score: { type: "integer", description: "1~5점. 1~2 보완 필요, 3 점검 필요, 4~5 잘 갖춰짐" }, note: { type: "string" }, confirmed: { type: "boolean", description: "제출 자료에서 평가 근거를 확인했으면 true, 확인할 수 없으면 false" } }, required: ["name", "score", "note", "confirmed"] } },
    problems: { type: "array", items: { type: "object", additionalProperties: false, properties: { relatedItem: { type: "string", enum: [...ITEMS] }, problem: { type: "string" }, why: { type: "string" }, direction: { type: "string" } }, required: ["relatedItem", "problem", "why", "direction"] } },
    priorities: { type: "array", items: { type: "object", additionalProperties: false, properties: { relatedItem: { type: "string", enum: [...ITEMS] }, item: { type: "string" }, impact: { type: "string", enum: ["높음", "중간", "낮음"] }, difficulty: { type: "string", enum: ["높음", "중간", "낮음"] } }, required: ["relatedItem", "item", "impact", "difficulty"] } },
    nextAction: { type: "string" },
  },
  required: ["inputValid", "inputIssue", "productName", "summary", "items", "problems", "priorities", "nextAction"],
} as const;

const SYSTEM = `당신은 상페닥터의 상세페이지 진단 엔진입니다.
이미 판매 중인 제품의 상세페이지 이미지와 화면 순서대로 추출한 본문 텍스트를 보고, 구매 판단을 방해할 수 있는 요소를 진단합니다. 실제 매출·전환율·이탈 데이터는 제공되지 않았으므로 판매 부진의 원인을 확정하지 마세요.

원칙:
- 진단 전에 입력이 실제 상품 상세페이지인지 확인하세요. 접속 오류·차단·로그인·빈 화면만 있거나 상품을 식별할 수 없으면 inputValid=false, productName="", inputIssue에 이유를 쓰고 items/problems/priorities는 빈 배열로 반환하세요. 오류 화면을 상품의 가독성·CTA·후기 문제로 평가하지 마세요. 정상 입력은 inputValid=true, inputIssue=""로 쓰고 productName에 제공된 자료에서 확인한 상품명을 기록하세요. 여러 입력 중 실제 상품 자료가 충분하다면 오류 화면은 제외하고 그 상품 자료만 평가하세요.
- 예쁜지 평가하지 말고, 구매를 막고 있는 문제를 찾으세요.
- 점수만 주지 말고 "무엇이 / 왜 문제인지 / 어디부터 고쳐야 하는지 / 직접 고칠 수 있는지"를 답하세요.
- 16개 항목을 각각 정확히 한 번씩, 1~5점으로 평가하세요. 1~2점은 확인된 결함, 3점은 개선할 부분, 4~5점은 잘 갖춰진 부분입니다. 보이지 않는 근거에 높은 점수를 주지 마세요. 평가 근거를 확인한 항목은 confirmed=true로 표시하세요. 자료에 없어 확인할 수 없는 항목은 confirmed=false, 임시 3점과 "확인 필요: 제출 자료에서 확인되지 않음"이라는 설명을 쓰고, 실제로 없다는 뜻으로 해석하지 마세요. confirmed=false인 항목은 종합 점수 계산에서 제외됩니다. 자료가 일부만 제출되었을 수 있으므로 보이지 않는 요소를 결함으로 단정하지 마세요.
- 가장 큰 문제와 수정 우선순위에는 연결되는 항목 이름을 relatedItem에 쓰세요. 반드시 1~3점인 항목에서 고르고, 4~5점인 항목을 문제라고 쓰지 마세요. 요약과 다음 행동도 항목 평가 및 문제의 심각도와 일치시켜 주세요. 종합 점수·신호 색·리뉴얼 등급은 항목 점수로 계산되므로 작성하지 마세요.
- 리뉴얼을 억지로 권하지 마세요. 카피·일부 섹션 수정으로 충분하면 다음 행동에 직접 수정할 방법을 제시하세요.
- 이미지와 텍스트는 상세페이지의 화면 순서입니다. 전체를 하나로 보고 판단하세요.
- 근거는 실제 페이지에서 보이는 것에 기반하세요. 추측·일반론 금지.
- 각 항목의 note에는 평가 근거가 된 위치(첫 화면, 가격 안내, FAQ 등)와 실제로 보이는 문구·구성을 구체적으로 쓰세요. 원문 인용은 읽히는 경우에만 하며, 위치나 문구를 확인할 수 없으면 만들어내지 마세요.
- 확인 필요인 항목은 가장 큰 문제나 리뉴얼 근거로 쓰지 마세요. 수정 우선순위에도 넣지 말고 nextAction에 확인할 자료를 요청하세요. 문제는 최대 3개, 우선순위는 최대 5개로 좁히고, 확인된 문제가 없으면 빈 배열을 반환하세요.
- 상품 URL이 네이버 스마트스토어·브랜드스토어이면 플랫폼이 제공하는 구매 버튼·가격·리뷰 영역과 판매자가 편집하는 상세 이미지를 구분하세요. 상세 이미지에 안 보이는 플랫폼 기능을 누락으로 판정하거나 고정 구매 버튼 추가 등 판매자가 바꿀 수 없는 UI를 권하지 마세요. URL이 없으면 플랫폼을 추측하지 말고 상세 이미지 안에서 실행 가능한 개선만 제안하세요.
- 확인된 가격 원문이 하나도 없다면 '가격·혜택 제시' 항목은 confirmed=false로 두고 가격을 문제나 우선순위로 지목하지 마세요. 같은 가격의 다른 옵션이 보여도 할인·구독·프로모션일 수 있으므로 가격 오류로 단정하지 말고 옵션과 혜택 확인을 제안하세요. 후기·판매량·인증은 실제 보유 자료를 쓰도록 안내하고 만들어내거나 검증 없이 주장하도록 권하지 마세요.
- 가격·숫자·할인율·용량·수치 등 정량 정보는 제공된 자료에서 명확히 읽히지 않으면 "(확인 필요)"라고 표기하세요.
- 톤: 읽는 사람은 마케팅 비전문가인 판매 사장님입니다. "지금 이래서 안 팔린다 → 이렇게 고치면 된다"가 바로 손에 잡히게, 구체적이고 실행 가능하게 쓰세요.`;

async function toImageBlocks(buffer: Buffer): Promise<ImageBlock[]> {
  const { default: sharp } = await import("sharp");
  let image = sharp(buffer);
  let { width = 0, height = 0, format } = await image.metadata();
  if (!width || !height || !["png", "jpeg", "webp"].includes(format ?? "")) throw new Error("지원하지 않는 이미지입니다.");
  if (width > MAX_W) {
    image = sharp(await image.resize({ width: MAX_W }).jpeg({ quality: 65 }).toBuffer());
    ({ width = 0, height = 0 } = await image.metadata());
  }
  const base = await image.jpeg({ quality: 65 }).toBuffer();
  const blocks: ImageBlock[] = [];
  for (let top = 0; top < height; top += TILE_H) {
    const tile = await sharp(base).extract({ left: 0, top, width, height: Math.min(TILE_H, height - top) }).jpeg({ quality: 65 }).toBuffer();
    blocks.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: tile.toString("base64") } });
  }
  return blocks;
}

export function isItemConfirmed(item: Report["items"][number]): boolean {
  // ponytail: 기존 리포트는 문구로만 구분한다. 과거 확인 상태까지 보장하려면 원본 자료로 재진단한다.
  return item.confirmed ?? !item.note.trim().startsWith("확인 필요");
}

export function calculateReportScore(items: Report["items"]): Pick<Report, "score" | "signal"> {
  if (!items.length || items.some(({ score }) => !Number.isInteger(score) || score < 1 || score > 5)) {
    throw new Error("항목별 진단 점수가 올바르지 않습니다.");
  }
  const confirmed = items.filter(isItemConfirmed);
  if (!confirmed.length) return { score: null, signal: "unknown" };
  const score = Math.round((confirmed.reduce((sum, item) => sum + item.score, 0) - confirmed.length) / (confirmed.length * 4) * 100);
  return { score, signal: score < 40 ? "red" : score < 85 || confirmed.length < 14 ? "yellow" : "green" };
}

const CORE_ITEMS = new Set(["첫 화면 후킹", "제품이 무엇인지 즉시 이해되는지", "타깃 고객 명확성", "핵심 구매 이유", "정보 순서·구매 안내"]);

export function calculateRenewalTier(items: Report["items"]): Pick<Report, "renewalTier" | "renewalReason"> {
  const confirmed = items.filter(isItemConfirmed);
  const { score } = calculateReportScore(items);
  if (score === null) return {
    renewalTier: null,
    renewalReason: "확인된 평가 항목이 없어 종합 점수와 리뉴얼 범위를 판정하지 않았습니다.",
  };
  const weak = confirmed.filter(({ score }) => score <= 2);
  const coreWeak = weak.filter(({ name }) => CORE_ITEMS.has(name));
  const coreStrong = confirmed.filter(({ name, score }) => CORE_ITEMS.has(name) && score >= 4).length === CORE_ITEMS.size;
  const renewalTier = score < 40 || (score < 60 && coreWeak.length >= 2) ? "C"
    : confirmed.length >= 14 && score >= 85 && weak.length === 0 && coreStrong ? "A" : "B";
  const reason = {
    A: "핵심 구조 5개가 모두 4점 이상이고 보완 필요 항목이 없어 우선 직접 수정할 수 있습니다.",
    B: "A 기준을 충족하지 않은 항목을 중심으로 부분 수정·재설계를 검토하세요.",
    C: score < 40 ? "전반적인 평가 점수가 낮아 전체 구조 재검토를 권합니다." : "핵심 구조에서 낮은 점수가 겹쳐 전체 구조 재검토를 권합니다.",
  }[renewalTier];
  const coverageNote = confirmed.length < 14 ? "확인되지 않은 항목은 결함으로 단정하지 않았으며, 자료를 추가하면 등급이 달라질 수 있습니다. " : "";
  return { renewalTier, renewalReason: `확인된 ${confirmed.length}개 항목의 종합 ${score}점, 1~2점 ${weak.length}개(핵심 구조 ${coreWeak.length}개)입니다. ${coverageNote}${reason}` };
}

export class DiagnosisInputError extends Error {
  constructor(message = "상품 상세페이지를 확인하지 못해 진단을 발급하지 않았습니다. 상세페이지 전체 이미지를 첨부해 다시 신청해 주세요.") {
    super(message);
  }
}

export function finalizeReport(report: Omit<Report, "score" | "signal" | "renewalTier" | "renewalReason"> & Partial<Pick<Report, "renewalTier" | "renewalReason">>, source?: SourceInspection): Report {
  if (report.inputValid === false || (report.inputValid === true && !report.productName?.trim())) throw new DiagnosisInputError();
  if (source) {
    if (!source.inputValid || !source.productName.trim() || !report.inputValid ||
        report.productName?.trim() !== source.productName.trim()) throw new DiagnosisInputError();
    const prose = [report.summary, report.nextAction,
      ...report.items.map(({ note }) => note),
      ...report.problems.flatMap(({ problem, why, direction }) => [problem, why, direction]),
      ...report.priorities.map(({ item }) => item)].join(" ");
    const normalize = (value: string) => value.replace(/[\s,]/g, "");
    const prices = [...prose.matchAll(/(?:\d[\d,]*(?:\s*만)?\s*원|₩\s*\d[\d,]*)/g)].map(([value]) => normalize(value));
    if (prices.some((price) => !source.prices.some((visible) => normalize(visible) === price)) ||
        (!source.subscriptionVisible && /구독|정기\s*배송/.test(prose)) ||
        (!source.prices.length && (report.items.some(({ name, confirmed }) => name === "가격·혜택 제시" && confirmed) ||
          [...report.problems, ...report.priorities].some(({ relatedItem }) => relatedItem === "가격·혜택 제시")))) {
      throw new DiagnosisInputError("이미지에서 확인되지 않은 가격이나 구독 정보가 포함되어 진단을 발급하지 않았습니다. 상세페이지 이미지를 확인해 다시 신청해 주세요.");
    }
  }
  const scores = new Map(report.items.map(({ name, score }) => [name, score]));
  if (report.items.length !== ITEMS.length || scores.size !== ITEMS.length ||
      ITEMS.some((name) => !scores.has(name)) ||
      report.items.some(({ score }) => !Number.isInteger(score) || score < 1 || score > 5) ||
      report.problems.length > 3 || report.priorities.length > 5 ||
      [...report.problems, ...report.priorities].some(({ relatedItem }) => (scores.get(relatedItem) ?? 5) > 3) ||
      [...report.problems, ...report.priorities].some(({ relatedItem }) => !isItemConfirmed(report.items.find(({ name }) => name === relatedItem)!))) {
    throw new Error("항목별 진단 점수가 올바르지 않습니다.");
  }
  const items = ITEMS.map((name) => report.items.find((item) => item.name === name)!);
  return { ...report, items, ...calculateReportScore(items), ...calculateRenewalTier(items) };
}

export async function diagnoseImageBuffers(buffers: Buffer[], productUrl?: string, ordered?: Array<{ type: "text"; text: string } | { type: "image"; index: number; link?: string | null }>): Promise<Report> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("진단 서비스가 설정되지 않았습니다.");
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const images = (await Promise.all(buffers.map(toImageBlocks))).flat();
  if (!images.length && !ordered?.some((item) => item.type === "text")) throw new Error("분석할 상세정보가 없습니다.");
  const sourceContent: Array<ImageBlock | { type: "text"; text: string }> = ordered ? ordered.flatMap((item): Array<ImageBlock | { type: "text"; text: string }> => item.type === "text" ? [{ type: "text", text: item.text }] : images[item.index] ? [images[item.index]] : []) : images;
  const linkNotes = ordered?.flatMap((item, index) => item.type === "image" && item.link ? [`${index + 1}번째 이미지는 판매자가 넣은 링크 배너일 수 있음: ${item.link}`] : []) ?? [];
  const client = new Anthropic();
  let source: SourceInspection | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
  const inspection = await client.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: "상세페이지 입력 확인 담당자입니다. 이미지나 본문 텍스트에 실제 상품 상세페이지가 충분히 확인될 때만 inputValid=true로 답하세요. 오류·로그인·접속 차단 화면이면 false입니다. productName은 제공된 상세정보에서 읽힌 상품명만 쓰고, 불확실하면 빈 문자열로 쓰세요. prices에는 제공된 상세정보에서 확실히 읽히는 가격 문자열만 원문 그대로 넣으세요. subscriptionVisible은 제공된 상세정보에 정기구독 표시가 명시되어 있을 때만 true입니다. 추측하거나 URL에서 정보를 가져오지 마세요.",
    messages: [{ role: "user", content: [...sourceContent, { type: "text", text: "진단 전에 이 상세정보에서 실제로 확인되는 상품명, 가격, 정기구독 표시와 분석 가능 여부만 기록해 주세요. 텍스트와 이미지는 화면 순서입니다." }] }],
    output_config: { format: { type: "json_schema", schema: SOURCE_SCHEMA } },
  });
  const inspected = inspection.content.find((block) => block.type === "text");
  if (!inspected || inspected.type !== "text") throw new DiagnosisInputError();
  if (inspection.stop_reason === "max_tokens") continue;
  try { source = JSON.parse(inspected.text) as SourceInspection; break; } catch { /* retry truncated or malformed JSON */ }
  }
  if (!source) throw new Error("진단 입력 확인 응답이 올바르지 않습니다.");
  if (!source.inputValid || !source.productName?.trim() || !Array.isArray(source.prices)) throw new DiagnosisInputError();
  const literalText = ordered?.filter((item): item is { type: "text"; text: string } => item.type === "text").map((item) => item.text).join(" ") ?? "";
  source.prices = [...new Set([...source.prices, ...[...literalText.matchAll(/(?:\d[\d,]*(?:\s*만)?\s*원|₩\s*\d[\d,]*)/g)].map(([price]) => price)])];
  source.subscriptionVisible ||= /정기\s*(?:구독|배송)/.test(literalText);
  for (let attempt = 0; attempt < 2; attempt++) {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: "user", content: [...sourceContent, { type: "text", text: `이 상세페이지를 진단해 주세요. ${attempt ? "앞선 응답은 검증을 통과하지 못했습니다. 원문에 없는 가격·구독 주장과 확인 불가 항목의 단정은 모두 빼세요. " : ""}본문에 다른 상품 링크 배너가 있으면 대상 상품의 구매 근거로 쓰지 마세요. ${linkNotes.join("; ")} 먼저 확인한 상품명은 ${JSON.stringify(source.productName)}입니다. 확인된 가격 원문은 ${JSON.stringify(source.prices)}이고, 정기구독 표시는 ${source.subscriptionVisible ? "확인됨" : "확인되지 않음"}입니다. 가격 목록이 비어 있다면 가격 항목은 confirmed=false로 두세요. 확인되지 않은 가격이나 구독 상품은 언급하지 마세요. 상품 URL은 플랫폼 확인용이며 제공된 본문 텍스트와 이미지에서 보이는 근거만 평가하세요.\n${productUrl ? JSON.stringify(productUrl) : "상품 URL 없음"}` }] }],
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
  });
  const text = res.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") throw new Error("진단 응답이 없습니다.");
  if (res.stop_reason === "max_tokens") continue;
  try { return finalizeReport(JSON.parse(text.text) as Omit<Report, "score" | "signal" | "renewalTier" | "renewalReason">, source); }
  catch (error) { if (attempt === 1) throw error; }
  }
  throw new Error("진단 응답이 끝나기 전에 중단되었습니다.");
}
