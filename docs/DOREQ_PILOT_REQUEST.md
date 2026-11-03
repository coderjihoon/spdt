# DoReq 스마트스토어 상세 본문 파일럿 문의 초안

수신: admin@doreq.com (DoReq 공식 사이트의 Contact sales 버튼)

제목: Naver Smart Store full seller-detail pilot for URL-only diagnosis

Hello DoReq team,

We are building SPDT, a service where a customer submits only a public Naver
Smart Store or Brand Store product URL and receives an automated detail-page
diagnosis. Our server needs the seller-authored **full detail body**, including
text and original image URLs in display order. Product title, price, hero images,
reviews, and seller metadata alone do not meet this requirement.

Could you provide a pilot endpoint and confirm whether your `/fetch` storefront
HTML, channel product JSON, or a custom endpoint supplies this body for arbitrary
public sellers without our customers linking a Naver account? The pilot should
start with this product:

https://smartstore.naver.com/deopocket/products/13634965251

Please show which response field or HTML section contains the full seller detail
body and whether it includes content hidden behind “상세정보 펼쳐보기” on the page.
We need to distinguish a text-only body, mixed text and images, long/lazy content,
and a seller-inserted banner for another product. A raw, complete HTML/JSON body
is fine; we can parse it on our side.

If that succeeds, we would like to validate at least 20 products from distinct
Smart Store sellers and 5 Brand Store products, with repeated requests at
different times. We also need to know how to resolve the internal channel URL
from the customer-facing product URL if more than one API call is required.

Please share:

1. Pilot access, fees, and any minimum purchase or monthly commitment.
2. Per-request prices at approximately 10, 100, and 1,000 requests/day. These
   are planning scenarios, not committed volume.
3. Expected and P95 response time, concurrent request limits, and how you report
   a Naver login/security/error page instead of a valid product.
4. Retry charges, caching/freshness, and retention of submitted URLs and results.
5. Whether this diagnostic use of the returned data is permitted under your terms.

We will not provide Naver account credentials or browser cookies. We will not
put the API into the customer application until the pilot demonstrates complete
seller detail coverage.

Best regards,
SPDT team

## 내부 판정 기준

- 데오포켓의 로그인된 Chrome 화면에서 확인한 판매자 본문을 기준으로 텍스트와 이미지
  URL의 누락 여부 및 표시 순서를 대조한다.
- 응답에 상품명·가격·대표 이미지·리뷰만 있으면 불합격이다.
- 텍스트 전용 상품, 펼치기 없는 상품, 브랜드스토어, 긴 이미지형 상세와 다른 상품
  배너를 포함한 상품을 각기 검증한다.
- 제품별 실패 코드, 수집 지연, 재시도 비용을 기록한다.
- 합격 후에만 기존 `collecting` 작업과 `processNaverJob`에 연결하고, 운영자
  Chrome을 끈 상태에서 히어로 URL 신청부터 보고서와 이메일까지 실증한다.
