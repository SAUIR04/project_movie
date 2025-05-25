"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск дорам..."
        aria-label="Поиск дорам"
      />
      <button type="submit" aria-label="Искать">
        <FaSearch /> Поиск
      </button>
    </form>
  )
}

export default SearchBar
