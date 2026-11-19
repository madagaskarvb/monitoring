import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { sitesWord } from '../plural'
import { statusText } from '../status'

function SitesPage() {
  const { sites, history, loading, error } = useMonitoring()

  if (loading) {
    return <p className="empty">Загрузка результатов…</p>
  }
  if (error !== '') {
    return <p className="load-error">{error}</p>
  }

  const last = history[0]
  const down = sites.filter((site) => !last?.checks.find((c) => c.id === site.id)?.ok).length
  let summary = `Все ${sites.length} ${sitesWord(sites.length)} открываются`
  if (last === undefined) {
    summary = 'Проверок ещё не было'
  } else if (down > 0) {
    summary = `Не открываются: ${down} из ${sites.length}`
  }

  return (
    <>
      <p className={last !== undefined && down > 0 ? 'summary summary--bad' : 'summary'}>
        {summary}
      </p>
      <div className="sites">
        {sites.map((site) => {
          const check = last?.checks.find((c) => c.id === site.id)
          return (
            <Link key={site.id} to={`/site/${site.id}`} className={check?.ok ? 'site' : 'site site--bad'}>
              <span className="site__status">{statusText(check)}</span>
              <h2>{site.name}</h2>
              <span className="site__url">{site.url}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default SitesPage