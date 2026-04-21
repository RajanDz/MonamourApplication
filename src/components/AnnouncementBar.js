import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AnnouncementBar() {
  const [text, setText] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['announcement_bar', 'announcement_bar_active'])
      if (!data) return
      const map = Object.fromEntries(data.map(r => [r.key, r.value]))
      setActive(map.announcement_bar_active === 'true')
      setText(map.announcement_bar || '')
    }
    load()
  }, [])

  if (!active || !text) return null

  return (
    <div className="announcement-bar">
      {text}
    </div>
  )
}
