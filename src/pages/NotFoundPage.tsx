import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>Страница не найдена</h2>
      <p>Проверьте адрес или вернитесь на <Link to="/">главную</Link>.</p>
    </div>
  )
}