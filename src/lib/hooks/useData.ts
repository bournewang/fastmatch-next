'use client'

import useSWR from 'swr'
import { useToast } from '@/components/ToastProvider'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('请求失败')
    error.cause = await res.json()
    throw error
  }
  return res.json()
}

export function useData<T>(
  url: string | null,
  options: {
    refreshInterval?: number
    errorMessage?: string
  } = {}
) {
  const { showToast } = useToast()
  const { errorMessage = '数据加载失败', ...swrOptions } = options

  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    fetcher,
    {
      onError: () => showToast(errorMessage, 'error'),
      ...swrOptions
    }
  )

  return {
    data,
    error,
    loading: isLoading,
    mutate
  }
} 