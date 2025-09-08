# nb03-dearCarmate-team2

코드잇 스프린트 Node.js 백엔드 트랙 3기 2팀 중급 프로젝트 제출 레포지토리입니다.

<img width="1559" height="882" alt="image" src="https://github.com/user-attachments/assets/955d2c7b-593f-431d-ad60-a9000abeee38" />

## 프로젝트 계획서
[https://invented-heart-5fd.notion.site/253d94da4edb80ebb73cebaeab7f1ed5?pvs=74](https://invented-heart-5fd.notion.site/253d94da4edb80ebb73cebaeab7f1ed5?pvs=74)

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

#### 프로젝트 구조 설계

- Layered Architecture와 Typescript를 위한 프로젝트 구조 설계
- 프로젝트 초기 설정 : 디렉토리 구현화, app,ts, package.json, tsconfig
- 템플릿 코드 작성
- 협업을 위한 ESLint & Prettier 도입 및 설정

#### 보안

- bcrypt를 사용한 사용자 민감정보(비밀번호) 해싱 처리

#### 인증

- **JWT 기반** 인증&인가
- 일반 유저와 어드민 권한 분리
- **로그인** 기능
- **토큰 갱신** : 전달받은 토큰이 기간이 만료된 경우, 새로운 토큰을 발급하는 API

#### 유저 API

- **회원가입** : 전달받은 정보로 서비스에 회원 정보를 등록합니다
- **내 정보 조회** : 로그인한 사용자의 정보를 조회합니다
- **내 정보 수정** : 로그인한 사용자의 정보를 수정합니다
- **회원 탈퇴** : 로그인한 사용자를 서비스에서 제거합니다 (현재 사용중인 부분 없음)
- **유저 삭제** : 어드민 권한이 가진 유저가 특정 유저를 제거합니다

#### 회사 API

- 회사 API는 모두 어드민 권한이 필요합니다.
- **회사 등록** : 전달받은 정보로 서비스에 회사 정보를 등록합니다
- **회사 목록 조회** : 서비스에 등록된 회사들을 조건에 맞게 조회합니다
- **회사별 유저 조회** : 서비스에 등록된 유저들를 조건에 맞게 조회합니다
- **회사 수정** : 전달받은 정보로 회사 정보를 수정합니다
- **회사 삭제** : 특정 회사를 서비스에서 제거합니다

### 김나연

#### 공통 유효성 스키마

- 유틸적으로 이용될 수 있는 유효성 검사 기준을 선정: validators/utilValidator.ts

#### 차량 API

- **차량 등록**: 중복된 차량이 있는지 검사하고, 없으면 새 차량을 등록합니다.
- **차량 목록 조회**: 등록되어있는 차량 중 조건에 맞는 차량을 조회합니다.
- **차량 수정**: id가 일치하는 차량 정보를 수정합니다.
- **차량 삭제**: id가 일치하는 차량을 삭제합니다.
- **차량 상세 정보 조회**: id가 일치하는 차량의 상세 정보를 조회합니다.
- **차량 데이터 대용량 업로드**: csv 파일로 정리된 차량 데이터를 대량 등록합니다. `transaction`을 사용하여 올바르지 않은 정보가 있을 경우 전부 반환 처리합니다.
- **차량 모델 목록 조회**: 제조사 선택 후 모델 목록을 조회할 수 있습니다.

#### 이미지 API

- 이미지 업로드: 이미지를 등록하고, 프로필 이미지로 불러옵니다.

#### README.md

- README.md 작성

### 박재성

#### 스키마 및 목데이터

- 사전 설계한 ERD를 토대로 스키마 구현: schema.prisma
- 목데이터 및 시딩 코드 구성 : mock.ts, seed.ts

#### 미들웨어 및 유틸

- 전역 에러핸들러 미들웨어 및 커스텀 에러 클래스: errorHandler.ts, customErrorUtil.ts
- 대용량 파일(.csv) 업로드 및 파싱 미들웨어: csvUpload.ts, csvParse.ts
- 이메일 발송 유틸: emailUtil.ts

#### 계약서 API

- 계약서 업로드 : 계약서 파일을 추가하여 등록합니다.
- 계약서 다운로드 : 업로드 된 계약서 일부 혹은 전체를 다운로드 할 수 있습니다.
- 계약 목록 조회 : 등록된 계약과 계약서 목록을 확인할 수 있습니다.

#### 대시보드

- 이 달의 매출, 진행 중인 계약 수, 성사된 계약 수, 차량타입별 계약 수 및 매출액을 표시합니다.

### 김준철

#### 고객 관련 API

- **고객 등록**: 고객명, 성별, 연락처, 연령대, 지역, 이메일 등 고객 정보를 받아 새로운 고객 데이터를 생성합니다.
- **고객 수정**: 기존 고객의 정보를 수정하는 기능을 구현했습니다.
- **고객 상세 정보 조회**: 특정 고객의 상세 정보를 조회하는 기능을 구현했습니다.
- **고객 삭제**: 고객 정보를 안전하게 삭제하는 기능을 구현했습니다.
- **고객 목록 조회 및 검색**: 회사에 등록된 모든 고객 목록을 조회하는 API를 개발했습니다.
- **고객 대용량 업로드**: CSV 파일을 업로드하여 여러 고객 정보를 한 번에 등록하는 기능을 구현했습니다.

#### 계약 관련 API

- **계약 등록**: 차량, 고객, 미팅 일정(최대 3개) 등 계약에 필요한 정보를 받아 새로운 계약을 생성합니다.
- **계약 수정**: 기존 계약의 정보를 수정하는 기능을 구현했습니다. 차량, 고객, 미팅 일정 등 계약 관련 정보를 업데이트할 수 있습니다.
- **계약 삭제**: 등록된 계약 정보를 안전하게 삭제하는 기능을 개발했습니다.
- **계약 목록 조회 및 검색**: 회사에 등록된 모든 계약 목록을 조회하는 기능을 개발했습니다.
- **계약용 목록 조회**: 계약 등록에 필요한 차량, 고객, 유저 목록을 조회하는 API를 구현했습니다.

#### **프론트엔드 배포 (Vercel)**

프론트엔드 배포를 위해 **Vercel**을 선택했습니다. Vercel은 정적 사이트 및 서버리스 함수 배포에 최적화된 플랫폼으로, 몇 가지 주요 이점을 제공합니다.

- **쉬운 연동**: GitHub 리포지토리와 연동하여 코드가 업데이트될 때마다 자동으로 배포가 이루어지는 **CI/CD(지속적 통합/지속적 배포)** 파이프라인을 구축했습니다. 이로써 개발 생산성을 크게 향상시켰습니다.
- **빠른 속도**: Vercel의 글로벌 CDN(콘텐츠 전송 네트워크)을 통해 사용자가 어느 지역에 있든 빠르게 서비스에 접근할 수 있도록 했습니다.

#### **백엔드 배포 (Render)**

백엔드 배포는 **Render**를 이용했습니다. Render는 애플리케이션, 데이터베이스 등 다양한 서비스를 간편하게 배포할 수 있는 플랫폼입니다.

- **통합 환경**: **Render의 PostgreSQL 데이터베이스 서비스**를 사용하여 백엔드와 데이터베이스를 동일한 플랫폼 내에서 손쉽게 연결하고 관리할 수 있었습니다. 이는 배포 환경 구성의 복잡성을 크게 줄여주었습니다.
- **자동 배포**: 백엔드 리포지토리의 코드가 변경될 때마다 자동 배포가 이루어지도록 설정하여, 프론트엔드와 마찬가지로 효율적인 CI/CD 환경을 구축했습니다.

#### 깃허브 **Organization관리 & 프론트, 백엔드 레포지토리 관리**

- **GitHub Organization 관리**: 모든 팀원을 Organization에 초대하고, 각 팀원에게 필요한 권한(예: 리포지토리 접근, 브랜치 관리 권한)을 부여했습니다.
- **레포지토리 관리**: 프론트엔드와 백엔드 코드를 각각 별도의 리포지토리로 분리하여 관리했습니다.

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

## 배포(시연) 링크

https://dear-carmate-fe.vercel.app/

## 기타

- 발표 자료 : https://www.canva.com/design/DAGx-KbWRfM/oWu3ll3trksDj4AdNxaEag/edit?utm_content=DAGx-KbWRfM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
