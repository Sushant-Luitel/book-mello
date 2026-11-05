export class ServiceError extends Error {
  constructor(message: string, public status: 400 | 403 | 404 | 500 = 500) {
    super(message);
  }
}
