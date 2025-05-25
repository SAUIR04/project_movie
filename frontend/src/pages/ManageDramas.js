"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { AuthContext } from "../contexts/AuthContext"
import { getDramas, deleteDrama } from "../utils/api"
import { toast } from "react-toastify"

const ManageDramas = () => {
  const { token } = useContext(AuthContext)
  const [dramas, setDramas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    const fetchDramas = async () => {
      try {
        console.log("Страница управления: Загрузка списка дорам...")

        // Добавляем параметр для отладки
        const data = await getDramas(token, false)
        console.log("Страница управления: Получены данные:", data)

        if (Array.isArray(data)) {
          console.log("Страница управления: Данные являются массивом длиной:", data.length)
          setDramas(data)
        } else if (data && typeof data === "object") {
          // Если это объект, пытаемся найти массив внутри
          const dramasArray = data.tovars || data.dramas || data.data || []
          console.log("Страница управления: Извлеченный массив дорам:", dramasArray)
          console.log("Страница управления: Длина массива:", dramasArray.length)
          setDramas(dramasArray)
        } else {
          console.error("Страница управления: Неожиданный формат данных:", data)
          setError("Неожиданный формат данных от сервера")
        }
      } catch (error) {
        console.error("Страница управления: Ошибка при загрузке дорам:", error)
        setError(error.message)
        toast.error(`Ошибка при загрузке дорам: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDramas()
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту дораму?")) {
      return
    }

    setDeleteLoading(id)
    try {
      console.log(`Начинаем удаление дорамы с ID: ${id}`)

      // Вызываем функцию удаления
      const result = await deleteDrama(id, token)
      console.log("Результат удаления:", result)

      if (result && result.success) {
        // Удаляем дораму из локального состояния
        setDramas(dramas.filter((drama) => drama._id !== id && drama.id !== id))
        toast.success("Дорама успешно удалена")
      } else {
        // Если сервер вернул ошибку
        toast.error("Ошибка при удалении дорамы на сервере")
      }
    } catch (error) {
      console.error("Ошибка при удалении дорамы:", error)
      toast.error(`Ошибка при удалении дорамы: ${error.message}`)
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка списка дорам...</p>
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

  return (
    <div className="manage-dramas-container">
      <div className="page-header">
        <h1>Управление дорамами</h1>
        <Link to="/admin/add" className="add-btn">
          <FaPlus /> Добавить дораму
        </Link>
      </div>

      {/* Отладочная информация */}
      <div className="debug-info">
        <p>Загружено дорам: {dramas.length}</p>
        <p>Состояние: {loading ? "Загрузка..." : error ? `Ошибка: ${error}` : "Готово"}</p>
      </div>

      {dramas.length === 0 ? (
        <div className="empty-container">
          <p>Дорамы не найдены</p>
          <Link to="/admin/add" className="btn">
            Добавить первую дораму
          </Link>
        </div>
      ) : (
        <div className="dramas-table-container">
          <table className="dramas-table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Жанры</th>
                <th>Дата выхода</th>
                <th>Рейтинг</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {dramas.map((drama) => (
                <tr key={drama._id || drama.id || Math.random().toString()}>
                  <td className="drama-image-cell">
                    <img
                      src={drama.image || "/placeholder.svg"}
                      alt={drama.title}
                      className="drama-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/50x75?text=Нет+изображения"
                      }}
                    />
                  </td>
                  <td>
                    <Link to={`/dramas/${drama._id || drama.id}`} className="drama-title-link">
                      {drama.title}
                    </Link>
                  </td>
                  <td>{Array.isArray(drama.genre) ? drama.genre.join(", ") : drama.genre || "Не указан"}</td>
                  <td>{drama.releaseDate ? new Date(drama.releaseDate).toLocaleDateString() : "Не указана"}</td>
                  <td>{drama.rating ? drama.rating.toFixed(1) : "0.0"}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/edit/${drama._id || drama.id}`} className="edit-btn table-btn">
                      <FaEdit /> Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(drama._id || drama.id)}
                      className="delete-btn table-btn"
                      disabled={deleteLoading === (drama._id || drama.id)}
                    >
                      <FaTrash /> Удалить
                      {deleteLoading === (drama._id || drama.id) && <span className="spinner"></span>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageDramas
