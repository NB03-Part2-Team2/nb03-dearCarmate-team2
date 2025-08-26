import * as Papa from 'papaparse';
import { CustomError } from './customErrorUtil';
import type { CSVParsedData } from '../types/csvParseType';

export class CSVParserUtil {
  /** CSV 문자열을 객체 배열로 변환
   * papaparse 라이브러리가 CSV 문자열을 파싱하여 객체 배열로 변환해줍니다.
   * 참고: https://www.papaparse.com/
   *
   * Papa.parse 결과(result) 구조:
   * {
   *   data: [...],    // 정상적으로 파싱된 데이터
   *   errors: [...],  // 에러 목록
   *   meta: {...}     // 컬럼 정보 등 메타데이터
   * }
   * */
  static parseCSVString(csvContent: string): CSVParsedData {
    const result = Papa.parse(csvContent, {
      header: true, // 첫 줄을 헤더(컬럼명)으로 인식
      skipEmptyLines: true, // 비어있는 줄은 무시
      dynamicTyping: true, // 데이터 타입 자동 변환
    });

    if (result.errors.length > 0) {
      throw CustomError.badRequest(`CSV 파싱 오류: ${result.errors[0].message}`);
    }

    // meta.fields를 사용해서 헤더 가져오기
    const headers = result.meta.fields || [];
    const data = result.data as Record<string, string | number | boolean | null>[];

    return {
      headers,
      data,
    };
  }
}
