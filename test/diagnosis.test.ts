import assert from "node:assert/strict";
import { test } from "node:test";
import { finalizeReport, ITEMS, type Report } from "../lib/diagnosis";

const base: Omit<Report, "score" | "signal"> = {
  summary: "", problems: [], priorities: [], renewalTier: "A", renewalReason: "", nextAction: "",
  items: ITEMS.map((name) => ({ name, score: 4, note: "" })),
};

test("총점과 신호 색은 항목 점수에서 일관되게 계산된다", () => {
  assert.deepEqual([finalizeReport(base).score, finalizeReport(base).signal], [75, "green"]);
  const poor = { ...base, items: base.items.map((item) => ({ ...item, score: 2 })) };
  assert.deepEqual([finalizeReport(poor).score, finalizeReport(poor).signal], [25, "red"]);
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
