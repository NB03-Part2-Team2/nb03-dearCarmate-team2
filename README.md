# nb03-dearCarmate-team2

코드잇 스프린트 Node.js 백엔드 트랙 3기 2팀 중급 프로젝트 제출 레포지토리입니다.

https://www.notion.so/253d94da4edb80079278e388e0f99824

## 팀원 구성

- 천수 (https://github.com/Seracine)
- 김나연 (https://github.com/luciakim22)
- 박재성 (https://github.com/qkrwotjd1731)
- 김준철 (https://github.com/nodejun)

## 프로젝트 소개

- 프로젝트 기간: 2024.08.18 ~ 2024.09.09
- 목표: 유저(회사)와 고객 간의 신뢰 가능한 중고차 계약 관리 서비스 구축
- 주요 기능:
  - 사용자 인증(어드민, 회사 대표, 회사 직원)
  - 차량 등록
  - 고객 등록
  - 계약 상태 관리
  - 계약서 업로드 및 관리
  - 알림 메일 전송
  - DB 트랜잭션 및 최적화

## 기술 스택

| 분류       | 사용 도구                                |
| ---------- | ---------------------------------------- |
| Backend    | Node.js (Express),Typescript             |
| Database   | PostgerSQL, Prisma(ORM)                  |
| API 문서화 | Notion                                   |
| 협업 도구  | Discord, GitHub, Notion, ESLint&Prettier |
| 일정 관리  | Notion 타임라인                          |
| 배포       | Vercel(프론트), Render(백엔드)           |
| 인증/인가  | JWT 토큰 기반                            |

## 팀원별 구현 기능 상세

### 천수

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- 프로젝트 구조 설계
- ESLint & Prettier 설정
- 보안
- API(인증, 유저, 회사)

### 김나연

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- README.md
- 공통 유효성 스키마
- API(차량, 이미지 업로드)

### 박재성

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- 미들웨어 Utill(csv 파싱, 이메일 발송)
- 스키마 및 목데이터
- 에러 핸들러
- API(계약서, 대시보드)

### 김준철

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- Github 레포지토리 설정
- 프론트&백엔드 배포 설계 및 테스트
- API(계약, 고객)

### 공통

- ERD 설계
- API 명세서

## 파일 구조

```
.
├── .vscode/                         # VS Code 설정 파일
├── .env                             # 환경 변수 설정 파일 (민감 정보 포함, Git 추적 제외)
├── .env.example                     # 환경 변수 설정 예시
├── .eslintrc                        # ESLint 설정 파일 (코드 문법 및 스타일 검사)
├── .gitignore                       # Git으로 관리하지 않을 파일 및 폴더 지정
├── .prettierignore                  # Prettier로 포맷팅하지 않을 파일 지정
├── .prettierrc                      # Prettier 포맷팅 규칙 설정
├── app.ts                           # Express 애플리케이션의 핵심 진입점
├── document/                        # 계약서 업로드 폴더
├── node_modules/                    # 프로젝트 의존성 패키지
├── prisma/                          # Prisma ORM 관련 파일
│ ├── migrations/                    # 데이터베이스 스키마 변경 이력 관리
│ ├── seed.ts                        # 데이터베이스에 초기 데이터를 주입하는 시드 스크립트
│ ├── mockData/                      # 테스트 및 개발용 목데이터 파일
│ └── schema.prisma                  # 데이터베이스 모델 및 관계 정의
├── public/                          # 이미지 업로드 폴더
├── src/                             # 프로젝트의 모든 소스 코드
│ ├── controllers/                   # 클라이언트 요청을 받아 서비스 로직을 호출하는 역할
│ ├── generated/                     # Prisma 클라이언트 등 자동 생성된 파일
│ ├── libs/                          # 외부 라이브러리 확장 또는 헬퍼 함수(Prisma 인스턴스 생성 파일)
│ ├── middlewares/                   # 요청과 응답 사이에서 공통 기능을 처리 (예: 인증, 에러 핸들러)
│ ├── repositories/                  # 데이터베이스에 직접 접근하여 데이터 처리 (Prisma 클라이언트 사용)
│ ├── routes/                        # API 엔드포인트 정의 및 요청을 컨트롤러에 연결
│ ├── services/                      # 비즈니스 로직을 구현 (컨트롤러와 리포지토리 연결)
│ ├── types/                         # 타입스크립트 타입 정의
│ ├── utils/                         # 여러 곳에서 재사용되는 유틸리티 함수 및 클래스
│ └── validators/                    # 데이터 유효성 검사 로직, 스키마
├── tsconfig.json                    # 타입스크립트 컴파일러 설정
├── package-lock.json                # 의존성 버전 고정 파일
├── package.json                     # 프로젝트 의존성 목록 및 스크립트
└── README.md                        # 프로젝트 개요 및 문서
```

## 실행 방법

1. 환경 변수

.env 예시:

```
# port
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/dear_carmate?schema=public"

# JWT Secret
JWT_SECRET="supersecretstring"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password-here"
```

2. 설치 및 마이그레이션

```
npm i
npx prisma migrate dev
```

3. 서버 실행

```
npm run dev
```

## 구현 홈페이지

https://dear-carmate-fe.vercel.app/

## 프로젝트 회고록

(제작한 발표자료 링크 혹은 첨부파일 첨부)
