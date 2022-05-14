export enum HttpStatusCode {
  unathorized = 401,
  ok = 200,
  noContent = 204,
  badRequest = 400,
  serverError = 500,
  notFound = 404
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: any
}
