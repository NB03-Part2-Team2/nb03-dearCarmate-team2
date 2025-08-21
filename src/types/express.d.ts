declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
      },
      auth?: {
        userId: number
      },
    }
  }
}