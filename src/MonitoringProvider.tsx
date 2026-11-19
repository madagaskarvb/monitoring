import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { MonitoringContext } from './monitoring'
import type { Run, Site } from './types'

async function loadJson(name: string) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!response.ok) {
    throw new Error(`Файл ${name} не загрузился: код ${response.status}.`)
  }
  return response.json()
}

type MonitoringProviderProps = {
  children: ReactNode
}

function MonitoringProvider({ children }: MonitoringProviderProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Run[]>([])
  // Инициализируем loading как true, чтобы первый рендер показывал загрузку
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Эта функция только делает запрос и обновляет данные ПОСЛЕ await
  const fetchData = useCallback(async () => {
    try {
      const list: Site[] = await loadJson('sites.json')
      const results: { history: Run[] } = await loadJson('results.json')
      setSites(list)
      setHistory(results.history ?? [])
      setError('') // Очищаем ошибку при успехе
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Эффект просто вызывает fetchData, без синхронных setState
   useEffect(() => {
    async function load() {
      await fetchData()
    }
    load()
  }, [fetchData])

  // Функция retry вызывается из обработчика событий (например, клика),
  // поэтому синхронный setState здесь безопасен и не вызывает предупреждений.
  const retry = useCallback(() => {
    setLoading(true)
    setError('')
    fetchData()
  }, [fetchData])

  const last = history[0]

  const monitoring = { sites, history, last, loading, error, retry }

  return <MonitoringContext value={monitoring}>{children}</MonitoringContext>
}

export default MonitoringProvider