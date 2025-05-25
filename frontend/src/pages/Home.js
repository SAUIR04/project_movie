"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import DramaGrid from "../components/DramaGrid"
import SearchBar from "../components/SearchBar"
import { getDramas } from "../utils/api"
import { FaArrowRight } from "react-icons/fa"
import { toast } from "react-toastify"

const Home = () => {
  const [dramas, setDramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredDramas, setFilteredDramas] = useState([])
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
    const fetchDramas = async () => {
      try {
        setLoading(true)
        console.log("Главная страница: Загрузка списка дорам...")

        // Добавляем параметр для отладки
        const data = await getDramas(null, true)
        console.log("Главная страница: Получены данные:", data)

        // Проверяем, что данные - это массив
        if (Array.isArray(data)) {
          console.log("Главная страница: Данные являются массивом длиной:", data.length)
          const processedData = processImageUrls(data)
          setDramas(processedData)
          setFilteredDramas(processedData)
        } else if (data && typeof data === "object") {
          // Если это объект, пытаемся найти массив внутри
          const dramasArray = data.tovars || data.dramas || data.data || []
          console.log("Главная страница: Извлеченный массив дорам:", dramasArray)
          console.log("Главная страница: Длина массива:", dramasArray.length)
          const processedData = processImageUrls(dramasArray)
          setDramas(processedData)
          setFilteredDramas(processedData)
        } else {
          console.error("Главная страница: Неожиданный формат данных:", data)
          setError("Неожиданный формат данных от сервера")
        }
      } catch (error) {
        console.error("Главная страница: Ошибка при загрузке дорам:", error)
        setError(error.message)
        toast.error(`Ошибка при загрузке дорам: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDramas()
  }, [retryCount])

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredDramas(dramas)
      return
    }

    const filtered = dramas.filter(
      (drama) =>
        drama.title.toLowerCase().includes(query.toLowerCase()) ||
        (drama.description && drama.description.toLowerCase().includes(query.toLowerCase())) ||
        (drama.genre &&
          Array.isArray(drama.genre) &&
          drama.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))),
    )

    setFilteredDramas(filtered)
  }

  // Получаем уникальные жанры из всех дорам
  const allGenres = [
    ...new Set(dramas.flatMap((drama) => (drama.genre && Array.isArray(drama.genre) ? drama.genre : []))),
  ].slice(0, 6)

  // Функция для повторной загрузки данных
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Добро пожаловать на QazaqDorama</h1>
          <p>Лучшие корейские и азиатские дорамы в одном месте</p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      {/* Отладочная информация */}
      <div className="debug-info">
        <p>Загружено дорам: {dramas.length}</p>
        <p>Отфильтровано: {filteredDramas.length}</p>
        <p>Состояние: {loading ? "Загрузка..." : error ? `Ошибка: ${error}` : "Готово"}</p>
      </div>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Все дорамы</h2>
        </div>

        {error ? (
          <div className="error-container">
            <p>Ошибка при загрузке дорам: {error}</p>
            <button onClick={handleRetry} className="btn">
              Попробовать снова
            </button>
          </div>
        ) : (
          <DramaGrid dramas={filteredDramas} loading={loading} error={null} />
        )}
      </section>

      {allGenres.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Популярные жанры</h2>
          </div>
          <div className="genres-grid">
            {allGenres.map((genre) => (
              <Link to={`/genres/${genre}`} key={genre} className="genre-card">
                <h3>{genre}</h3>
              </Link>
            ))}
            <Link to="/genres" className="genre-card see-all">
              <h3>
                Все жанры <FaArrowRight />
              </h3>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
