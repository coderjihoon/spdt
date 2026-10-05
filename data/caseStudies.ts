export type CaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseStudy = {
  name: string;
  issue: string;
  change: string;
  before?: CaseImage;
  after: CaseImage;
};

// 공개 가능한 실제 프로젝트명, 수정 근거, 이미지가 준비되면 추가합니다.
export const caseStudies: CaseStudy[] = [];
