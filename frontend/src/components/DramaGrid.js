"use client"

import DramaCard from "./DramaCard"

const DramaGrid = ({ dramas, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка дорам...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Ошибка: {error}</p>
      </div>
    )
  }

  if (!dramas || dramas.length === 0) {
    return (
      <div className="empty-container">
        <p>Дорамы не найдены</p>
      </div>
    )
  }

  return (
    <div className="drama-grid">
      {dramas.map((drama) => {
        // Убедимся, что у дорамы есть изображение или заполнитель
        const dramaWithImage = {
          ...drama,
          image:
            drama.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(drama.title || "Дорама")}`,
        }

        return <DramaCard key={drama._id || drama.id || Math.random().toString()} drama={dramaWithImage} />
      })}
    </div>
  )
}

export default DramaGrid
