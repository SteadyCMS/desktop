import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),
 // readFromFile: (path) => ipcRenderer.send('readFromFile', path),
  writeToFile: (data, filePath, fileName) => ipcRenderer.send('writeToFile', data, filePath, fileName),
  runHugo: (commands) => ipcRenderer.send('runHugo', commands),
  readFile: async (path) =>  {
  const data = await ipcRenderer.invoke('readFromFile', path)
  return data;
},



})
