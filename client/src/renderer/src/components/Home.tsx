import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import CardLayout from './layout/CardLayout'
// import { subjects } from '../../../shared/Data'

function Home(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [state, setState] = useState(false)

  // Receive messages from the main process
  window.electron.ipcRenderer.on('subject', (_, args: boolean) => {
    console.log('con')
    setState(args)
  })

  window.electron.ipcRenderer.invoke('getSubjects', '').then((re) => {
    console.log(re)
  })

  const subject = ['BCA', 'BBA', 'BA', 'BCOM']
  return (
    <>
      {/* {state == false ? (
        'Server is not connected'
      ) : ( */}
      <Container maxWidth="lg">
        <Stack gap={3} direction="row" flexWrap="wrap">
          {subject.map((text) => (
            <CardLayout key={text} value={{ name: text }} />
          ))}
        </Stack>
      </Container>
      {/* )} */}
    </>
  )
}

export default Home
