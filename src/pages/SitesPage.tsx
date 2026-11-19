import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { statusText } from '../statusText'

export default function SitesPage() {
  const { sites, last, error } = useMonitoring()

  if (error) {
    return <p className="load-error">{error}</p>
  }

  const failedCount = last?.checks.filter((c) => !c.ok).length || 0
  const totalCount = sites.length

  return (
    <>
      {failedCount > 0 && (
        <div className="alert alert--error">
          Не открываются: {failedCount} из {totalCount}
        </div>
      )}
      
      <ul className="sites">
        {sites.map((site) => {
          const check = last?.checks.find((c) => c.id === site.id)
          return (
            <li key={site.id} className={check?.ok ? 'site' : 'site site--bad'}>
              <span className="site__status">{statusText(check)}</span>
              <Link to={`/site/${site.id}`} className="site__link">
                <h2>{site.name}</h2>
                <span className="site__url">{site.url}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}