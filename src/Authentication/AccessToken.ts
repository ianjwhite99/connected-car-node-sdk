/**
 * @class AccessToken
 */
export class AccessToken {
  private value: string;
  private expiresAt: Date;
  private refreshToken: string;
  private refreshExpiresAt: Date;
  private fordConsumerId: string;

  constructor(
    accessToken: string,
    expiresIn: number,
    refreshToken: string,
    refreshExpiresIn: number,
    fordConsumerId: string
  ) {
    this.value = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = this.setExpiresAtFromTimeStamp(expiresIn);
    this.refreshExpiresAt = this.setExpiresAtFromTimeStamp(refreshExpiresIn);
    this.fordConsumerId = fordConsumerId;
  }

  /**
   * Set the expiresAt based on passed timestamp
   *
   * @returns date
   */
  public setExpiresAtFromTimeStamp(expiresIn: number): Date {
    const date = new Date();
    date.setSeconds(date.getSeconds() + expiresIn);
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
   * Check if refresh token is expired
   *
   * @returns boolean
   */
  public refreshIsExpired(): boolean {
    const date = new Date();
    if (date > this.refreshExpiresAt) return true;
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
   * Get refresh expiration date
   *
   * @returns this.refreshExpiresAt
   */
  public getRefreshExpiresAt(): Date {
    return this.refreshExpiresAt;
  }

  /**
   * Get refresh token
   *
   * @returns this.refreshToken
   */
  public getRefreshToken(): string {
    return this.refreshToken;
  }

  /**
   * Get ford consumer id
   *
   * @returns this.fordConsumerId
   */
  public getFordConsumerId(): string {
    return this.fordConsumerId;
  }
}
