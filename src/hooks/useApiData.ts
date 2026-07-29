'use client';

import { useState, useEffect } from 'react';

interface UseApiDataResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isFallback: boolean;
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  fallbackData: T,
  deps: any[] = []
): UseApiDataResult<T> {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      if (result !== undefined && result !== null) {
        setData(result);
        setIsFallback(false);
      } else {
        setData(fallbackData);
        setIsFallback(true);
      }
    } catch (err: any) {
      console.warn('API Fetch failed, using fallback data:', err);
      setError(err);
      setData(fallbackData);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-deps
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: loadData,
    isFallback,
  };
}
