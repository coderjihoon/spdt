export type SmartstoreErrorCode = "INVALID_URL" | "PRODUCT_NOT_FOUND" | "PAGE_LOAD_FAILED" | "DETAIL_AREA_NOT_FOUND" | "TIMEOUT" | "BLOCKED";

const messages: Record<SmartstoreErrorCode, string> = {
  INVALID_URL: "올바른 네이버 스마트스토어 상품 URL을 입력해 주세요.",
  PRODUCT_NOT_FOUND: "상품 페이지를 찾을 수 없습니다.",
  PAGE_LOAD_FAILED: "네이버 상품 페이지에 접속하지 못했습니다.",
  DETAIL_AREA_NOT_FOUND: "상품 상세 영역을 찾을 수 없습니다.",
  TIMEOUT: "상품 페이지 추출 시간이 초과되었습니다.",
  BLOCKED: "네이버에서 페이지 접근을 차단했습니다.",
};

export class SmartstoreError extends Error {
  constructor(public code: SmartstoreErrorCode, options?: ErrorOptions) {
    super(messages[code], options);
    this.name = "SmartstoreError";
  }
}

export function errorStatus(code: SmartstoreErrorCode) {
  return { INVALID_URL: 400, PRODUCT_NOT_FOUND: 404, PAGE_LOAD_FAILED: 502, DETAIL_AREA_NOT_FOUND: 422, TIMEOUT: 504, BLOCKED: 403 }[code];
}
