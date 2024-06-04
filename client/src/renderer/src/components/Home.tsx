import { Button, Container } from '@mui/material'
import { useState } from 'react'
import CardLayout from './layout/CardLayout'
// import { subjects } from '../../../shared/Data'
import './../assets/main.css'

function Home(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [state, setState] = useState(false)

  // Receive messages from the main process
  window.electron.ipcRenderer.on('connection', (_, args: boolean) => {
    console.log('con')
    setState(args)
  })

  // window.electron.ipcRenderer.invoke('subject', '').then((re) => {
  //   console.log(re)
  // })
  const checkServerStatus = (): boolean => {
    console.log('click')

    window.electron.ipcRenderer.invoke('checkServerStatus', '').then((re) => {
      console.log('server status')
      console.log(re)
      setState(re)
    })
    return state == true ? true : false
  }
  checkServerStatus()

  const subject = ['BCA', 'BBA', 'BA', 'BCOM', 'Other']
  return (
    <>
      {state == false ? (
        <Button onClick={checkServerStatus}>server</Button>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <div className="container">
            {/* <Stack gap={3} direction="row" flexWrap="wrap"> */}
            {subject.map((text) => (
              <CardLayout key={text} value={{ name: text }} />
            ))}
            <Button onClick={checkServerStatus}>server</Button>
          </div>
          {/* </Stack> */}
        </Container>
      )}
    </>
  )
}

export default Home
