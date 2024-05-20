
export type TErrorIssue = {
  path: string | number
  message: string
}
export type TErrorResponse = {
    statusCode: number
    status: 'error' | 'fail'
    message: string
    issues: TErrorIssue[]
  }