type CacheData = {
  data: any
  timestamp: number
}

const CACHE_DURATION = 30 * 60 * 1000 // 5 minutes

export const cache = {
  set: (key: string, data: any) => {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  get: (key: string) => {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const { data, timestamp }: CacheData = JSON.parse(cached)
      const isExpired = Date.now() - timestamp > CACHE_DURATION

      if (isExpired) {
        localStorage.removeItem(key)
        return null
      }

      return data
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Cache remove error:', error)
    }
  }
} 