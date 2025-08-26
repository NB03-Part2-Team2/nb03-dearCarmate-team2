declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
      auth?: {
        userId: number;
      };
      parsedData?: Record<string, string | number | boolean | null>[];
    }
  }
}

export {};
