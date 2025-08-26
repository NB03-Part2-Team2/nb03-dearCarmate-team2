export interface TokenDTO {
  userId: number;
}

export interface UpdateTokenDTO extends TokenDTO {
  requestRefreshToken: string;
}
