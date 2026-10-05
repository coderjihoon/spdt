import type { Metadata } from "next";
import TodoBoard from "./TodoBoard";

export const metadata: Metadata = {
  title: "런칭·운영 체크리스트 | 상페닥터",
  description: "상페닥터의 런칭 준비와 매일·매주 운영 체크리스트",
  robots: { index: false, follow: false },
};

export default function TodoPage() {
  return <TodoBoard />;
}
