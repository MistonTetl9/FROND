export interface ApiResponse<T> {
  code: number
  message: string
  res: T
  dateTime: string
}
