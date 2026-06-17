import { useEffect, useRef, useState } from 'react'

export function useAddressCopy(address: string) {
  const copyAddressTimerRef = useRef<number | null>(null)
  const [addressCopied, setAddressCopied] = useState(false)

  const copyAddress = async () => {
    if (!navigator.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(address)
    } catch {
      setAddressCopied(false)
      return
    }

    setAddressCopied(true)

    if (copyAddressTimerRef.current) {
      window.clearTimeout(copyAddressTimerRef.current)
    }

    copyAddressTimerRef.current = window.setTimeout(() => {
      setAddressCopied(false)
      copyAddressTimerRef.current = null
    }, 2200)
  }

  useEffect(() => {
    return () => {
      if (copyAddressTimerRef.current) {
        window.clearTimeout(copyAddressTimerRef.current)
      }
    }
  }, [])

  return { addressCopied, copyAddress }
}
