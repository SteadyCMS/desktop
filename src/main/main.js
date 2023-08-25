  import {app, BrowserWindow, ipcMain, session} from 'electron';
  import {join} from 'path';

  import {readFileSync, mkdir, rmdirSync, writeFile, existsSync, rmSync, readdirSync} from 'fs';
  import {execFile} from 'child_process';
  import {download} from "electron-dl";
  import decompress from "decompress";

  //process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  
  function createWindow () {
    const mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      minWidth: 1000,
      minHeight: 800,
      icon: 'src/renderer/assets/images/steady-cms-logomark.png', 
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
    const filePath = app.getPath('documents') + "/SteadyCMS/" + path;
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Read From File (IN APP DIR)
  ipcMain.handle('readFileInAppDir',  async (event, path) => {
    const filePath = app.getAppPath()+  "/SteadyCMS/" + path;
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Write To File (IN DOCUMENTS)
  ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
    mkdir(app.getPath('documents') + "/SteadyCMS/" + filePath, { recursive: true }, (err) => {
      if (err){
        throw err;
      } else {
        writeFile(app.getPath('documents') + "/SteadyCMS/" + filePath + "/" + fileName, rawData, (err) => {
            if (err) throw err;
          }); 
      }
    });
  });

    // Write To File (IN APP DIR)
    ipcMain.on('writeToFileInAppDir', (event, rawData, filePath, fileName) => {
      mkdir(app.getAppPath() + "/SteadyCMS/" + filePath, { recursive: true }, (err) => {
        if (err){
          throw err;
        } else {
          writeFile(app.getAppPath() + "/SteadyCMS/" + filePath + "/" + fileName, rawData, (err) => {
              if (err) throw err;
            }); 
        }
      });
    });

  // Check if File Exists (IN DOCUMENTS)
  ipcMain.handle('doesFileExist',  async (event, path) => {
    return existsSync(app.getPath('documents') + "/SteadyCMS/" + path);
  });

  // Check if File Exists (IN APP DIR)
  ipcMain.handle('doesFileExistInAppDir',  async (event, path) => {
    return existsSync(app.getAppPath() + "/SteadyCMS/" + path);
  });

  // Run Hugo.exe
  ipcMain.on('runHugo', (event, commands) => {
    console.log("RUN hugo Command(s): " + commands);
     execFile(app.getAppPath() + '/static/hugo.exe', commands, function(err, data) {
          console.log(err);
          console.log(data.toString());
      });
  });

  // Open url In Browser
  ipcMain.on('openInBrowser', (event, url) => {
    require('electron').shell.openExternal(url);
  });

  // Download File (TO DOCUMENTS)
  ipcMain.handle("downloadFile", async (event, url, info) => {
    info.properties.directory = app.getPath('documents') + '/SteadyCMS/' + info.properties.directory;
    await download(BrowserWindow.getFocusedWindow(), url, info.properties);
    return "done"; // TODO?: must return file name
  });

  // Extract Zip File (FROM DOCUMENTS)
  ipcMain.handle("extractFile", async (event, source, target) => {
     try {
      let pathSource = app.getPath('documents') + '/SteadyCMS/' + source;
      let pathTarget = app.getPath('documents') + '/SteadyCMS/' + target;
     await decompress(pathSource, pathTarget);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  });

  // Delete file (IN DOCUMENTS)
  ipcMain.on('deleteFile', (event, path) => {
    let pathSource = app.getPath('documents') + '/SteadyCMS/' + path;
    try {
      rmSync(pathSource, {
        force: false,
      });
      //console.log('File is deleted.');
    } catch (err) {
      throw err
    }
  });

    // Delete Dir (IN DOCUMENTS)
    ipcMain.on('deleteDir', (event, path) => {
      let pathSource = app.getPath('documents') + '/SteadyCMS/' + path;
      try {
        rmdirSync(pathSource, {
          force: false,
        });
      } catch (err) {
        throw err
      }
    });
  
  // Get Paths
  ipcMain.handle('getPathTo', (event, place) => {
 
    switch (place) {
      case "documents": //  Directory for a user's "My Documents".
        return app.getPath('documents');

      case "appdir": // Our app directory path
        return app.getAppPath();

      case "home": //  User's home directory.
        return app.getPath('home');

      case "temp": // Temporary directory.
        return app.getPath('temp');

      case "userdata": //  The directory for storing your app's configuration files, which by default is the appData directory appended with your app's name. By convention files storing user data should be written to this directory, and it is not recommended to write large files here because some environments may backup this directory to cloud storage.
        return app.getPath('userData');

      case "desktop": // The current user's Desktop directory.
        return app.getPath('desktop');
        
      case "downloads": //  Directory for a user's downloads.
        return app.getPath('downloads');

      case "music": // Directory for a user's music.
        return app.getPath('music');

      case "pictures": // Directory for a user's pictures.
        return app.getPath('pictures');

      case "videos": // Directory for a user's videos.
        return app.getPath('videos');

      case "steady": // To Steady CMS's main directory
        return app.getPath('documents') + '/steadyCMS/';

      default: // default : Our app directory path
        console.log(place + "! Not Found. Returning default path [getPathTo:main.js]")
        return app.getAppPath();
    }
  });

  // Gets a list of dir in dir
  ipcMain.handle('getDirsIn', (event, rootDir) => {
    try {
      return readdirSync(rootDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    }
  });

  // Gets a list of files in dir (Only .markdown)
  ipcMain.handle('getFilesIn', (event, dir) => {
    try {
      return readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.name.endsWith(".markdown"))
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    }

  });
 
}); // On ready
