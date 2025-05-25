import express from "express"
import helmet from "helmet"
import cors from "cors"
import { connectDB } from "./db/config.js"
import tovarRoutes from "./routes/tovar.js"
import userRoutes from "./routes/users.js"
import { authenticateToken, adminOnly } from "./middleware/auth.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Публичные маршруты для получения товаров (без авторизации)
app.get("/tovars", async (req, res) => {
  try {
    // Импортируем модель Tovar напрямую здесь
    const Tovar = (await import("./models/tovar.js")).default
    const tovar = await Tovar.find({})
    res.status(200).json({ success: true, data: tovar })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

app.get("/tovars/:id", async (req, res) => {
  const { id } = req.params
  try {
    // Импортируем модель Tovar напрямую здесь
    const Tovar = (await import("./models/tovar.js")).default
    const tovar = await Tovar.findById(id)
    if (!tovar) {
      return res.status(404).json({ success: false, message: "Tovar not found" })
    }
    res.status(200).json({ success: true, data: tovar })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Добавляем маршрут для получения топ-рейтинговых дорам
app.get("/top", async (req, res) => {
  try {
    // Импортируем модель Tovar напрямую здесь
    const Tovar = (await import("./models/tovar.js")).default
    // Получаем все дорамы и сортируем их по рейтингу (от высокого к низкому)
    const topDramas = await Tovar.find({}).sort({ rating: -1 }).limit(10)

    // Добавляем логирование для отладки
    console.log(`Отправка ${topDramas.length} топ-рейтинговых дорам`)

    res.status(200).json({ success: true, data: topDramas })
  } catch (error) {
    console.error("Ошибка при получении топ-рейтинговых дорам:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Добавляем альтернативный маршрут для получения топ-рейтинговых дорам
app.get("/api/top", async (req, res) => {
  try {
    const Tovar = (await import("./models/tovar.js")).default
    const topDramas = await Tovar.find({}).sort({ rating: -1 }).limit(10)
    res.status(200).json({ success: true, data: topDramas })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Защищенные маршруты для товаров (требуют авторизации)
app.use("/tovars", authenticateToken, tovarRoutes)

// Маршруты пользователей
app.use("/", userRoutes)

// Admin-only route example
app.get("/admin", authenticateToken, adminOnly, (req, res) => {
  res.json({ success: true, message: "Welcome to the admin panel" })
})

// Catch-all route for undefined paths
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"))
