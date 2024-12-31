export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof APIError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.status }
    )
  }

  return Response.json(
    { error: '服务器错误，请稍后重试' },
    { status: 500 }
  )
} 