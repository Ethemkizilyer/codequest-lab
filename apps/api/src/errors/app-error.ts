export type AppErrorDetails = unknown;

export interface AppErrorOptions {
  statusCode: number;
  code: string;
  message: string;
  details?: AppErrorDetails;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: AppErrorDetails;

  public constructor(options: AppErrorOptions) {
    super(options.message);

    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}