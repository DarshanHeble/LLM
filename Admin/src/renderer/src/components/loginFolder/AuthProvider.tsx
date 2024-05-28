// import { createContext, useState } from 'react'

// const AuthContext = createContext({
//   currentForm: 'signIn', // default form
//   setCurrentForm: (form) => {}
// })

// function AuthProvider({ children }): JSX.Element {
//   const [currentForm, setCurrentForm] = useState('signIn')

//   const handleFormSwitch = (newForm: string) => () => {
//     setCurrentForm(newForm)
//   }

//   const value = { currentForm, setCurrentForm: handleFormSwitch }

//   return <AuthContext.Provider value={value}>{children} </AuthContext.Provider>
// }

// export default { AuthProvider, AuthContext }
