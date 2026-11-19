import { useEffect, useState } from 'react'
import type { Site } from './types'

function App() {
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
                const response = await fetch(`${import.meta.env.BASE_URL}data/sites.json`)
        if (!response.ok) {
          throw new Error(`Список сайтов не загрузился: код ${response.status}.`)
        }
        const list: Site[] = await response.json()
        if (!ignore) {
          setSites(list)
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

  return (
    <>
      <header className="header">
        <h1>Мониторинг сайтов группы</h1>
        <p>Сайты, которые студенты группы опубликовали на GitHub Pages</p>
      </header>
      <main className="main">
        {error !== '' && <p className="load-error">{error}</p>}
        <ul className="sites">
          {sites.map((site) => (
            <li key={site.id} className="site">
              <h2>{site.name}</h2>
              <a href={site.url} target="_blank" rel="noreferrer">
                {site.url}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App