import { useState } from "react"
import { scanThaiIdCard } from "@/services/ocr.service"

function useOCR() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const scan = async (file: File) => {
    setLoading(true)

    try {
      const data = await scanThaiIdCard(file)
      setResult(data.data)

      return data
    } finally {
      setLoading(false)
    }
  }

  const clearOCR = () => {
    setResult(null)
    setLoading(false)
  }

  return {
    loading,
    result,
    scan,
    clearOCR,
  }
}

export { useOCR }