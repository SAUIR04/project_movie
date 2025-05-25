"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import DramaGrid from "../components/DramaGrid"
import { getDramas } from "../utils/api"
import { toast } from "react-toastify"

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [dramas, setDramas] = useState([])
  const [filteredDramas, setFilteredDramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDramas = async () => {
      if (!query.trim()) {
        setFilteredDramas([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Поиск дорам по запросу:", query)

        const data = await getDramas()
        console.log("Получены данные для поиска:", data)

        if (Array.isArray(data)) {
          setDramas(data)

          // Фильтруем дорамы по запросу
          const filtered = data.filter(
            (drama) =>
              drama.title.toLowerCase().includes(query.toLowerCase()) ||
              (drama.description && drama.description.toLowerCase().includes(query.toLowerCase())) ||
              (drama.genre &&
                Array.isArray(drama.genre) &&
                drama.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))),
          )

          setFilteredDramas(filtered)
        } else {
          setError("Неожиданный формат данных")
        }
      } catch (error) {
        console.error("Ошибка при поиске дорам:", error)
        setError(error.message)
        toast.error(`Ошибка при поиске: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDramas()
  }, [query])

  return (
    <div className="search-page">
      <h1>Результаты поиска: {query}</h1>
      {filteredDramas.length === 0 && !loading ? (
        <div className="no-results">
          <p>По запросу "{query}" ничего не найдено</p>
        </div>
      ) : (
        <DramaGrid dramas={filteredDramas} loading={loading} error={error} />
      )}
    </div>
  )
}

export default Search
