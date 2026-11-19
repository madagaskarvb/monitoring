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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const list: Site[] = await loadJson('sites.json')
      const results: { history: Run[] } = await loadJson('results.json')
      setSites(list)
      setHistory(results.history ?? [])
      setError('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchData()
  }, [fetchData])

  // Функция retry полностью удалена

  const monitoring = { sites, history, loading, error }

  return <MonitoringContext value={monitoring}>{children}</MonitoringContext>
}

export default MonitoringProvider