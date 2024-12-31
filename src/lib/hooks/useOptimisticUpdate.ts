'use client'

import { useState } from 'react'
import { useToast } from '@/components/ToastProvider'

interface UseOptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useOptimisticUpdate<T>(
  updateFn: () => Promise<T>,
  options: UseOptimisticUpdateOptions<T> = {}
) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const {
    onSuccess,
    onError,
    successMessage = '更新成功',
    errorMessage = '更新失败，请重试'
  } = options

  const execute = async () => {
    setLoading(true)
    try {
      const result = await updateFn()
      showToast(successMessage, 'success')
      onSuccess?.(result)
      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error(errorMessage)
      showToast(errorMessage, 'error')
      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    execute,
    loading
  }
} 