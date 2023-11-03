  import {app, BrowserWindow, ipcMain, session, protocol, net} from 'electron';
  import {join} from 'path';

  import {readFileSync, mkdir, rmdirSync, writeFile, existsSync, rmSync, readdirSync, lstatSync, unlinkSync, copyFile, constants, copyFileSync} from 'fs';
  import {execFile} from 'child_process';
  import {download} from "electron-dl";
  import decompress from "decompress";
  // import { copyFile, constants } from 'node:fs';

  
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
        webSecurity: app.isPackaged
      // devTools: false,
      }
    });
    console.log(`${__dirname}`)
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
    if (!validateSender(event.senderFrame)) return null
     console.log(message);
   });

// MY Stuff

  // Read From File (IN DOCUMENTS)
  ipcMain.handle('readFromFile',  async (event, path) => {
    if (!validateSender(event.senderFrame)) return null
    const filePath = app.getPath('documents') + "/SteadyCMS/" + path;
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Read From File (IN APP DIR)
  ipcMain.handle('readFileInAppDir',  async (event, path) => {
    if (!validateSender(event.senderFrame)) return null
    const filePath = app.getAppPath()+  "/SteadyCMS/" + path;
    const data = readFileSync(filePath);
    return data.toString();
  });

  // Write To File (IN DOCUMENTS)
  ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
    if (!validateSender(event.senderFrame)) return null
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
      if (!validateSender(event.senderFrame)) return null
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
    if (!validateSender(event.senderFrame)) return null
    return existsSync(app.getPath('documents') + "/SteadyCMS/" + path);
  });

  // Check if File Exists (IN APP DIR)
  ipcMain.handle('doesFileExistInAppDir',  async (event, path) => {
    if (!validateSender(event.senderFrame)) return null
    return existsSync(app.getAppPath() + "/SteadyCMS/" + path);
  });

  // Run Hugo.exe
  ipcMain.on('runHugo', (event, commands) => {
    if (!validateSender(event.senderFrame)) return null
    console.log("RUN hugo Command(s): " + commands);
     execFile(app.getAppPath() + '/static/hugo.exe', commands, function(err, data) {
          console.log(err);
          console.log(data.toString());
      });
  });

  // Open url In Browser
  ipcMain.on('openInBrowser', (event, url) => {
    if (!validateSender(event.senderFrame)) return null
    require('electron').shell.openExternal(url);
  });

  // Download File (TO DOCUMENTS)
  ipcMain.handle("downloadFile", async (event, url, info) => {
    if (!validateSender(event.senderFrame)) return null
    info.properties.directory = app.getPath('documents') + '/SteadyCMS/' + info.properties.directory;
    await download(BrowserWindow.getFocusedWindow(), url, info.properties);
    return "done"; // TODO?: must return file name
  });

  // Extract Zip File (FROM DOCUMENTS)
  ipcMain.handle("extractFile", async (event, source, target) => {
    if (!validateSender(event.senderFrame)) return null
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

  // Delete file (IN APP DIR)
  ipcMain.on('deleteFileInAppDir', (event, path) => {
    if (!validateSender(event.senderFrame)) return null
    let pathSource = app.getAppPath() + "/SteadyCMS/" + path;
    try {
      rmSync(pathSource, {
        force: false,
      });
    } catch (err) {
      throw err
    }
  });

  // Delete file (IN DOCUMENTS)
  ipcMain.on('deleteFile', (event, path, scoped) => {
    if (!validateSender(event.senderFrame)) return null
    let pathSource;
    if (scoped == undefined || scoped == true) {
      pathSource = app.getPath('documents') + '/SteadyCMS/' + path;
    } else {
      pathSource = path;
    }
    try {
      rmSync(pathSource, {
        force: false,
      });
    } catch (err) {
      throw err
    }
  });

    // Delete Dir (IN DOCUMENTS)
    ipcMain.on('deleteDir', (event, path) => {
      if (!validateSender(event.senderFrame)) return null
      let pathSource = app.getPath('documents') + '/SteadyCMS/' + path;
      try {
        const deleteFolderRecursive = function (directoryPath) {
          if (existsSync(directoryPath)) {
              readdirSync(directoryPath).forEach((file, index) => {
                const curPath = join(directoryPath, file);
                if (lstatSync(curPath).isDirectory()) {
                 // recurse
                  deleteFolderRecursive(curPath);
                } else {
                  // delete file
                  unlinkSync(curPath);
                }
              });
              rmdirSync(directoryPath);
            }
          };
          deleteFolderRecursive(pathSource);
      } catch (err) {
        throw err
      }
    });

  // Get Paths
  ipcMain.handle('getPathTo', (event, place) => {
    if (!validateSender(event.senderFrame)) return null

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
    if (!validateSender(event.senderFrame)) return null
    try {
      return readdirSync(rootDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    }
  });

  // Gets a list of files in dir by file type
  ipcMain.handle('getFilesIn', (event, dir, fileType) => {
    if (!validateSender(event.senderFrame)) return null
    try {
      return readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.name.endsWith(fileType))
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    }
  });

  ipcMain.handle('copyFile', async (event, src, des) => {
    if (!validateSender(event.senderFrame)) return null;
    try {
      copyFileSync(src, app.getPath('documents') + "/SteadyCMS/" + des, constants.COPYFILE_EXCL); 
    } catch (error) {
      return false;
    }
    return true;
  });

    // let callback = (err) =>{
    //   if (err){
    //     console.log(err);
    //     return "false";
    //   } else {
    //     console.log('File was copied');
    //     return "true";
    //   }
    // }
    //  copyFile(src, app.getPath('documents') + "/SteadyCMS/" + des, constants.COPYFILE_EXCL, callback);


  function validateSender (frame) {
    //console.log((new URL(frame.url)).host)
    // Value the host of the URL using an actual URL parser and an allowlist
    if ((new URL(frame.url)).host === 'electronjs.org' || (new URL(frame.url)).host === 'localhost:8080') return true
    return false

  }

}); // On ready
