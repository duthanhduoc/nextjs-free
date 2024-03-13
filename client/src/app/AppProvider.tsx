'use client'
import { createContext, useContext, useState } from 'react'

const AppContext = createContext({
  sessionToken: '',
  setSessionToken: (sessionToken: string) => {}
})

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export default function AppProvider({
  children,
  inititalSessionToken = ''
}: {
  children: React.ReactNode
  inititalSessionToken?: string
}) {
  const [sessionToken, setSessionToken] = useState(inititalSessionToken)
  return (
    <AppContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AppContext.Provider>
  )
}
