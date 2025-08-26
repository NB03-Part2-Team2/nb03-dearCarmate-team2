// CSV 파싱 결과 타입
export interface CSVParsedData {
  headers: string[];
  data: Record<string, string | number | boolean | null>[];
}
