import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { statusText } from '../status'

export default function SitePage() {
  const { id } = useParams<{ id: string }>()
  const { sites, history } = useMonitoring()

  const site = sites.find((s) => s.id === id)

  if (!site) {
    return <div className="not-found">Сайт не найден</div>
  }

  const siteHistory = history.map((run) => {
    const check = run.checks.find((c) => c.id === id)
    return { time: run.time, check }
  }).filter((item) => item.check !== undefined)

  const totalChecks = siteHistory.length
  const okChecks = siteHistory.filter((item) => item.check?.ok).length

  return (
    <div className="site-detail">
      <Link to="/" className="back-link">← Все сайты</Link>
      
      <h2 className="site-detail__title">{site.name}</h2>
      <a href={site.url} target="_blank" rel="noreferrer" className="site-detail__url">
        {site.url}
      </a>
      
      {/* ИСПОЛЬЗУЕМ ШАБЛОННУЮ СТРОКУ ЗДЕСЬ */}
      <p className="site-detail__summary">
        {`Открывался в ${okChecks} из ${totalChecks} последних проверок.`}
      </p>

      <table className="checks-table">
        <thead>
          <tr>
            <th>Проверка</th>
            <th>Результат</th>
          </tr>
        </thead>
        <tbody>
          {siteHistory.map(({ time, check }) => (
            <tr key={time} className={check?.ok ? 'row-ok' : 'row-bad'}>
              <td>{new Date(time).toLocaleString('ru')}</td>
              <td>{statusText(check)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}