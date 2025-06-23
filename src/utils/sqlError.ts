export class DbError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "DB_ERROR", status = 500) {
    super(message);
    this.code = code;
    this.status = status;

    Object.setPrototypeOf(this, DbError.prototype);
  }
}
