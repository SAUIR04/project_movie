"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Инициализация состояния аутентификации при загрузке
  useEffect(() => {
    const initAuth = () => {
      // Проверяем наличие токена
      const storedToken = localStorage.getItem("token")

      if (storedToken) {
        setToken(storedToken)
        setIsAuthenticated(true)

        // Получаем данные пользователя из localStorage
        const username = localStorage.getItem("username") || "Пользователь"
        const userId = localStorage.getItem("userId") || "unknown"
        const userRole = localStorage.getItem("userRole") || "user"

        // Создаем объект пользователя
        setUser({
          userId,
          username,
          role: userRole,
        })

        console.log("Аутентификация восстановлена из localStorage:", {
          username,
          role: userRole,
        })
      } else {
        // Сбрасываем состояние, если токен отсутствует
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  // Функция входа
  const login = async (authToken, username, userData = null) => {
    try {
      console.log("Вход в систему:", { username, userData })

      let userRole = "user"
      let userId = Math.random().toString(36).substring(2, 9)

      // Если переданы данные пользователя от сервера, используем их
      if (userData) {
        userRole = userData.role || "user"
        userId = userData.id || userId
        username = userData.username || username
      } else {
        // Определяем роль пользователя (для демо)
        const isAdmin = username.toLowerCase() === "admin"
        userRole = isAdmin ? "admin" : "user"
      }

      // Сохраняем данные в localStorage
      localStorage.setItem("token", authToken)
      localStorage.setItem("username", username)
      localStorage.setItem("userId", userId)
      localStorage.setItem("userRole", userRole)

      // Обновляем состояние
      setToken(authToken)
      setUser({
        userId,
        username,
        role: userRole,
      })
      setIsAuthenticated(true)

      console.log("Успешный вход:", { username, role: userRole })
      return true
    } catch (error) {
      console.error("Ошибка входа:", error)
      return false
    }
  }

  const logout = () => {
    // Удаляем данные из localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")

    // Сбрасываем состояние
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    console.log("Выход из системы выполнен")
  }

  // Отладочная информация
  console.log("AuthContext state:", { isAuthenticated, user, token: token ? "present" : "absent" })

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
