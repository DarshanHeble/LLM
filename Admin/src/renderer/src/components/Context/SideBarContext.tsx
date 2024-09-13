import { createContext, FC, ReactNode, useContext, useState } from 'react'

interface SideBarContextType {
  isDrawerLarge: boolean
  drawerWidth: number
  isListItemTextVisible: boolean
  toggleDrawerSize: () => void
}
const SideBarContext = createContext<SideBarContextType | undefined>(undefined)

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDrawerLarge, setIsDrawerLarge] = useState(true)
  const [drawerWidth, setDrawerWidth] = useState(240)
  const [isListItemTextVisible, setIsListItemTextVisible] = useState(true)

  const toggleDrawerSize = (): void => {
    // Toggle sidebar size and visibility of text
    setIsDrawerLarge((prev) => !prev)

    if (isDrawerLarge) {
      setIsListItemTextVisible(false)
    } else {
      setTimeout(() => {
        setIsListItemTextVisible(true)
      }, 300)
    }
    setDrawerWidth(isDrawerLarge ? 60 : 240)
  }

  return (
    <SideBarContext.Provider
      value={{ isDrawerLarge, drawerWidth, isListItemTextVisible, toggleDrawerSize }}
    >
      {children}
    </SideBarContext.Provider>
  )
}

export const useSidebar = (): SideBarContextType => {
  const context = useContext(SideBarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
