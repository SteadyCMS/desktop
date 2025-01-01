  import {contextBridge, ipcRenderer} from 'electron';

  contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),

  writeToFile: (data, filePath, fileName) => ipcRenderer.send('writeToFile', data, filePath, fileName),
  writeToFileInAppDir: (data, filePath, fileName) => ipcRenderer.send('writeToFileInAppDir', data, filePath, fileName),
  runHugo: async (commands) =>  {
    const data = await ipcRenderer.invoke('runHugo', commands);
    return data;
  },
  readFile: async (path) =>  {
    const data = await ipcRenderer.invoke('readFromFile', path);
    return data;
  },
  uploadFileToServer: async (localFilePath, ServerConfig) =>  {
    const data = await ipcRenderer.invoke('uploadFileToServer', localFilePath, ServerConfig);
    return data;
  },
  deleteServerDir: async (serverPath, ServerConfig) =>  {
    const data = await ipcRenderer.invoke('deleteServerDir', serverPath, ServerConfig);
    return data;
  },
  walkDir: async (dirPath, includeDir) =>  {
    const data = await ipcRenderer.invoke('walkDir', dirPath, includeDir);
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
  deleteFile: (path, scoped) => ipcRenderer.send('deleteFile', path, scoped),
  deleteFileInAppDir: (path) => ipcRenderer.send('deleteFileInAppDir', path),
  deleteDir: (path) => ipcRenderer.send('deleteDir', path),
  getPathTo: async (place) =>  {
    const data = await ipcRenderer.invoke('getPathTo', place);
    return data;
  },
  getDirsIn: (rootDir) =>  {
    const dirs =  ipcRenderer.invoke('getDirsIn', rootDir);
    return dirs;
  },
  getFilesIn: (dir, fileType) =>  {
    const files =  ipcRenderer.invoke('getFilesIn', dir, fileType);
    return files;
  },
  copyFile: async (src, des) =>  {
    const data = await ipcRenderer.invoke('copyFile', src, des);
    console.log(data);
    return data;
  },
  openTerminal: (path) => ipcRenderer.send('openTerminal', path),
  openFileExplorer: (path) => ipcRenderer.send('openFileExplorer', path),
  
  


  });
  