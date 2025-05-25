"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { FavoritesContext } from "../contexts/FavoritesContext"
import DramaGrid from "../components/DramaGrid"

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext)

  return (
    <div className="favorites-page">
      <h1>Избранные дорамы</h1>

      {favorites.length === 0 ? (
        <div className="empty-container">
          <p>У вас пока нет избранных дорам</p>
          <Link to="/" className="btn">
            Перейти к списку дорам
          </Link>
        </div>
      ) : (
        <DramaGrid dramas={favorites} loading={false} error={null} />
      )}
    </div>
  )
}

export default Favorites
