export enum HttpStatusCode {
  unauthorized = 401,
  ok = 200,
  noContent = 204,
  badRequest = 400,
  serverError = 500,
  notFound = 404
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCode
  body?: T
}
