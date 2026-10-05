# 진단 결과 이메일

진단 결과가 저장된 뒤 `wlgnsrbrb@gmail.com`에서 신청 이메일에 진단서 링크를 보냅니다. HTML과 일반 텍스트 본문을 함께 제공합니다. 발송이 실패해도 진단은 완료 상태로 유지되고 결과 화면으로 이동합니다. 도메인 구매나 Resend 키는 필요하지 않습니다.

## 설정

1. `supabase/migrations/20261003000000_diagnosis_email.sql`과 `supabase/migrations/20261003000001_gmail_email_lock.sql`을 적용합니다.
2. `wlgnsrbrb@gmail.com`의 Google 계정에서 2단계 인증을 설정하고 `상페닥터`용 앱 비밀번호를 발급합니다. 일반 로그인 비밀번호는 사용하지 않습니다.
3. `.env.local`과 Vercel 운영 환경에 다음 값을 설정합니다.
   - `GMAIL_USER=wlgnsrbrb@gmail.com`
   - `GMAIL_APP_PASSWORD`: 해당 계정의 앱 비밀번호. 표시된 공백은 자동으로 제거합니다.
   - `NEXT_PUBLIC_SITE_URL=https://spdt.vercel.app`: 메일에 넣을 운영 사이트 주소
4. 설정을 반영한 코드로 배포합니다. 앱 비밀번호를 설정하기 전에는 실제 발송하지 않습니다.

Gmail SMTP에 TLS로 연결하며 비밀번호를 클라이언트나 로그에 공개하지 않습니다. 발신 주소와 회신 주소는 같은 Gmail 계정입니다. 링크는 요청의 Host 헤더 대신 설정된 운영 주소로 만듭니다. 기존 진단서에는 일괄 발송하지 않습니다.

## 발송 상태와 재시도

`diagnoses.email_id`는 SMTP Message-ID이며, `email_sent_at`은 Gmail이 발송 요청을 수락한 시간입니다. 받은편지함 도착을 보장하는 값은 아닙니다. 실패하면 `email_error`에 개인정보 없는 오류 코드를 저장합니다.

발송 전에 DB의 `email_sending_at`을 원자적으로 설정합니다.

발송 중이거나 발송 기록이 있는 진단은 건너뛰어 동시 요청에서 중복 발송을 막습니다. 인증 실패나 수신 거절처럼 수락되지 않았음이 확인된 오류는 잠금을 풀어 관리자 신청 목록의 `발송 재시도`로 다시 시도할 수 있습니다. 완료된 진단의 `POST /api/diagnoses/{access_token}/run`으로도 재시도할 수 있으며 재진단은 하지 않습니다.

SMTP 응답 유실이나 Gmail 수락 후 DB 저장 실패는 `발송 확인 필요`로 표시하고 잠금을 유지합니다. SMTP에는 Resend와 같은 idempotency key 기능이 없으므로 자동 재발송하지 않습니다. 해당 Gmail의 보낸편지함에서 `rfc822msgid:diagnosis.{access_token}@gmail.com`으로 확인한 뒤, 발송되었다면 `email_id`와 `email_sent_at`을 기록하고, 미발송이 확인되었을 때만 `email_sending_at`을 비워 재시도합니다.

공식 문서: [Google 앱 비밀번호](https://support.google.com/accounts/answer/185833?hl=ko), [Nodemailer SMTP](https://nodemailer.com/smtp).
