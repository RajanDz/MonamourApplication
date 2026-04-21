import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function useSession() {
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    let id = localStorage.getItem('monamour_session')
    if (!id) {
      id = uuidv4()
      localStorage.setItem('monamour_session', id)
    }
    setSessionId(id)
  }, [])

  return sessionId
}
