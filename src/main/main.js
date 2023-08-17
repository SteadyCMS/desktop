  import {app, BrowserWindow, ipcMain, session} from 'electron';
  import {join} from 'path';

  import {readFileSync, mkdir, writeFile, existsSync, rmSync} from 'fs';
  import {execFile} from 'child_process';
  import {download} from "electron-dl";
  import decompress from "decompress";
  
  function createWindow () {
    const mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      minWidth: 1000,
      minHeight: 800,
      icon: 'src/renderer/assets/images/steady-cms-logomark.png', // TODO Better Icon
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      // devTools: false,
      }
    });
    mainWindow.maximize();

    if (process.env.NODE_ENV === 'development') {
      const rendererPort = process.argv[2];
      mainWindow.loadURL(`http://localhost:${rendererPort}`);
    }
    else {
      mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    }
  }

  app.whenReady().then(() => {
    createWindow();
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ['script-src \'self\'']
        }
      })
    })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  });

  ipcMain.on('message', (event, message) => {
    console.log(message);
  });

// MY Fun

  // Read From File (IN DOCUMENTS)
  ipcMain.handle('readFromFile',  async (event, path) => {
    const filePath = join(app.getPath('documents') + "\\SteadyCMS\\data\\" + path);
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Read From File (IN APP DIR)
  ipcMain.handle('readFromFileInAppDir',  async (event, path) => {
    const filePath = join(app.getAppPath(),  "\\data\\" + path);
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Write To File (IN DOCUMENTS)
  ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
    mkdir(app.getPath('documents') + "\\SteadyCMS\\data\\" + filePath, { recursive: true }, (err) => {
      if (err){
        throw err;
      } else {
        writeFile(app.getPath('documents') + "\\SteadyCMS\\data\\" + filePath + "\\" + fileName, rawData, (err) => {
            if (err) throw err;
          }); 
      }
    });
  });

    // Write To File (IN APP DIR)
    ipcMain.on('writeToFileInAppDir', (event, rawData, filePath, fileName) => {
      mkdir(app.getAppPath() + "\\data\\" + filePath, { recursive: true }, (err) => {
        if (err){
          throw err;
        } else {
          writeFile(app.getAppPath() + "\\data\\" + filePath + "\\" + fileName, rawData, (err) => {
              if (err) throw err;
            }); 
        }
      });
    });

  // Check if File Exists (IN DOCUMENTS)
  ipcMain.handle('doesFileExist',  async (event, path) => {
    return existsSync(app.getPath('documents') + "\\SteadyCMS\\data\\" + path);
  });

  // Check if File Exists (IN APP DIR)
  ipcMain.handle('doesFileExistInAppDir',  async (event, path) => {
    return existsSync(app.getAppPath() + "\\data\\" + path);
  });

  // Run Hugo.exe
  ipcMain.on('runHugo', (event, commands) => {
  let fun = function(){
    console.log("RUN hugo Command(s): " + commands);
    execFile(app.getAppPath() + '\\static\\hugo.exe', commands, function(err, data) {
          console.log(err);
          console.log(data.toString());
      });
  }
  fun();
  });

  // Open url In Browser
  ipcMain.on('openInBrowser', (event, url) => {
    require('electron').shell.openExternal(url);
  });

  // Download File (TO DOCUMENTS)
  ipcMain.handle("downloadFile", async (event, url, info) => {
    info.properties.directory = app.getPath('documents') + info.properties.directory;
    await download(BrowserWindow.getFocusedWindow(), url, info.properties);
    return "done"; // TODO: must return file name
  });

  // Extract Zip File (FROM DOCUMENTS)
  ipcMain.handle("extractFile", async (event, source, target) => {
     try {
      let pathSource = app.getPath('documents') + source;
      let pathTarget = app.getPath('documents') + target;
     await decompress(pathSource, pathTarget);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  });

  // Delete file (IN DOCUMENTS)
  ipcMain.on('deleteFile', (event, path) => {
    let pathSource = app.getPath('documents') + path;
    try {
      rmSync(pathSource, {
        force: false,
      });
      //console.log('File is deleted.');
    } catch (err) {
      throw err
    }
  });






}); // On ready
