export const applySiteConfig = {
  name: "상페닥터",
  label: "상세페이지 진단·개선 서비스",
  description:
    "상세페이지에서 고객이 멈추는 지점을 찾습니다. 정보 순서와 문장, 디자인을 보고, 구매를 막는 요소와 개선 방향을 정리합니다.",
  email: "hello@spdt.studio",
  ctaHref: "/#diagnosis-form",
  emailHref:
    "mailto:hello@spdt.studio?subject=%EC%83%81%ED%8E%98%EB%8B%A5%ED%84%B0%20%EB%AC%B4%EB%A3%8C%20%EC%A7%84%EB%8B%A8%20%EC%8B%A0%EC%B2%AD",
  promo: "제품 URL 또는 상세페이지 이미지 하나만 보내주세요. 무료로 진단해드립니다.",
};

export const applyNavLinks = [
  { label: "작업물", href: "/works" },
];

// AI 엔진이 학습한 데이터 건수. 통계와 DiagnosisSection 소개 문구에서 공유해 숫자를 한 곳에서만 관리한다.
export const applyAiEngineDataCount = "700+";

export const applyHeroStats = [
  { value: "무료", label: "상세페이지 1차 진단" },
  { value: "3가지", label: "구매를 망설이게 하는 이유 정리" },
  { value: "URL/이미지", label: "둘 중 하나만 있으면 신청 가능" },
];

export const applyProblemItems = [
  "상세페이지가 있는데 전환이 잘 안 됩니다.",
  "광고비는 쓰고 있는데 구매가 잘 안 일어납니다.",
  "무엇을 먼저 고쳐야 할지 모르겠어요.",
  "제품 장점은 많은데 고객에게 잘 전달되지 않아요.",
  "와디즈·텀블벅 펀딩을 준비 중이에요.",
  "기존 상세페이지가 정리가 안 되어 있어요.",
];

export const applyDiagnosisItems = [
  {
    title: "첫 화면 메시지",
    description:
      "고객이 제품의 핵심 가치와 구매 이유를 3초 안에 이해할 수 있는지 봅니다.",
  },
  {
    title: "정보 순서",
    description:
      "문제 제기부터 해결 근거, 제품 정보, CTA까지 자연스럽게 이어지는지 확인합니다.",
  },
  {
    title: "셀링포인트",
    description:
      "브랜드가 말하고 싶은 장점을 고객이 사고 싶은 이유로 풀어냈는지 점검합니다.",
  },
  {
    title: "카피",
    description:
      "긴 문장과 추상적인 표현이 고객의 망설임을 키우지 않는지 확인합니다.",
  },
  {
    title: "디자인 가독성",
    description:
      "모바일에서 넘겨 볼 때 정보의 강약, 여백, 이미지와 텍스트의 리듬이 잘 읽히는지 봅니다.",
  },
];

export const applyProcessSteps = [
  {
    step: "1",
    title: "제품 URL 또는 상세페이지 이미지 보내기",
    description:
      "판매 중인 링크나 준비 중인 상세페이지 캡처, 이미지 초안 가운데 편한 자료를 보내주세요.",
  },
  {
    step: "2",
    title: "정보 순서·문장·디자인 살펴보기",
    description:
      "첫 화면부터 정보의 순서, 문장의 명확도, 모바일 가독성까지 살펴봅니다.",
  },
  {
    step: "3",
    title: "구매를 막는 요소 3가지 정리",
    description:
      "고객이 멈추는 곳과 그 이유를 짧고 분명하게 전달합니다.",
  },
  {
    step: "4",
    title: "필요한 경우 제작/리뉴얼 방향 제안",
    description:
      "진단만으로 충분하면 여기서 끝냅니다. 제작이 필요할 때만 예상 범위와 일정을 안내드리며, 신청을 강요하지 않습니다.",
  },
];

export const applyFormChecklist = [
  "제품 URL",
  "상세페이지 이미지 또는 캡처",
  "현재 고민 한 줄",
];

export const applyFaqItems = [
  {
    question: "무료 진단은 정말 무료인가요?",
    answer:
      "네. 제품 URL이나 상세페이지 이미지 하나만 보내주세요. 구매를 막는 핵심 요소 3가지를 무료로 정리해드립니다.",
  },
  {
    question: "무엇을 보내야 하나요?",
    answer:
      "판매 중인 제품은 URL이 가장 좋습니다. 아직 공개 전이면 상세페이지 이미지, 캡처, 기획 초안만 보내주셔도 됩니다.",
  },
  {
    question: "진단 후 꼭 제작을 맡겨야 하나요?",
    answer:
      "아닙니다. 무료 진단만 받아보셔도 됩니다. 제작이나 리뉴얼이 필요하다고 판단되면 그때 상담 방향을 제안드립니다.",
  },
  {
    question: "어떤 부분을 봐주시나요?",
    answer:
      "첫 화면 메시지부터 정보 순서, 셀링포인트, 카피, 모바일 디자인 가독성까지 살펴봅니다.",
  },
  {
    question: "신규 상품도 진단 가능한가요?",
    answer:
      "가능합니다. 상세페이지가 없어도 제품 소개 자료, 경쟁 제품 링크, 펀딩 준비 자료로 구조 방향을 봐드립니다.",
  },
];

// PLACEHOLDER — 아래 실적 수치는 근거 확인 전까지 배포 금지.
export const applyProofStats = [
  { value: "290+", label: "누적 고객사" },
  { value: "98%", label: "평균 고객만족도" },
  { value: "7,010만원", label: "단일 작업 최고 매출액" },
];

export const applyFooterLinks = [
  { label: "작업물", href: "/works" },
  { label: "진단 항목", href: "/#diagnosis" },
  { label: "전달 예시", href: "/#report-preview" },
  { label: "무료 신청", href: "/#diagnosis-form" },
  { label: "FAQ", href: "/#faq" },
];
