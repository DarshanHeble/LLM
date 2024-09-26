import { Other } from '@shared/types/types'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'

interface SideBarContextType {
  isDrawerLarge: boolean
  drawerWidth: number
  isListItemTextVisible: boolean
  toggleDrawerSize: () => void
}
const SideBarContext = createContext<SideBarContextType | undefined>(undefined)

export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [otherData, setOtherData] = useState<Other>({
    _id: '',
    activeDrawerItem: '',
    bookCount: 0,
    deletedBookIds: [],
    isDrawerLarge: true,
    UserCount: 0,
    _rev: ''
  })

  useEffect(() => {
    fetchOtherData()
  }, [])

  const [isDrawerLarge, setIsDrawerLarge] = useState(otherData.isDrawerLarge)
  const [drawerWidth, setDrawerWidth] = useState(isDrawerLarge ? 240 : 60)
  const [isListItemTextVisible, setIsListItemTextVisible] = useState(isDrawerLarge ? true : false)

  async function fetchOtherData(): Promise<void> {
    const otherData = await window.electron.ipcRenderer.invoke('getOtherData')

    setOtherData(otherData)

    setIsDrawerLarge(otherData.isDrawerLarge)
    setDrawerWidth(otherData.isDrawerLarge ? 240 : 60)
    setIsListItemTextVisible(otherData.isDrawerLarge)
  }

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

    const updatedOtherData: Other = {
      ...otherData,
      isDrawerLarge: !isDrawerLarge
    }

    window.electron.ipcRenderer.invoke('updateOtherData', updatedOtherData).then((re) => {
      console.log('updated other data', re)
    })
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
