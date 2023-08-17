  import {contextBridge, ipcRenderer} from 'electron';

  contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),

  writeToFile: (data, filePath, fileName) => ipcRenderer.send('writeToFile', data, filePath, fileName),
  writeToFileInAppDir: (data, filePath, fileName) => ipcRenderer.send('writeToFileInAppDir', data, filePath, fileName),
  runHugo: (commands) => ipcRenderer.send('runHugo', commands),
  readFile: async (path) =>  {
    const data = await ipcRenderer.invoke('readFromFile', path);
    return data;
  },
  readFileInAppDir: async (path) =>  {
    const data = await ipcRenderer.invoke('readFileInAppDir', path);
    return data;
  },
  doesFileExist: async (path) =>  {
    const data = await ipcRenderer.invoke('doesFileExist', path);
    return data;
  },
  doesFileExistInAppDir: async (path) =>  {
    const data = await ipcRenderer.invoke('doesFileExistInAppDir', path);
    return data;
  },
  openInBrowser: (url) => ipcRenderer.send('openInBrowser', url),
  downloadFile: (url, directoryPath) => ipcRenderer.invoke('downloadFile', url, { properties: {directory: directoryPath, showBadge: false, showProgressBar: true} }),
  extractFile: async (source, target) =>  {
    const data = await ipcRenderer.invoke('extractFile', source, target);
    return data;
  },
  deleteFile: (path) => ipcRenderer.send('deleteFile', path),

  });
//   ipcRenderer.send("download", {
//     url: "URL is here",
//     properties: {directory: "Directory is here"}
// });
