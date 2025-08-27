import { Request, Response, NextFunction } from 'express';
import { validateCSVString } from '../validators/csvValidator';
import { CSVParserUtil } from '../utils/csvParseUtil';
import { CustomError } from '../utils/customErrorUtil';

// CSV 파일 업로드를 객체 배열로 변환하는 미들웨어
export const csvParse = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw CustomError.badRequest('CSV 파일이 업로드되지 않았습니다.');
  }

  // 파일 내용을 문자열로 변환
  const csvContent = req.file.buffer.toString('utf-8');

  // 1. CSV 문자열 검증
  validateCSVString(csvContent);

  // 2. CSV 파싱
  const parsedData = CSVParserUtil.parseCSVString(csvContent);

  // 3. 파싱된 데이터를 request 객체에 추가
  req.parsedData = parsedData.data;

  next();
};
