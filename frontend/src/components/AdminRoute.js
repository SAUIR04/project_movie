"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import toast from "react-hot-toast"

// Улучшаем проверку роли администратора
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)

  // Отладочная информация
  console.log("AdminRoute check:", { isAuthenticated, user, isAdmin: user?.role === "admin" })

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  // Явно проверяем роль администратора
  if (!isAuthenticated || !user || user.role !== "admin") {
    console.log("Доступ запрещен: пользователь не является администратором")
    toast.error("У вас нет прав администратора для доступа к этой странице")
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
