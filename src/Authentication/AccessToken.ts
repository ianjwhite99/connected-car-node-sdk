/**
 * @class AccessToken
 */
export class AccessToken {
  private value: string;

  private expiresAt: Date;

  private refreshToken: string;

  constructor(accessToken: string, expiresAt: number, refreshToken: string) {
    this.value = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = this.setExpiresAtFromTimeStamp(expiresAt);
  }

  /**
   * Set the expiresAt based on passed timestamp
   *
   * @returns date
   */
  public setExpiresAtFromTimeStamp(expiresAt: number): Date {
    const date = new Date();
    date.setSeconds(date.getSeconds() + expiresAt);
    return date;
  }

  /**
   * Check if access token is expired
   *
   * @returns boolean
   */
  public isExpired(): boolean {
    const date = new Date();
    if (date > this.expiresAt) return true;
    return false;
  }

  /**
   * Get accessToken value
   *
   * @returns this.value
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Get expiration date
   *
   * @returns this.expiresAt
   */
  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  /**
   * Get refresh token
   *
   * @returns this.refreshToken
   */
  public getRefreshToken(): string {
    return this.refreshToken;
  }
}
