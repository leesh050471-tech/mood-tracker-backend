# mood-tracker-backend

오늘 기분 기록기의 백엔드. Next.js Route Handler + SQLite(`node:sqlite`, Node 22.13+ / 24 권장) 로 만든 API 서버예요.
데이터는 `data/mood.db` 파일 하나에 저장돼요 (`.gitignore` 처리됨).

## 실행

```bash
npm install
npm run dev   # http://localhost:4000
```

## 환경변수

| 이름 | 기본값 | 설명 |
|---|---|---|
| `ALLOWED_ORIGIN` | `http://localhost:3000` | CORS로 허용할 프론트엔드 주소 |

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/moods?limit=60` | 기록 목록 (최신순) |
| POST | `/api/moods` | `{ date: "YYYY-MM-DD", score: 1~5, note?: string }` 저장 (같은 날짜는 덮어씀) |
| DELETE | `/api/moods?date=YYYY-MM-DD` | 기록 삭제 |

프론트엔드: [mood-tracker-frontend](../mood-tracker-frontend)
