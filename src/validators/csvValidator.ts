import { CustomError } from '../utils/customErrorUtil';

export class CSVValidator {
  // CSV 형식 검증
  static validateCSVString(csvContent: string): void {
    // 줄바꿈 문자 처리
    const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== '');

    if (lines.length < 2) {
      throw CustomError.badRequest('CSV에는 헤더와 최소 1개의 데이터 행이 필요합니다.');
    }

    // 헤더에 쉼표가 있는지 확인
    const header = lines[0];
    if (!header.includes(',')) {
      throw CustomError.badRequest('CSV 헤더에 쉼표가 없습니다.');
    }
  }
}
