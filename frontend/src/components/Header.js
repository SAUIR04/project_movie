"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import {
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaHome,
  FaFilm,
  FaTv,
  FaStar,
  FaPlus,
  FaEdit,
  FaHeart,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa"
import { toast } from "react-toastify"

const Header = () => {
  const { user, token, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [serverStatus, setServerStatus] = useState("checking") // "checking", "online", "offline"

  // Проверяем размер экрана для мобильного меню
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Проверяем статус сервера
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Пробуем разные URL для проверки доступности сервера
        const urls = [
          "http://localhost:3000/api/health",
          "http://localhost:3000/health",
          "http://localhost:3000/api/tovars",
          "http://localhost:3000/tovars",
        ]

        let isOnline = false

        for (const url of urls) {
          try {
            const response = await fetch(url, {
              method: "GET",
              headers: { Accept: "application/json" },
              // Устанавливаем короткий таймаут
              signal: AbortSignal.timeout(2000),
            })

            if (response.ok) {
              isOnline = true
              break
            }
          } catch (e) {
            console.warn(`Не удалось подключиться к ${url}:`, e)
          }
        }

        setServerStatus(isOnline ? "online" : "offline")
      } catch (error) {
        console.error("Ошибка при проверке статуса сервера:", error)
        setServerStatus("offline")
      }
    }

    checkServerStatus()

    // Проверяем статус сервера каждые 30 секунд
    const interval = setInterval(checkServerStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode)
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    toast.success("Вы успешно вышли из системы")
    navigate("/")
  }

  // Исправляем функцию поиска в верхней части сайта
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Используем правильный путь для поиска
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      console.log("Выполняется поиск:", searchQuery)
    }
  }

  // Явно проверяем, является ли пользователь администратором
  const isAdmin = user && user.role === "admin"

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🎬 QazaqDorama</Link>
        {serverStatus === "offline" && (
          <span className="server-status offline" title="Сервер недоступен">
            <FaExclamationTriangle className="status-icon" />
          </span>
        )}
      </div>

      {isMobile ? (
        <>
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <nav className="mobile-nav-links">
              <Link to="/" className="nav-item">
                <FaHome /> Главная
              </Link>
              <Link to="/movies" className="nav-item">
                <FaFilm /> Фильмы
              </Link>
              <Link to="/series" className="nav-item">
                <FaTv /> Сериалы
              </Link>
              <Link to="/genres" className="nav-item">
                <FaStar /> Жанры
              </Link>
              <Link to="/top" className="nav-item">
                <FaStar /> Топ
              </Link>

              {isAuthenticated && (
                <Link to="/favorites" className="nav-item">
                  <FaHeart /> Избранное
                </Link>
              )}

              {/* Admin-only links - явно проверяем isAdmin */}
              {isAdmin && (
                <>
                  <div className="admin-section">
                    <div className="admin-section-title">Администрирование</div>
                    <Link to="/admin/add" className="nav-item admin-link">
                      <FaPlus /> Добавить
                    </Link>
                    <Link to="/admin/manage" className="nav-item admin-link">
                      <FaEdit /> Управление
                    </Link>
                  </div>
                </>
              )}

              <form onSubmit={handleSearch} className="mobile-search-form">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск дорам..."
                />
                <button type="submit">
                  <FaSearch />
                </button>
              </form>

              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />}
                <span>{darkMode ? "Светлая тема" : "Темная тема"}</span>
              </button>

              {!isAuthenticated ? (
                <Link to="/login" className="auth-icon">
                  <FaUserCircle /> Войти
                </Link>
              ) : (
                <div className="user-info">
                  <div className="username">
                    <FaUserCircle /> {user?.username || "Пользователь"}
                    {isAdmin && <span className="admin-badge">Админ</span>}
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Выйти
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      ) : (
        <nav className="nav-links">
          <Link to="/" className="nav-item">
            <FaHome /> Главная
          </Link>
          <Link to="/movies" className="nav-item">
            <FaFilm /> Фильмы
          </Link>
          <Link to="/series" className="nav-item">
            <FaTv /> Сериалы
          </Link>
          <Link to="/genres" className="nav-item">
            <FaStar /> Жанры
          </Link>
          <Link to="/top" className="nav-item">
            <FaStar /> Топ
          </Link>

          {isAuthenticated && (
            <Link to="/favorites" className="nav-item">
              <FaHeart /> Избранное
            </Link>
          )}

          {/* Admin-only links - явно проверяем isAdmin */}
          {isAdmin && (
            <>
              <Link to="/admin/add" className="nav-item admin-link">
                <FaPlus /> Добавить
              </Link>
              <Link to="/admin/manage" className="nav-item admin-link">
                <FaEdit /> Управление
              </Link>
            </>
          )}

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск дорам..."
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!isAuthenticated ? (
            <Link to="/login" className="auth-icon">
              <FaUserCircle /> Войти
            </Link>
          ) : (
            <div className="user-info">
              <span className="username">
                <FaUserCircle /> {user?.username || "Пользователь"}
                {isAdmin && <span className="admin-badge">Админ</span>}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Выйти
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
