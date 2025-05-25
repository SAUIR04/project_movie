import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Извините, запрашиваемая страница не существует.</p>
      <Link to="/" className="btn">
        Вернуться на главную
      </Link>
    </div>
  )
}

export default NotFound
