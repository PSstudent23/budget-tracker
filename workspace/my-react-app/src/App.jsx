import { useState, useEffect } from 'react'
import LandingPage from './LandingPage'
import Login from './Login'
import Register from './Register'

export default function App() {
  const [view, setView] = useState('landing')
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)

  const navigate = (page, message = null) => {
    setView(page)
    if (message) setToast(message)
  }

  // ✅ RESTORE SESSION ON PAGE LOAD
  useEffect(() => {
    fetch("http://localhost:30040/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setUser(data.user)
          setView('app') // skip login if already logged in
        } else {
          setView('landing')
        }
      })
      .catch(() => {
        setView('landing')
      })
  }, [])

  if (view === 'landing')
    return <LandingPage onNavigate={navigate} />

  if (view === 'login')
    return (
      <Login
        onLogin={u => {
          setUser(u)
          setView('app')
        }}
        onNavigate={navigate}
        toast={toast}
      />
    )

  if (view === 'register')
    return <Register onNavigate={navigate} />

  return (
    <div style={{ padding: '2rem' }}>
      Welcome, {user?.first_name}!
    </div>
  )
}