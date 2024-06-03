// let subjects: string[] = []

window.electron.ipcRenderer.invoke('getSubjects', '').then((re) => {
  console.log(re, 'by get sub')
})

// getSubjects()

export const subjects: string[] = []
