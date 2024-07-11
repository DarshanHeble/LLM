// import { Theme, useMediaQuery } from '@mui/material'
// import { createContext, useEffect, useState } from 'react'
// import { AppDarkTheme, AppLightTheme } from './theme'

// export const ThemeContext = createContext(null)

export enum IThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEN = 'system'
}
export interface IThemeContext {
  themeMode: IThemeMode
  switchThemeMode: (mode: IThemeMode) => void
}

// export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
//   const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.LIGHT)
//   const [theme, setTheme] = useState<Theme>(AppLightTheme)

//   const SYSTEM_THEME: Exclude<IThemeMode, IThemeMode.SYSTEN> = useMediaQuery(
//     '(prefers-color-scheme: dark)'
//   )
//     ? IThemeMode.DARK
//     : IThemeMode.LIGHT

//   useEffect(() => {
//     switch (themeMode) {
//       case IThemeMode.LIGHT:
//         setTheme(AppLightTheme)
//         break
//       case IThemeMode.DARK:
//         setTheme(AppDarkTheme)
//         break
//       case IThemeMode.SYSTEN:
//         switch (SYSTEM_THEME) {
//           case IThemeMode.LIGHT:
//             setTheme(AppLightTheme)
//             break
//           case IThemeMode.DARK:
//             setTheme(AppDarkTheme)
//             break
//         }
//       // default:
//       //   break
//     }
//   }, [themeMode])

//   const switchThemeMode = (mode: IThemeMode): void => {
//     setThemeMode(mode)
//   }
//   return (
//     <ThemeContext.Provider value={{ themeMode, switchThemeMode }}>{children}</ThemeContext.Provider>
//   )
// }
