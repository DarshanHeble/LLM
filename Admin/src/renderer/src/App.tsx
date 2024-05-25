import Versions from './components/Versions'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="action">
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
