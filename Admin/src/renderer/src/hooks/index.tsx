import { useState, useEffect } from 'react'

export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = (): void => setIsOnline(true)
    const handleOffline = (): void => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// import { useState } from 'react'

// export const useCounter = () => {
//   const [count, setCount] = useState(0)

//   const increment = () => {
//     setCount(count + 1)
//   }

//   const decrement = () => {
//     setCount(count - 1)
//   }

//   return {
//     count,
//     increment,
//     decrement
//   }
// }
