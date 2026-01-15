import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// Custom hook useResource
export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // Hae kaikki resurssit heti hookin alustuksessa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.error('Fetching error:', error)
      }
    }

    fetchData()
  }, [baseUrl])

  // Luo uusi resurssi
  const create = async (newObject) => {
    try {
      const response = await axios.post(baseUrl, newObject)
      setResources(resources.concat(response.data))
    } catch (error) {
      console.error('Creation error:', error)
    }
  }

  const service = { create }

  return [resources, service]
}
