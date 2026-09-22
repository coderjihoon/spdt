import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Report } from "@/lib/diagnosis";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const COOKIE = "admin_token";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (!process.env.ADMIN_TOKEN || password !== process.env.ADMIN_TOKEN) {
    redirect("/admin?error=1");
  }
  (await cookies()).set(COOKIE, password, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/admin" });
  redirect("/admin");
}

type Row = {
  access_token: string;
  email: string;
  name: string | null;
  product_url: string | null;
  status: string;
  report: Report | null;
  created_at: string;
};

async function loadRows(): Promise<Row[]> {
  const { data } = await supabaseAdmin()
    .from("diagnoses")
    .select("access_token, email, name, product_url, status, report, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; q?: string }> }) {
  const { error, q } = await searchParams;
  const authed = process.env.ADMIN_TOKEN && (await cookies()).get(COOKIE)?.value === process.env.ADMIN_TOKEN;

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F8] p-6">
        <form action={login} className="w-full max-w-[320px] rounded-2xl border border-slate-200 bg-white p-7">
          <h1 className="text-[16px] font-semibold text-slate-900">관리자 로그인</h1>
          <input name="password" type="password" placeholder="비밀번호" autoFocus className="mt-4 h-11 w-full rounded-[10px] border-0 bg-[#f7f7fb] px-4 text-[14px] outline-none ring-1 ring-inset ring-[#ececf4] focus:ring-2 focus:ring-[#7b74ef]" />
          {error && <p className="mt-3 text-[13px] text-red-600">비밀번호가 올바르지 않습니다.</p>}
          <button type="submit" className="mt-4 w-full rounded-[10px] bg-[#463fa6] px-4 py-3 text-[13px] font-medium text-white hover:bg-[#3d3691]">로그인</button>
        </form>
      </main>
    );
  }
  const all = await loadRows();
  const needle = q?.trim().toLowerCase();
  const rows = needle
    ? all.filter((row) => row.access_token.slice(0, 6).toLowerCase() === needle || row.email.toLowerCase().includes(needle) || row.name?.toLowerCase().includes(needle))
    : all;

  return (
    <main className="min-h-screen bg-[#F7F7F8] p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[20px] font-semibold text-slate-900">진단 신청 목록 ({rows.length})</h1>
        <form className="flex gap-2">
          <input name="q" defaultValue={q ?? ""} placeholder="상담코드 / 이메일 / 이름" className="h-10 w-[220px] rounded-[10px] border-0 bg-white px-3 text-[13px] outline-none ring-1 ring-inset ring-[#ececf4] focus:ring-2 focus:ring-[#7b74ef]" />
          <button type="submit" className="rounded-[10px] bg-[#463fa6] px-4 text-[13px] font-medium text-white hover:bg-[#3d3691]">검색</button>
        </form>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[960px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3 font-medium">코드</th>
              <th className="px-4 py-3 font-medium">신청일</th>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">제품 URL</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">점수</th>
              <th className="px-4 py-3 font-medium">등급</th>
              <th className="px-4 py-3 font-medium">리포트</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.access_token} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#463fa6" }}>{row.access_token.slice(0, 6).toUpperCase()}</td>
                <td className="px-4 py-3 text-slate-500">{row.created_at.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-3">{row.name || "-"}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="max-w-[240px] truncate px-4 py-3">
                  {row.product_url ? <a href={row.product_url} target="_blank" rel="noreferrer" className="text-[#463fa6] hover:underline">{row.product_url}</a> : "-"}
                </td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.report?.score ?? "-"}</td>
                <td className="px-4 py-3">{row.report?.renewalTier ?? "-"}</td>
                <td className="px-4 py-3">
                  {row.status === "complete" && <a href={`/report/${row.access_token}`} target="_blank" rel="noreferrer" className="text-[#463fa6] hover:underline">보기</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
