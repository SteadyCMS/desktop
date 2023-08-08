import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';

import {readFileSync, mkdir, writeFile, existsSync} from 'fs';
import {execFile} from 'child_process';
//import open from 'open';


function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

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
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

// Mine
ipcMain.handle('readFromFile',  async (event, path) => {
  const filePath = join(app.getAppPath(),  "\\data\\" + path);
  const data = readFileSync(filePath);
  return data.toString();
})


// Mine
ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
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

// Mine
ipcMain.handle('doesFileExist',  async (event, path) => {
  return existsSync(app.getAppPath() + "\\data\\" + path);
})


// mine
ipcMain.on('runHugo', (event, commands) => {
let fun = function(){
   console.log("RUN hugo Command(s): " + commands);
   execFile(app.getAppPath() + '\\static\\hugo.exe', commands, function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}
fun();
})


// Mine
ipcMain.on('openInBrowser', (event, url) => {
  require('electron').shell.openExternal(url);
  //open(url);
});













