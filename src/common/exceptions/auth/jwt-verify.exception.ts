export class JwtVerifyException extends Error {
  constructor() {
    super('Jwt verify failed');
  }
}
