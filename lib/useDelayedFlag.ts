import { useEffect, useState } from 'react'

export function useDelayedFlag(active: boolean, delayMs = 180) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(true)
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [active, delayMs])

  return visible
}
