import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const sendMessage = () => {
    // socket.emit('send message', { message: 'hello' })
  }
  return (
    <>
      <div className="">
        <img alt="logo" className="logo" src={electronLogo} />
        <div className="creator">Powered by electron-vite</div>
        <div className="text">
          Build an Electron app with <span className="react">React</span>
        </div>
        <p className="tip">
          Please try pressing <code>F12</code> to open the devTool
        </p>
        <div className="actions">
          <div className="action">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </div>
          <div className="action">
            <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
              Send IPC
            </a>
          </div>
        </div>
        <Versions></Versions>
      </div>
      <div className="App">
        <input type="text" placeholder="message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  )
}

export default App
