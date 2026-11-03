import { NextResponse } from "next/server";
import { analyzeSmartstore } from "@/lib/smartstore";
import { errorStatus, SmartstoreError } from "@/lib/smartstore/errors";

export const runtime = "nodejs";
export const maxDuration = 65;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    const failure = new SmartstoreError("INVALID_URL", { cause: error });
    return NextResponse.json({ success: false, code: failure.code, message: failure.message }, { status: errorStatus(failure.code) });
  }
  const url = body && typeof body === "object" ? (body as Record<string, unknown>).url : undefined;
  try { return NextResponse.json({ success: true, data: await analyzeSmartstore(url) }); }
  catch (error) {
    const failure = error instanceof SmartstoreError ? error : new SmartstoreError("PAGE_LOAD_FAILED", { cause: error });
    return NextResponse.json({ success: false, code: failure.code, message: failure.message }, { status: errorStatus(failure.code) });
  }
}
