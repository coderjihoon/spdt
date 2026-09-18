/**
 * CLI 진단 도구. 웹 API와 동일한 lib/diagnosis 엔진을 사용한다.
 * 사용: ANTHROPIC_API_KEY=... pnpm diagnose image.png --url https://... --email a@b.com
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { diagnoseImageBuffers, type Report } from "@/lib/diagnosis";

const LEDGER = "data/diagnosed.json";
type Lead = { date: string; url: string; email: string };

const today = () => new Date().toISOString().slice(0, 10);
const loadLedger = (): Lead[] => (existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : []);
const diagnosedToday = (ledger: Lead[], url: string, day: string) => ledger.some((lead) => lead.url === url && lead.date === day);
const usage = "사용법: pnpm diagnose <이미지경로...> --url <상세페이지주소> --email <이메일>";

function parseArgs(argv: string[]) {
  const images: string[] = [];
  const options: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--url" || argv[i] === "--email") options[argv[i].slice(2)] = argv[++i] ?? "";
    else images.push(argv[i]);
  }
  return { images, url: options.url ?? "", email: options.email ?? "" };
}

function render(report: Report) {
  const dot = { red: "🔴", yellow: "🟡", green: "🟢" }[report.signal];
  console.log(`상페닥터 진단 리포트 ${dot}  종합 ${report.score}점\n`);
  console.log(report.summary);
  report.problems.forEach((problem, index) => console.log(`\n${index + 1}. ${problem.problem}\n   왜: ${problem.why}\n   개선: ${problem.direction}`));
  console.log(`\n👉 다음 행동: ${report.nextAction}`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === "--selftest") {
    const ledger: Lead[] = [{ date: "2026-09-16", url: "https://a.com", email: "x@y.com" }];
    if (!diagnosedToday(ledger, "https://a.com", "2026-09-16")) throw new Error("중복 탐지 실패");
    if (diagnosedToday(ledger, "https://a.com", "2026-09-17")) throw new Error("날짜 검사 실패");
    console.log("selftest OK");
    return;
  }
  const { images, url, email } = parseArgs(argv);
  if (!images.length || !url || !email.includes("@")) throw new Error(usage);
  const ledger = loadLedger();
  if (diagnosedToday(ledger, url, today())) throw new Error("이 URL은 오늘 이미 진단했습니다.");
  const report = await diagnoseImageBuffers(images.map((path) => readFileSync(path)));
  render(report);
  ledger.push({ date: today(), url, email });
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
  const slug = (url.split("?")[0].split("/").filter(Boolean).pop() || basename(images[0]).replace(/\.[^.]+$/, "")).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60) || "report";
  mkdirSync("data/reports", { recursive: true });
  writeFileSync(`data/reports/${slug}.json`, JSON.stringify({ url, generatedAt: today(), ...report }, null, 2));
  console.log(`\n🌐 웹 리포트: http://localhost:3000/report/${slug}`);
}

main().catch((error: unknown) => {
  console.error("실패:", error instanceof Error ? error.message : "알 수 없는 오류");
  process.exit(1);
});
