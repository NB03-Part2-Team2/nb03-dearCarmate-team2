# CSV 파싱 미들웨어

- CSV 파일 업로드 및 파싱
- 기본적인 CSV 형식 검증
- CustomError를 통한 일관된 에러 처리

## 사용 방법

### 1. 라우터에서 미들웨어 사용

```typescript
import { Router } from 'express';
import { csvParse } from '../middlewares/csvParse';
import { uploadCSV } from '../middlewares/csvUpload';
import { uploadExampleList } from '../controllers/exampleController';

const exampleRouter = Router();

// CSV 파일 업로드 및 파싱 처리
exampleRouter.post('/upload', uploadCSV.single('file'), csvParse, uploadExampleList);

export default exampleRouter;
```

### 2. 컨트롤러에서 파싱된 데이터 사용

```typescript
export const uploadExampleList = (req: Request, res: Response) => {
  // 미들웨어에서 파싱된 데이터를 가져옴
  const parsedData = req.parsedData;

  // parsedData는 객체 배열입니다
  // 예: [{ 이름: "김코드", 나이: 25, 성별: "남성" }, ...]
};
```

## 사용 예시

### 요청

```http
POST http://localhost:3000/api/example/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="test.csv"
Content-Type: text/csv

< ./test.csv
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## 검증 규칙

- CSV 파일이 업로드되어야 함
- 헤더와 최소 1개의 데이터 행이 필요함
- 파일 크기: 최대 5MB
- 파일 형식: CSV 파일만

## 에러 처리

- **400 Bad Request**: CSV 형식 오류, 파싱 오류, 파일 업로드 오류
- **500 Internal Server Error**: 예상치 못한 오류
