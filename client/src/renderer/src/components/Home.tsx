import { Button, Container } from '@mui/material'
import { useState } from 'react'
import './../assets/main.css'

function Home(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [state, setState] = useState(false)

  // Receive messages from the main process
  window.electron.ipcRenderer.on('connection', (_, args: boolean) => {
    setState(args)
  })

  // window.electron.ipcRenderer.invoke('subject', '').then((re) => {
  //   console.log(re)
  // })
  const checkServerStatus = (): void => {
    window.electron.ipcRenderer.invoke('checkServerStatus', '').then((re) => {
      console.log('server status', re)
      setState(re)
    })
  }
  checkServerStatus()

  return (
    <>
      {state == false ? (
        <Button onClick={checkServerStatus} sx={{ mt: 40 }}>
          server
        </Button>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}></Container>
      )}
    </>
  )
}

export default Home
