import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import './../assets/main.css'
import { Book } from '@shared/types/types'
import MRTBooks from './layout/MRTBooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function Home(): JSX.Element {
  const queryClient = new QueryClient()
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [, setState] = useState(false)

  // Receive messages from the main process
  window.electron.ipcRenderer.on('connection', (_, args: boolean) => {
    console.log('connection status', args)
    setState(args)
  })

  window.electron.ipcRenderer.on('bookData', (_, bookData: Book[]) => {
    console.log('book data', bookData)
  })

  const checkServerStatus = (): void => {
    window.electron.ipcRenderer.invoke('checkServerStatus').then((re) => {
      console.log('server status', re)
      setState(re)
    })
  }

  useEffect(() => {
    checkServerStatus()
  }, [])

  return (
    <>
      {/* {state == false ? (
        <Button onClick={checkServerStatus} sx={{ mt: 40 }}>
          server
        </Button>
      ) : ( */}
      <QueryClientProvider client={queryClient}>
        <Container maxWidth="lg" sx={{ py: 4, height: '-webkit-fill-available' }}>
          <MRTBooks />
        </Container>
      </QueryClientProvider>
      {/* )} */}
    </>
  )
}

export default Home
