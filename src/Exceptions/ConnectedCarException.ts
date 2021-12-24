/**
 * @class SyncException
 * @extends Error
 */
export class ConnectedCarException extends Error {
  public SyncErrorStatus: number;

  public SyncErrorMessage: string;

  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.SyncErrorStatus = status;
    this.SyncErrorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
