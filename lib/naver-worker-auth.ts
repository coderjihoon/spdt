import { createHash, timingSafeEqual } from "node:crypto";

export function authorizedWorker(request: Request) {
  const secret = process.env.NAVER_WORKER_TOKEN;
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!secret || !token || secret.length < 32) return false;
  return timingSafeEqual(createHash("sha256").update(secret).digest(), createHash("sha256").update(token).digest());
}
