"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { AuthContext } from "./AuthContext"

export const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.userId || "default"
      const storedFavorites = localStorage.getItem(`favorites_${userId}`)
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (error) {
          console.error("Error parsing favorites:", error)
          setFavorites([])
        }
      }
    } else {
      setFavorites([])
    }
  }, [isAuthenticated, user])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user && favorites.length > 0) {
      const userId = user.userId || "default"
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites))
    }
  }, [favorites, isAuthenticated, user])

  const addToFavorites = (drama) => {
    if (!isAuthenticated) return false

    // Проверяем, есть ли у дорамы _id или id
    const dramaId = drama._id || drama.id
    if (!dramaId) {
      console.error("Дорама не имеет идентификатора:", drama)
      return false
    }

    // Check if already in favorites
    if (!favorites.some((fav) => fav._id === dramaId || fav.id === dramaId)) {
      // Нормализуем объект дорамы перед сохранением
      const normalizedDrama = {
        _id: dramaId,
        id: dramaId,
        title: drama.title || "Без названия",
        description: drama.description || "",
        image: drama.image || "",
        genre: Array.isArray(drama.genre) ? drama.genre : [],
        releaseDate: drama.releaseDate || new Date().toISOString(),
        rating: drama.rating || 0,
      }

      setFavorites([...favorites, normalizedDrama])
      return true
    }
    return false
  }

  const removeFromFavorites = (dramaId) => {
    if (!isAuthenticated) return false

    setFavorites(favorites.filter((drama) => drama._id !== dramaId && drama.id !== dramaId))
    return true
  }

  const isFavorite = (dramaId) => {
    return favorites.some((drama) => drama._id === dramaId || drama.id === dramaId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
