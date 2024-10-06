export class JwtVerifyException extends Error {
  constructor(message: string) {
    super(message);
  }
}
