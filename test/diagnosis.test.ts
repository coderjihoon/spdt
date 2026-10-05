import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateRenewalTier, calculateReportScore, DiagnosisInputError, finalizeReport, ITEMS, type Report } from "../lib/diagnosis";
import sample from "../data/reports/13115078314.json";

const base: Omit<Report, "score" | "signal"> = {
  summary: "", problems: [], priorities: [], renewalTier: "A", renewalReason: "", nextAction: "",
  items: ITEMS.map((name) => ({ name, score: 4, note: "" })),
};

test("총점과 신호 색은 항목 점수에서 일관되게 계산된다", () => {
  assert.deepEqual([finalizeReport(base).score, finalizeReport(base).signal], [75, "yellow"]);
  const poor = { ...base, items: base.items.map((item) => ({ ...item, score: 2 })) };
  assert.deepEqual([finalizeReport(poor).score, finalizeReport(poor).signal], [25, "red"]);
  assert.equal(calculateReportScore(base.items.map((item, index) => ({ ...item, score: index < 10 ? 5 : 4 }))).signal, "green");
});

test("범위를 벗어나거나 중복된 항목은 저장하지 않는다", () => {
  assert.throws(() => finalizeReport({ ...base, items: [{ ...base.items[0], score: 35 }, ...base.items.slice(1)] }));
  assert.throws(() => finalizeReport({ ...base, items: [base.items[0], ...base.items.slice(0, -1)] }));
});

test("잘 갖춰진 항목을 가장 큰 문제로 지목할 수 없다", () => {
  const problems = [{ relatedItem: ITEMS[0], problem: "", why: "", direction: "" }];
  assert.throws(() => finalizeReport({ ...base, problems }));
  assert.doesNotThrow(() => finalizeReport({ ...base, problems, items: [{ ...base.items[0], score: 2 }, ...base.items.slice(1)] }));
});

test("기존 진단서도 항목 점수로 총점과 신호를 계산한다", () => {
  assert.deepEqual(calculateReportScore(sample.items), { score: 50, signal: "yellow" });
  assert.throws(() => calculateReportScore([]));
  for (const [score, signal] of [[1, "red"], [3, "yellow"], [5, "green"]] as const) {
    assert.equal(calculateReportScore(base.items.map((item) => ({ ...item, score }))).signal, signal);
  }
});

test("확인하지 못한 항목을 결함으로 저장하지 않고 항목 순서를 고정한다", () => {
  const report = { ...base, items: base.items.map((item, index) => index === 0 ? { ...item, score: 3, note: "확인 필요: 제출 자료에서 확인되지 않음" } : item).reverse() };
  assert.deepEqual(finalizeReport(report).items.map(({ name }) => name), [...ITEMS]);
  assert.throws(() => finalizeReport({ ...report, problems: [{ relatedItem: ITEMS[0], problem: "후기 없음", why: "", direction: "" }] }));
  assert.throws(() => finalizeReport({ ...base, problems: Array(4).fill({ relatedItem: ITEMS[0], problem: "", why: "", direction: "" }) }));
});

test("확인 불가 항목은 점수와 수정 우선순위에서 제외한다", () => {
  const report = { ...base, items: base.items.map((item, index) => index === 0 ? { ...item, score: 3, confirmed: false, note: "이미지에 가격 정보가 보이지 않음" } : { ...item, confirmed: true }) };
  assert.equal(finalizeReport(report).score, 75);
  assert.throws(() => finalizeReport({ ...report, priorities: [{ relatedItem: ITEMS[0], item: "가격 추가", impact: "높음", difficulty: "낮음" }] }));
  assert.deepEqual(calculateReportScore(report.items.map((item) => ({ ...item, confirmed: false }))), { score: null, signal: "unknown" });
  assert.deepEqual(calculateReportScore([{ name: "후기", score: 3, note: "확인 필요: 자료 없음" }, { name: "카피", score: 5, note: "명확함" }]), { score: 100, signal: "yellow" });
});

test("오류 화면이나 식별하지 못한 상품에는 진단을 발급하지 않는다", () => {
  assert.throws(() => finalizeReport({ ...base, inputValid: false, inputIssue: "네이버 접속 오류 화면", items: [] }), DiagnosisInputError);
  assert.throws(() => finalizeReport({ ...base, inputValid: false }), DiagnosisInputError);
  assert.throws(() => finalizeReport({ ...base, inputValid: true, productName: " " }), DiagnosisInputError);
  assert.equal(finalizeReport({ ...base, inputValid: true, productName: "이미지에서 확인한 상품" }).productName, "이미지에서 확인한 상품");
});

test("원본에서 확인되지 않은 가격과 구독 주장은 진단을 발급하지 않는다", () => {
  const source = { inputValid: true, inputIssue: "", productName: "확인된 상품", prices: ["24,000원"], subscriptionVisible: false };
  const report = { ...base, inputValid: true, productName: source.productName };
  assert.equal(finalizeReport({ ...report, summary: "24,000원 가격 안내가 보입니다." }, source).productName, source.productName);
  assert.throws(() => finalizeReport({ ...report, problems: [{ relatedItem: ITEMS[0], problem: "60,000원 가격 오류", why: "", direction: "" }] }, source), DiagnosisInputError);
  assert.throws(() => finalizeReport({ ...report, nextAction: "정기구독 상품의 혜택을 수정하세요." }, source), DiagnosisInputError);
  assert.throws(() => finalizeReport({ ...report, productName: "다른 상품" }, source), DiagnosisInputError);
  assert.throws(() => finalizeReport({ ...report, items: report.items.map((item) => item.name === "가격·혜택 제시" ? { ...item, confirmed: true } : item) }, { ...source, prices: [] }), DiagnosisInputError);
});

test("A·B·C와 근거가 전혀 없을 때의 판정 보류를 항목 점수로 계산한다", () => {
  const withScores = (score: number) => base.items.map((item) => ({ ...item, score }));
  assert.equal(calculateRenewalTier(withScores(5)).renewalTier, "A");
  assert.equal(calculateRenewalTier(withScores(4)).renewalTier, "B");
  assert.equal(calculateRenewalTier(withScores(3)).renewalTier, "B");
  assert.equal(calculateRenewalTier(withScores(2)).renewalTier, "C");
  assert.equal(calculateRenewalTier(withScores(4).map((item, index) => ({ ...item, confirmed: index < 11 }))).renewalTier, "B");
  assert.equal(calculateRenewalTier(withScores(4).map((item) => ({ ...item, confirmed: false }))).renewalTier, null);
  const structural = withScores(4).map((item, index) => index === 0 ? { ...item, score: 1 } : item);
  assert.equal(calculateReportScore(structural).score, 70);
  assert.equal(calculateRenewalTier(structural).renewalTier, "B");
  assert.equal(calculateRenewalTier(withScores(5).map((item, index) => ({ ...item, confirmed: index < 13 }))).renewalTier, "B");
  assert.equal(calculateRenewalTier(withScores(5).map((item, index) => ({ ...item, confirmed: index < 14 }))).renewalTier, "A");
  assert.equal(calculateRenewalTier(withScores(5).map((item, index) => index === 0 ? { ...item, score: 3 } : item)).renewalTier, "B");
  const broad = withScores(3).map((item, index) => index < 2 ? { ...item, score: 1 } : item);
  assert.equal(calculateRenewalTier(broad).renewalTier, "C");
  assert.equal(finalizeReport({ ...base, renewalTier: "C", renewalReason: "AI의 임의 판정" }).renewalTier, "B");
});
