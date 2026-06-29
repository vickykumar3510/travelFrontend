import { createContext, useCallback, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"))
  const [username, setUsernameState] = useState(() => localStorage.getItem("username"))

  const setToken = useCallback((next, nextUsername) => {
    if (next) {
      localStorage.setItem("token", next)
      if (nextUsername) {
        localStorage.setItem("username", nextUsername)
        setUsernameState(nextUsername)
      }
      setTokenState(next)
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      setTokenState(null)
      setUsernameState(null)
    }
  }, [])

  const value = useMemo(
    () => ({ token, username, setToken }),
    [token, username, setToken]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

export default AuthContext
