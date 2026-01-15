import { useState, useEffect } from 'react'
import axios from 'axios'

// Custom hook for fetching country data
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)  // tallennetaan maan tiedot
  const [found, setFound] = useState(false)     // löytyikö maa

  useEffect(() => {
    if (!name) return  // jos tyhjä syöte, älä hae

    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        )
        setCountry(response.data)
        setFound(true)
      } catch (error) {
        setCountry(null)
        setFound(false)
      }
    }

    fetchCountry()
  }, [name])  // <--- suoritettu aina, kun 'name' muuttuu

  return { country, found }
}
