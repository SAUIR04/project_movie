"use client"

import { useState, useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import API_BASE_URL from "../config"
import { toast } from "react-toastify"

const Login = () => {
  const { login } = useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        login(data.token, username)
        toast.success("Вход выполнен успешно")
        navigate(from, { replace: true })
      } else {
        toast.error(data.message || "Ошибка входа")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Ошибка входа. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Вход</h1>

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
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>

      <div className="register-link">
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
