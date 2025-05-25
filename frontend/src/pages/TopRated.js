"use client"

import { useState, useEffect } from "react"
import DramaGrid from "../components/DramaGrid"
import { getTopRated } from "../utils/api"
import { toast } from "react-toastify"

const TopRated = () => {
  const [dramas, setDramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Функция для обработки отсутствующих изображений
  const processImageUrls = (dramaList) => {
    if (!Array.isArray(dramaList)) return []

    return dramaList.map((drama) => ({
      ...drama,
      image: drama.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(drama.title || "Дорама")}`,
    }))
  }

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true)
        console.log("Загрузка топ-рейтинговых дорам...")

        // Не передаем токен, так как маршрут теперь публичный
        const topRatedData = await getTopRated()
        console.log("Получены данные топ-рейтинга:", topRatedData)

        if (Array.isArray(topRatedData) && topRatedData.length > 0) {
          // Обрабатываем изображения перед установкой данных
          setDramas(processImageUrls(topRatedData))
        } else {
          throw new Error("Неожиданный формат данных")
        }
      } catch (error) {
        console.error("Ошибка при загрузке топ-рейтинговых дорам:", error)
        setError(error.message)
        toast.error(`Ошибка при загрузке дорам: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRated()
  }, [retryCount])

  // Функция для повторной загрузки данных
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="top-rated-page">
      <h1>Топ дорам</h1>
      <p className="subtitle">Дорамы с самым высоким рейтингом</p>
      {error ? (
        <div className="error-container">
          <p>Ошибка при загрузке топ-рейтинга: {error}</p>
          <button onClick={handleRetry} className="btn">
            Попробовать снова
          </button>
        </div>
      ) : (
        <DramaGrid dramas={dramas} loading={loading} error={null} />
      )}
    </div>
  )
}

export default TopRated
