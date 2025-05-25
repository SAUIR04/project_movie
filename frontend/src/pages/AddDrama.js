"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { createDrama } from "../utils/api"
import { toast } from "react-toastify"

const AddDrama = () => {
  const { token } = useContext(AuthContext)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [genre, setGenre] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [rating, setRating] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Название дорамы обязательно")
      return
    }

    const newDrama = {
      title,
      description: description || "",
      image: image || "",
      genre: genre ? genre.split(",").map((g) => g.trim()) : [],
      releaseDate: releaseDate || new Date().toISOString().slice(0, 10),
      rating: Number.parseFloat(rating) || 0,
    }

    setLoading(true)

    try {
      console.log("Отправка данных для создания дорамы:", newDrama)
      const result = await createDrama(newDrama, token)
      console.log("Результат создания дорамы:", result)

      toast.success("Дорама успешно добавлена")

      // Очищаем форму
      setTitle("")
      setDescription("")
      setImage("")
      setGenre("")
      setReleaseDate("")
      setRating("")

      // Перенаправляем на главную страницу или на страницу созданной дорамы
      if (result && (result._id || result.id)) {
        navigate(`/dramas/${result._id || result.id}`)
      } else {
        navigate("/")
      }
    } catch (error) {
      console.error("Ошибка при добавлении дорамы:", error)
      toast.error(`Ошибка при добавлении дорамы: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-drama-container">
      <h1>Добавить новую дораму</h1>

      <form onSubmit={handleSubmit} className="tovar-form">
        <div className="form-group">
          <label htmlFor="title">Название:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Описание:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="image">URL изображения:</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
          {image && (
            <div className="image-preview">
              <img
                src={image || "/placeholder.svg"}
                alt="Предпросмотр"
                style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "https://via.placeholder.com/300x450?text=Ошибка+загрузки"
                }}
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="genre">Жанры (через запятую):</label>
          <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Дата выхода:</label>
          <input type="date" id="releaseDate" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Рейтинг:</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            step="0.1"
            min="0"
            max="10"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Добавление..." : "Добавить дораму"}
        </button>
      </form>
    </div>
  )
}

export default AddDrama
