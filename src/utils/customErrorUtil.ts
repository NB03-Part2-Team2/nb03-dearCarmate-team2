export class CustomError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }

  // 400 Bad Request
  static badRequest(message?: string): CustomError {
    if (message) {
      return new CustomError(message, 400);
    }
    return new CustomError('잘못된 요청입니다.', 400);
  }

  // 404 Not Found
  static notFound(message?: string): CustomError {
    if (message) {
      return new CustomError(message, 404);
    }
    return new CustomError('존재하지 않는 리소스입니다.', 404);
  }

  // 401 Unauthorized
  static unauthorized(message?: string): CustomError {
    if (message) {
      return new CustomError(message, 401);
    }
    return new CustomError('로그인이 필요합니다.', 401);
  }

  // 403 Forbidden
  static forbidden(message?: string): CustomError {
    if (message) {
      return new CustomError(message, 403);
    }
    return new CustomError('담당자만 수정이 가능합니다.', 403);
  }

  // 409 Conflict
  static conflict(message?: string): CustomError {
    console.log('CustomError.conflict called with message:', message);
    if (message) {
      console.log('메세지 있을때:', message);
      return new CustomError(message, 409);
    }
    console.log('메세지 없을때');
    return new CustomError('이미 존재하는 리소스입니다.', 409);
  }
}
