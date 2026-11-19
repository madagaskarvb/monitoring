import { useEffect, useState } from 'react'
import type { Check, Run, Site } from './types'

async function loadJson(name: string) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`)
  if (!response.ok) {
    throw new Error(`Файл ${name} не загрузился: код ${response.status}.`)
  }
  return response.json()
}

function statusText(check: Check | undefined) {
  if (check === undefined) {
    return 'Не проверялся'
  }
  if (check.ok) {
    return `Работает · ${check.ms} мс`
  }
  return `Не открывается · ${check.status || check.error}`
}

function App() {
  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Run[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const list: Site[] = await loadJson('sites.json')
        const results: { history: Run[] } = await loadJson('results.json')
        if (!ignore) {
          setSites(list)
          setHistory(results.history)
        }
      } catch (e) {
        if (!ignore) {
          setError((e as Error).message)
        }
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const last = history[0]

  return (
    <>
      <header className="header">
        <h1>Мониторинг сайтов группы</h1>
        <p>
          {last === undefined
            ? 'Проверок ещё не было'
            : `Последняя проверка: ${new Date(last.time).toLocaleString('ru')}`}
        </p>
      </header>
      <main className="main">
        {error !== '' && <p className="load-error">{error}</p>}
        <ul className="sites">
          {sites.map((site) => {
            const check = last?.checks.find((c) => c.id === site.id)
            return (
              <li key={site.id} className={check?.ok ? 'site' : 'site site--bad'}>
                <span className="site__status">{statusText(check)}</span>
                <h2>{site.name}</h2>
                <a href={site.url} target="_blank" rel="noreferrer">
                  {site.url}
                </a>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}

export default App