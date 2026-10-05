"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { findings, phases, tasks, type Phase } from "./tasks";
import styles from "./tdl.module.css";

type Entry = { checked?: boolean; note?: string };
type Saved = { version: 1; entries: Record<string, Entry> };
const STORAGE_KEY = "spdt-operations-v1";
const adGate = ["proof", "e2e", "tracking", "crm", "cost"];

function periodKeys() {
  const now = new Date();
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const koreanDate = new Date(`${day}T00:00:00+09:00`);
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  koreanDate.setUTCDate(koreanDate.getUTCDate() - ((weekday + 6) % 7));
  const week = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(koreanDate);
  return { day, week };
}

function validateSaved(value: unknown): value is Saved {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Saved;
  return candidate.version === 1 && !!candidate.entries && typeof candidate.entries === "object" && !Array.isArray(candidate.entries) && Object.entries(candidate.entries).every(([key, entry]) =>
    key.length < 150 && entry && typeof entry === "object" && (entry.checked === undefined || typeof entry.checked === "boolean") && (entry.note === undefined || (typeof entry.note === "string" && entry.note.length <= 5000)));
}

export default function TodoBoard() {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [loaded, setLoaded] = useState(false);
  const [period, setPeriod] = useState({ day: "", week: "" });
  const [phase, setPhase] = useState<Phase>("launch");
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPeriod(periodKeys());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (!validateSaved(saved)) throw new Error("invalid");
        setEntries(saved.entries);
      }
    } catch { setStorageError("저장된 기록을 읽지 못했습니다. 백업 파일이 있으면 불러와 주세요. 새 기록을 저장하려면 백업을 불러오거나 이 브라우저의 저장 공간을 확인해 주세요."); }
    setLoaded(true);
    const timer = window.setInterval(() => setPeriod(periodKeys()), 60_000);
    const refresh = () => setPeriod(periodKeys());
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);

  function keyFor(id: string, taskPhase: Phase) {
    return taskPhase === "daily" ? `${id}:${period.day}` : taskPhase === "weekly" ? `${id}:${period.week}` : id;
  }
  function update(key: string, patch: Entry) {
    const next = { ...entries, [key]: { ...entries[key], ...patch } };
    setEntries(next);
    if (storageError) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, entries: next })); }
    catch { setStorageError("브라우저에 저장하지 못했습니다. 현재 기록을 백업해 주세요. 새로고침하면 저장되지 않은 변경이 사라질 수 있습니다."); }
  }
  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, entries }, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `상페닥터-운영-${period.day}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("현재 체크 상태와 메모를 백업 파일로 내보냈습니다.");
  }
  async function importData(file?: File) {
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("size");
      const value: unknown = JSON.parse(await file.text());
      if (!validateSaved(value)) throw new Error("invalid");
      // Merge backups: current records remain when a key exists in both files.
      const next = { ...value.entries, ...entries };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, entries: next }));
      setEntries(next);
      setStorageError("");
      setNotice("백업을 합쳤습니다. 겹치는 항목은 현재 브라우저의 기록을 유지했습니다.");
    } catch { setNotice("불러오지 못했습니다. 2MB 이하의 상페닥터 체크리스트 JSON 백업과 브라우저 저장 공간을 확인해 주세요."); }
    if (importRef.current) importRef.current.value = "";
  }

  const isChecked = (id: string, p: Phase) => Boolean(entries[keyFor(id, p)]?.checked);
  const launchTasks = tasks.filter(task => task.phase === "launch" && task.priority === "필수");
  const launchDone = launchTasks.filter(task => isChecked(task.id, task.phase)).length;
  const adDone = adGate.filter(id => isChecked(id, "launch")).length;
  const currentTasks = tasks.filter(task => task.phase === phase);
  const completed = currentTasks.filter(task => isChecked(task.id, phase)).length;
  const visible = currentTasks.filter(task => (filter !== "미완료" || !isChecked(task.id, phase)) && (filter !== "필수" || task.priority === "필수") && `${task.title} ${task.category} ${task.why}`.includes(search.trim()));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" aria-label="상페닥터 홈"><Image src="/logo%20final2.png" width={1154} height={339} alt="상페닥터" className={styles.logo} priority /></a>
          <span className={styles.headerLabel}>런칭·운영 노트</span>
          <nav aria-label="운영 바로가기"><a href="/ad">광고 초안</a><a href="/admin">진단 관리자 <Arrow /></a></nav>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.intro}>
          <div><h1>광고를 시작하고,<br />운영이 이어지도록.</h1><p>최대한 빠른 런칭을 위한 상페닥터의 실행 목록입니다.<br className={styles.desktopBreak} /> 먼저 작은 광고 실험을 준비하고, 고객이 들어온 다음까지 챙기세요.</p></div>
          <div className={styles.readiness}><span>런칭 필수 점검</span><strong>{loaded ? launchDone : "—"}<small> / {launchTasks.length}</small></strong><div className={styles.progress} role="progressbar" aria-label="런칭 필수 점검 완료" aria-valuenow={launchDone} aria-valuemin={0} aria-valuemax={launchTasks.length}><span style={{ transform: `scaleX(${launchDone / launchTasks.length})` }} /></div><p>{launchDone === launchTasks.length ? "필수 항목 체크 완료 · 실제 운영 결과도 확인하세요." : "구현된 기능도 실제 배포에서 확인 후 체크하세요."}</p></div>
        </div>

        <section className={styles.adPlan} aria-labelledby="ad-title">
          <div className={styles.adLead}><h2 id="ad-title">가장 먼저, 광고 첫 실험</h2><p>기존 90일 계획을 기준으로 작게 시작합니다. 아래 5가지는 광고 준비 점검이며, 런칭 필수 항목도 함께 완료하세요.</p><a href="/ad" className={styles.primary}>광고 소재 고르기 <Arrow /></a><span className={styles.adCount}>{adDone} / 5 준비 점검 완료</span></div>
          <ol className={styles.adSteps}>
            <li><span>1</span><div><h3>신뢰 · 신청 · 측정부터</h3><p>실적 수치 확인, 후기 공개 범위 점검, 신청 전 과정 테스트, 유입 측정, 상담 장부, 비용 상한.</p><div className={styles.gateLinks}>{adGate.map(id => { const task = tasks.find(t => t.id === id)!; return <button key={id} onClick={() => { setPhase("launch"); setFilter("전체"); setSearch(""); setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "center" }), 0); }}>{isChecked(id, "launch") && <Check />}{({ proof: "신뢰", e2e: "신청", tracking: "측정", crm: "상담", cost: "비용" } as Record<string, string>)[id]}<span className={styles.srOnly}>: {task.title}</span></button>; })}</div></div></li>
            <li><span>2</span><div><h3>소재 2개 · 7일 · 총 7만 원 이내</h3><p>같은 예산으로 비교하고 중간에 무리하게 증액하지 않습니다. 광고 초안은 이미 준비돼 있습니다.</p></div></li>
            <li><span>3</span><div><h3>클릭 다음의 적합 상담까지 기록</h3><p>진단 완료 → 상담 → 견적 → 계약을 봅니다. 누적 20만 원에도 적합 상담이 0건이면 증액을 멈춥니다.</p></div></li>
          </ol>
        </section>

        <details className={styles.analysis}>
          <summary><div><h2>지금 상페닥터는 어떤 상태인가요?</h2><p>서비스 골격은 구현됐고, 신뢰 정보와 운영 절차를 마무리할 단계입니다.</p></div><span className={styles.expand}>+</span></summary>
          <div className={styles.findings}>{findings.map(finding => <article key={finding.label}><div><h3>{finding.label}</h3><span className={styles[finding.tone]}>{finding.status}</span></div><p>{finding.text}</p><small>{finding.source}</small></article>)}</div>
          <p className={styles.analysisNote}>2026.10.04 저장소 코드·문서 기준 분석입니다. 운영 DB, 실제 메일 수신, 현재 광고 계정·매출은 조회하지 않았습니다. 구현과 운영 검증을 구분해 체크하세요.</p>
        </details>

        <section id="checklist" className={styles.checklist} aria-labelledby="checklist-title">
          <div className={styles.listHeading}><div><h2 id="checklist-title">하나씩 실행해볼까요.</h2><p>할 일마다 실행 순서와 완료 기준을 적어두었습니다.</p></div><div className={styles.backup}><button disabled={!loaded} onClick={exportData}>기록 백업</button><button disabled={!loaded} onClick={() => importRef.current?.click()}>백업 불러오기</button><input ref={importRef} type="file" accept=".json,application/json" aria-label="체크리스트 백업 파일" className={styles.srOnly} tabIndex={-1} onChange={e => void importData(e.target.files?.[0])} /></div></div>
          <div className={styles.phaseTabs} role="tablist" aria-label="운영 시점">{phases.map(p => <button key={p.id} role="tab" aria-selected={phase === p.id} aria-controls="task-panel" id={`tab-${p.id}`} onClick={() => { setPhase(p.id); setSearch(""); setFilter("전체"); }}>{p.label}<span>{tasks.filter(t => t.phase === p.id).length}</span></button>)}</div>
          <div className={styles.toolbar}><div><p>{phases.find(p => p.id === phase)?.description}</p><small>{phase === "daily" ? `한국 시간 ${period.day || "오늘"} · 매일 새 체크` : phase === "weekly" ? `${period.week || "이번 주"} 시작 주 · 매주 월요일 새 체크` : `${completed} / ${currentTasks.length} 완료`} · 상세 내용을 펼쳐 메모할 수 있어요.</small></div><label className={styles.search}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><input value={search} onChange={e => setSearch(e.target.value)} placeholder="할 일 검색" aria-label="할 일 검색" /></label></div>
          <div className={styles.filters} aria-label="할 일 필터">{["전체", "미완료", "필수"].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}<span aria-live="polite">{visible.length}개 항목{(phase === "daily" || phase === "weekly") && ` · ${completed}개 완료`}</span></div>
          <div id="task-panel" role="tabpanel" aria-labelledby={`tab-${phase}`} className={styles.tasks}>
            {visible.map(task => { const key = keyFor(task.id, phase); const checked = isChecked(task.id, phase); return <article id={task.id} key={key} className={`${styles.task} ${checked ? styles.doneTask : ""}`}><div className={styles.taskRow}><input id={`check-${task.id}`} type="checkbox" checked={checked} disabled={!loaded} onChange={e => update(key, { checked: e.target.checked })} aria-label={`${task.title} 완료`} /><details><summary><div className={styles.taskTitle}><span className={`${styles.priority} ${task.priority === "필수" ? styles.required : ""}`}>{task.priority}</span><h3>{task.title}</h3><span className={styles.category}>{task.category}</span></div><span className={styles.taskMeta}>{task.time}<span className={styles.expand}>+</span></span></summary><div className={styles.taskDetails}><p className={styles.why}>{task.why}</p><h4>실행 순서</h4><ol>{task.steps.map(step => <li key={step}>{step}</li>)}</ol><div className={styles.acceptance}><Check /><div><h4>완료 기준</h4><p>{task.done}</p></div></div>{task.href && <a className={styles.taskLink} href={task.href} target="_blank" rel="noreferrer">{task.link}<Arrow /></a>}<p className={styles.source}>분석 근거 · {task.source}</p><label className={styles.memo}>실행 메모<textarea value={entries[key]?.note || ""} maxLength={5000} onChange={e => update(key, { note: e.target.value })} placeholder="확인 결과, 다음 행동, 작업 링크를 남겨보세요. 고객 개인정보나 비밀번호는 적지 마세요." rows={3} /></label></div></details></div></article>; })}
            {!visible.length && <div className={styles.empty}><Check /><h3>{filter === "미완료" && !search ? "이 시점의 할 일을 모두 체크했어요." : "조건에 맞는 할 일이 없습니다."}</h3><p>다른 시점의 목록을 보거나 검색·필터를 바꿔보세요.</p><button onClick={() => { setFilter("전체"); setSearch(""); }}>전체 목록 보기</button></div>}
          </div>
        </section>
        <div className={styles.notice} role="status" aria-live="polite">{notice}</div>
        {storageError && <p className={styles.error} role="alert">{storageError}</p>}
        <footer className={styles.footer}><p>체크와 메모는 이 브라우저에만 저장됩니다. 기기 간 동기화는 되지 않으며, 브라우저 데이터를 삭제하기 전에 백업하세요. 반복 항목의 지난 기록도 백업에 포함됩니다.</p><p>이 페이지는 검색 제외 설정이 적용돼 있습니다. 별도의 로그인 보호는 없으므로 민감한 운영 정보는 입력하지 마세요.</p><a href="/">상페닥터 홈으로 <Arrow /></a></footer>
      </div>
    </main>
  );
}

function Arrow() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
function Check() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>; }
