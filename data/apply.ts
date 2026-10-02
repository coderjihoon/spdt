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
  { label: "실적", href: "/#proof" },
  { label: "작업물", href: "/works" },
  { label: "진단 대상", href: "/#problems" },
  { label: "진단 항목", href: "/#diagnosis" },
  { label: "전달 예시", href: "/#examples" },
  { label: "신청", href: "/#diagnosis-form" },
  { label: "FAQ", href: "/#faq" },
];

// AI 엔진이 학습한 데이터 건수. ProofSection 통계와 DiagnosisSection 소개 문구에서 공유해 숫자를 한 곳에서만 관리한다.
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
  "기존 상세페이지가 촌스럽거나 정리가 안 되어 있어요.",
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

export const applyExampleCards = [
  {
    eyebrow: "첫 화면 진단",
    problem: "제품명과 큰 이미지가 첫 화면을 차지해 구매 이유가 바로 보이지 않습니다.",
    reason:
      "광고나 검색으로 들어온 고객은 제품을 자세히 읽기 전에, 나에게 왜 필요한지부터 확인합니다.",
    direction:
      "상단 문장은 고객 상황 중심으로 바꿉니다. 핵심 효과와 신뢰 근거도 첫 화면 안에 배치합니다.",
  },
  {
    eyebrow: "정보 순서 진단",
    problem: "기능, 인증, 후기, 가격 정보가 같은 비중으로 늘어서 있습니다.",
    reason:
      "정보가 많아도 우선순위가 없으면 고객은 무엇을 근거로 판단할지 알기 어렵습니다.",
    direction:
      "섹션은 고민 제기, 해결 원리, 차별점, 사용 증거, CTA 순서로 다시 배치합니다.",
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

export const applyTrustPoints = [
  {
    title: "디자인보다 먼저, 순서부터 봅니다.",
    description:
      "무엇을 먼저 보여주고 어떤 근거를 뒤에 둘지부터 잡습니다.",
  },
  {
    title: "고객이 멈추는 이유를 찾습니다.",
    description:
      "사기 전까지 남는 의심과 질문을 페이지 안에서 풀 수 있는지 봅니다.",
  },
  {
    title: "진단만 받고 끝내도 됩니다.",
    description:
      "제작이나 리뉴얼이 필요할 때만 범위와 우선순위를 말씀드립니다.",
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

// PLACEHOLDER — 실제 진단 건수·후기·팀 정보로 교체 전까지 배포 금지.
export const applyProofStats = [
  { value: "290+", label: "누적 고객사" },
  { value: "98%", label: "평균 고객만족도" },
  { value: "7,010만원", label: "단일 작업 최고 매출액" },
];

// PLACEHOLDER — 실제 후기로 교체 전까지 배포 금지.
export const applyTestimonials = [
  { quote: "첫 화면 문구만 바꿨는데 이탈률이 눈에 보이게 줄었어요.", author: "김OO", role: "뷰티 브랜드 대표", avatar: "/faces/notion-face-1.png" },
  { quote: "펀딩 준비 중에 받은 진단으로 상세페이지 순서를 다시 짰습니다.", author: "이OO", role: "와디즈 펀딩 준비", avatar: "/faces/notion-face-2.png" },
  { quote: "무엇부터 고쳐야 할지 몰랐는데, 순서가 보이니 바로 손댈 수 있었어요.", author: "정OO", role: "생활용품 브랜드 운영", avatar: "/faces/notion-face-3.png" },
  { quote: "긴 설명을 줄이고 나니 제품 장점이 훨씬 또렷하게 보였습니다.", author: "최OO", role: "식품 브랜드 대표", avatar: "/faces/notion-face-4.png" },
  { quote: "후기와 인증을 어디에 둬야 할지 알게 된 것만으로도 큰 도움이 됐어요.", author: "박OO", role: "건강식품 브랜드 운영", avatar: "/faces/notion-face-5.png" },
  { quote: "광고비를 더 쓰기 전에 페이지부터 봐야 한다는 걸 알았습니다.", author: "윤OO", role: "패션 브랜드 대표", avatar: "/faces/notion-face-1.png" },
  { quote: "우리 제품을 처음 보는 사람 입장에서 다시 보게 됐어요.", author: "한OO", role: "반려동물 브랜드 운영", avatar: "/faces/notion-face-2.png" },
];

export const applyFooterLinks = [
  { label: "작업물", href: "/works" },
  { label: "진단 항목", href: "/#diagnosis" },
  { label: "전달 예시", href: "/#examples" },
  { label: "무료 신청", href: "/#diagnosis-form" },
  { label: "FAQ", href: "/#faq" },
];
