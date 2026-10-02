import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";

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
  score: number;
  signal: "red" | "yellow" | "green";
  summary: string;
  items: { name: string; score: number; note: string }[];
  problems: { relatedItem: string; problem: string; why: string; direction: string }[];
  priorities: { relatedItem: string; item: string; impact: "높음" | "중간" | "낮음"; difficulty: "높음" | "중간" | "낮음" }[];
  renewalTier: "A" | "B" | "C";
  renewalReason: string;
  nextAction: string;
};

type ImageBlock = { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } };

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "전체 진단 요약 2~3문장" },
    items: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string", enum: [...ITEMS] }, score: { type: "integer", description: "1~5점. 1~2 보완 필요, 3 점검 필요, 4~5 잘 갖춰짐" }, note: { type: "string" } }, required: ["name", "score", "note"] } },
    problems: { type: "array", items: { type: "object", additionalProperties: false, properties: { relatedItem: { type: "string", enum: [...ITEMS] }, problem: { type: "string" }, why: { type: "string" }, direction: { type: "string" } }, required: ["relatedItem", "problem", "why", "direction"] } },
    priorities: { type: "array", items: { type: "object", additionalProperties: false, properties: { relatedItem: { type: "string", enum: [...ITEMS] }, item: { type: "string" }, impact: { type: "string", enum: ["높음", "중간", "낮음"] }, difficulty: { type: "string", enum: ["높음", "중간", "낮음"] } }, required: ["relatedItem", "item", "impact", "difficulty"] } },
    renewalTier: { type: "string", enum: ["A", "B", "C"] },
    renewalReason: { type: "string" },
    nextAction: { type: "string" },
  },
  required: ["summary", "items", "problems", "priorities", "renewalTier", "renewalReason", "nextAction"],
} as const;

const SYSTEM = `당신은 상페닥터의 상세페이지 진단 엔진입니다.
이미 판매 중인 제품의 상세페이지 스크린샷을 보고, "왜 안 팔리는지"를 진단합니다.

원칙:
- 예쁜지 평가하지 말고, 구매를 막고 있는 문제를 찾으세요.
- 점수만 주지 말고 "무엇이 / 왜 문제인지 / 어디부터 고쳐야 하는지 / 직접 고칠 수 있는지"를 답하세요.
- 16개 항목을 각각 정확히 한 번씩, 1~5점으로 평가하세요. 1~2점은 구매를 막는 결함, 3점은 개선할 부분, 4~5점은 잘 갖춰진 부분입니다. 보이지 않는 근거에 높은 점수를 주지 마세요.
- 가장 큰 문제와 수정 우선순위에는 연결되는 항목 이름을 relatedItem에 쓰세요. 반드시 1~3점인 항목에서 고르고, 4~5점인 항목을 문제라고 쓰지 마세요. 요약과 리뉴얼 판정도 항목 평가 및 문제의 심각도와 일치시켜 주세요. 종합 점수와 신호 색은 항목 점수로 계산되므로 작성하지 마세요.
- 리뉴얼을 억지로 권하지 마세요. 카피·일부 섹션 수정으로 충분하면 A(직접 수정)로 판정하세요.
- 여러 이미지는 한 상세페이지를 위→아래로 자른 것입니다. 전체를 하나로 보고 판단하세요.
- 근거는 실제 페이지에서 보이는 것에 기반하세요. 추측·일반론 금지.
- 가격·숫자·할인율·용량·수치 등 정량 정보는 이미지에서 명확히 읽히지 않으면 "(확인 필요)"라고 표기하세요.
- 톤: 읽는 사람은 마케팅 비전문가인 판매 사장님입니다. "지금 이래서 안 팔린다 → 이렇게 고치면 된다"가 바로 손에 잡히게, 구체적이고 실행 가능하게 쓰세요.`;

async function toImageBlocks(buffer: Buffer): Promise<ImageBlock[]> {
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

export function finalizeReport(report: Omit<Report, "score" | "signal">): Report {
  const scores = new Map(report.items.map(({ name, score }) => [name, score]));
  if (report.items.length !== ITEMS.length || scores.size !== ITEMS.length ||
      ITEMS.some((name) => !scores.has(name)) ||
      report.items.some(({ score }) => !Number.isInteger(score) || score < 1 || score > 5) ||
      [...report.problems, ...report.priorities].some(({ relatedItem }) => (scores.get(relatedItem) ?? 5) > 3)) {
    throw new Error("항목별 진단 점수가 올바르지 않습니다.");
  }
  const score = Math.round((report.items.reduce((sum, item) => sum + item.score, 0) - ITEMS.length) / (ITEMS.length * 4) * 100);
  return { ...report, score, signal: score < 40 ? "red" : score < 70 ? "yellow" : "green" };
}

export async function diagnoseImageBuffers(buffers: Buffer[]): Promise<Report> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("진단 서비스가 설정되지 않았습니다.");
  const images = (await Promise.all(buffers.map(toImageBlocks))).flat();
  if (!images.length) throw new Error("분석할 이미지가 없습니다.");
  const client = new Anthropic();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: "user", content: [...images, { type: "text", text: "이 상세페이지를 진단해 주세요." }] }],
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
  });
  const text = res.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") throw new Error("진단 응답이 없습니다.");
  return finalizeReport(JSON.parse(text.text) as Omit<Report, "score" | "signal">);
}
