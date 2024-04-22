'use client'
import { AccountResType } from '@/schemaValidations/account.schema'
import { createContext, useContext, useState } from 'react'

type User = AccountResType['data']

const AppContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
}>({
  user: null,
  setUser: () => {}
})
export const useAppContext = () => {
  const context = useContext(AppContext)
  return context
}
export default function AppProvider({
  children,
  user: userProp
}: {
  children: React.ReactNode
  user: User | null
}) {
  const [user, setUser] = useState<User | null>(userProp)
  return (
    <AppContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
