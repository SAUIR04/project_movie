"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa"
import { AuthContext } from "../contexts/AuthContext"
import { FavoritesContext } from "../contexts/FavoritesContext"
import { toast } from "react-toastify"

const DramaCard = ({ drama }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavoritesContext)

  // Проверяем, что drama существует и имеет _id или id
  if (!drama || (!drama._id && !drama.id)) {
    console.error("Некорректные данные дорамы:", drama)
    return null
  }

  // Используем _id или id в зависимости от того, что доступно
  const dramaId = drama._id || drama.id

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Войдите, чтобы добавить в избранное")
      return
    }

    if (isFavorite(dramaId)) {
      removeFromFavorites(dramaId)
      toast.success("Удалено из избранного")
    } else {
      addToFavorites(drama)
      toast.success("Добавлено в избранное")
    }
  }

  return (
    <div className="drama-card">
      <Link to={`/dramas/${dramaId}`} className="drama-card-link">
        <div className="drama-image-container">
          <img
            src={
              drama.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(drama.title || "Дорама")}`
            }
            alt={drama.title}
            className="drama-image"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(drama.title || "Дорама")}`
            }}
          />
          <div className="drama-rating">
            <FaStar className="star-icon" /> {drama.rating ? drama.rating.toFixed(1) : "0.0"}
          </div>
          <button
            className="favorite-button"
            onClick={handleFavoriteClick}
            aria-label={isFavorite(dramaId) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite(dramaId) ? <FaHeart className="heart-icon filled" /> : <FaRegHeart className="heart-icon" />}
          </button>
        </div>
        <div className="drama-info">
          <h3 className="drama-title">{drama.title}</h3>
          <div className="drama-meta">
            <span className="drama-year">
              {drama.releaseDate ? new Date(drama.releaseDate).getFullYear() : "Год не указан"}
            </span>
            <span className="drama-genres">
              {drama.genre && Array.isArray(drama.genre) && drama.genre.length > 0
                ? drama.genre.slice(0, 2).join(", ")
                : "Жанр не указан"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default DramaCard
