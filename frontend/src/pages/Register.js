"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API_BASE_URL from "../config"
import { toast } from "react-toastify"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Регистрация успешна! Теперь вы можете войти.")
        navigate("/login")
      } else {
        toast.error(data.message || "Ошибка регистрации")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Ошибка регистрации. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h1>Регистрация</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтвердите пароль:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <div className="login-link">
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
