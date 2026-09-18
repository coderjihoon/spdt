export const applySiteConfig = {
  name: "상페닥터",
  label: "상세페이지 진단·개선 서비스",
  description:
    "상세페이지의 구조, 카피, 디자인 흐름을 진단하고 구매를 막는 요소를 정리해 개선 방향을 제안합니다.",
  email: "hello@spdt.studio",
  ctaHref: "#diagnosis-form",
  emailHref:
    "mailto:hello@spdt.studio?subject=%EC%83%81%ED%8E%98%EB%8B%A5%ED%84%B0%20%EB%AC%B4%EB%A3%8C%20%EC%A7%84%EB%8B%A8%20%EC%8B%A0%EC%B2%AD",
  promo: "제품 URL 또는 상세페이지 이미지만 보내도 무료로 진단해드립니다.",
};

export const applyNavLinks = [
  { label: "진단 대상", href: "#problems" },
  { label: "진단 항목", href: "#diagnosis" },
  { label: "전달 예시", href: "#examples" },
  { label: "신청", href: "#diagnosis-form" },
  { label: "FAQ", href: "#faq" },
];

export const applyHeroStats = [
  { value: "무료", label: "상세페이지 1차 진단" },
  { value: "3가지", label: "구매를 막는 요소 정리" },
  { value: "URL/이미지", label: "둘 중 하나만 있어도 신청 가능" },
];

export const applyProblemItems = [
  "상세페이지가 있는데 전환이 잘 안 됩니다.",
  "광고비는 쓰고 있는데 구매가 잘 안 일어납니다.",
  "무엇을 먼저 고쳐야 할지 모르겠어요.",
  "제품 장점은 많은데 고객에게 잘 전달되지 않아요.",
  "와디즈·텀블벅 펀딩을 준비 중이에요.",
  "기존 상세페이지가 촌스럽거나 정리가 안 되어 있어요.",
];

export const applyDiagnosisItems = [
  {
    title: "첫 화면 메시지",
    description:
      "고객이 3초 안에 제품의 핵심 가치와 구매 이유를 이해하는지 확인합니다.",
  },
  {
    title: "구매 흐름",
    description:
      "문제 제기, 해결 근거, 제품 정보, CTA가 자연스럽게 이어지는지 봅니다.",
  },
  {
    title: "셀링포인트",
    description:
      "브랜드가 말하고 싶은 장점이 고객이 사고 싶은 이유로 번역되어 있는지 점검합니다.",
  },
  {
    title: "카피",
    description:
      "문장이 길거나 추상적이지 않은지, 망설임을 줄이는 언어인지 확인합니다.",
  },
  {
    title: "디자인 가독성",
    description:
      "모바일 스크롤에서 정보 강약, 여백, 이미지와 텍스트의 리듬이 읽히는지 봅니다.",
  },
];

export const applyExampleCards = [
  {
    eyebrow: "첫 화면 진단",
    problem: "첫 화면이 제품명과 큰 이미지 중심이라 구매 이유가 바로 보이지 않습니다.",
    reason:
      "광고나 검색으로 들어온 고객은 제품을 자세히 읽기 전에 나에게 필요한 이유부터 찾습니다.",
    direction:
      "상단 문장을 고객 상황 중심으로 바꾸고 핵심 효과와 신뢰 근거를 첫 화면 안에 배치합니다.",
  },
  {
    eyebrow: "구매 흐름 진단",
    problem: "기능, 인증, 후기, 가격 정보가 같은 비중으로 나열되어 있습니다.",
    reason:
      "정보가 많아도 우선순위가 없으면 고객은 어떤 근거로 판단해야 할지 놓치게 됩니다.",
    direction:
      "고민 제기, 해결 원리, 차별점, 사용 증거, CTA 순서로 섹션을 재배치합니다.",
  },
];

export const applyProcessSteps = [
  {
    step: "1",
    title: "제품 URL 또는 상세페이지 이미지를 보냅니다.",
    description:
      "현재 판매 중인 링크, 준비 중인 상세페이지 캡처, 이미지 초안 중 편한 자료를 보내주세요.",
  },
  {
    step: "2",
    title: "상페닥터가 구조·카피·디자인 흐름을 확인합니다.",
    description:
      "첫 화면, 설득 순서, 카피 명확도, 모바일 가독성을 구매 흐름 기준으로 살펴봅니다.",
  },
  {
    step: "3",
    title: "구매를 막고 있는 요소 3가지를 정리해드립니다.",
    description:
      "바로 확인할 수 있는 병목과 왜 문제가 되는지를 짧고 명확하게 전달합니다.",
  },
  {
    step: "4",
    title: "필요한 경우 제작/리뉴얼 방향을 제안드립니다.",
    description:
      "단순 수정으로 충분한지, 구조 리뉴얼이 필요한지 다음 액션을 구분해 안내합니다.",
  },
];

export const applyTrustPoints = [
  {
    title: "예쁜 화면은 나중입니다. 설득 순서가 먼저입니다.",
    description:
      "디자인을 더하기 전에 고객이 어떤 순서로 이해하고 확신해야 하는지부터 정리합니다.",
  },
  {
    title: "기준은 하나, 고객의 망설임입니다.",
    description:
      "제품 장점 나열이 아니라 구매 전 고객이 떠올리는 의심과 질문을 기준으로 진단합니다.",
  },
  {
    title: "진단으로 끝나지 않습니다. 제작까지 봅니다.",
    description:
      "무료 진단에서 끝나지 않고, 필요하면 제작·리뉴얼 범위와 우선순위를 현실적으로 제안합니다.",
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
      "네. 제품 URL이나 상세페이지 이미지를 보내주시면 구매를 막는 핵심 요소 3가지를 무료로 정리해드립니다.",
  },
  {
    question: "무엇을 보내야 하나요?",
    answer:
      "판매 중인 제품 URL이 가장 좋습니다. 아직 공개 전이라면 상세페이지 이미지, 캡처, 기획 초안만 보내주셔도 됩니다.",
  },
  {
    question: "진단 후 꼭 제작을 맡겨야 하나요?",
    answer:
      "아닙니다. 무료 진단만 받아보셔도 됩니다. 제작이나 리뉴얼이 필요하다고 판단될 때만 상담 방향을 제안드립니다.",
  },
  {
    question: "어떤 부분을 봐주시나요?",
    answer:
      "첫 화면 메시지, 구매 흐름, 셀링포인트, 카피, 모바일 디자인 가독성을 중심으로 확인합니다.",
  },
  {
    question: "신규 상품도 진단 가능한가요?",
    answer:
      "가능합니다. 상세페이지가 없어도 제품 소개 자료, 경쟁 제품 링크, 펀딩 준비 자료를 기준으로 구조 방향을 봐드립니다.",
  },
];

export const applyFooterLinks = [
  { label: "진단 항목", href: "#diagnosis" },
  { label: "전달 예시", href: "#examples" },
  { label: "무료 신청", href: "#diagnosis-form" },
  { label: "FAQ", href: "#faq" },
];
