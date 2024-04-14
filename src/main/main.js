  import {app, BrowserWindow, ipcMain, session, protocol, net, shell} from 'electron';
  import {join} from 'path';

  import {readFileSync, mkdir, rmdirSync, writeFile, existsSync, rmSync, readdirSync, lstatSync, unlinkSync, copyFile, constants, copyFileSync} from 'fs';
  import {execFile} from 'child_process';
  import {download} from "electron-dl";
  import decompress from "decompress";


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
    } else {
      mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    }

    mainWindow.on('close', (e) => { // On close save the website settings to file
      mainWindow.webContents.executeJavaScript('localStorage.setItem("SteadyCMSInitialized", "false"); localStorage.getItem("currentSiteSettings");', true).then(result => {
         console.log(">>>>>>>>>");
         console.log(result);
        const currentWebsite = JSON.parse(result).path.site;
        mkdir(app.getPath('documents') + "/SteadyCMS/" + currentWebsite, { recursive: true }, (err) => {
          if (err){
            throw err;
          } else {
            writeFile(app.getPath('documents') + "/SteadyCMS/" + currentWebsite + "/site.settings.json", result, (err) => {
                if (err) throw err;
              }); 
          }
        }); 
      });
    });


  } // createWindow

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
     if (process.platform !== 'darwin') app.quit();
   });

   ipcMain.on('message', (event, message) => {
    if (!validateSender(event.senderFrame)) return null
     console.log(message);
   });

// API 

  /** 
   * Reads the full contents of a file 
   * @param {String} path - The full path to the file
   * @returns {String} The full contents of file
   */ 
  ipcMain.handle('readFromFile',  async (event, path) => {
    console.log("M 1")
    if (!validateSender(event.senderFrame)) return null;
    const data = readFileSync(path);
    return data.toString();
  });

   /** 
   * Reads the full contents of a file in the app directory
   * @param {String} path - The path to the file in the app directory
   * @returns {String} The full contents of the file
   */ 
  ipcMain.handle('readFileInAppDir',  async (event, path) => {
    console.log("M 2")
    if (!validateSender(event.senderFrame)) return null;
    const data = readFileSync(app.getAppPath() + "/SteadyCMS/" + path);
    return data.toString();
  });

   /** 
   * Writes given String to given file. Overwrites all existing content!
   * @param {String} rawData - The string to be written to file
   * @param {String} filePath - The path to the directory where the file is
   * @param {String} fileName - The name of the file to be written to
   */ 
  ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
    console.log("M 3")
    if (!validateSender(event.senderFrame)) return null;
    mkdir(filePath, { recursive: true }, (err) => {
      if (err){
        throw err;
      } else {
        writeFile(filePath + "/" + fileName, rawData, (err) => {
          if (err) throw err;
        }); 
      }
    }); 
  });

   /** 
   * Writes given String to given file in app directory. Overwrites all existing content!
   * @param {String} rawData - The string to be written to file
   * @param {String} filePath - The path to the directory where the file is starting from the app's directory
   * @param {String} fileName - The name of the file to be written to
   */ 
    ipcMain.on('writeToFileInAppDir', (event, rawData, filePath, fileName) => {
      console.log("M 4")
      if (!validateSender(event.senderFrame)) return null;
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

  /**
   * Check if file exist at given path
   * @param {String} path - The full path to file
   */
  ipcMain.handle('doesFileExist',  async (event, path) => {
    console.log("M 5")
    if (!validateSender(event.senderFrame)) return null;
    return existsSync(path);
  });

  /**
   * Check if file exist at given path in app directory
   * @param {String} path - Path to file starting from the app directory
   */
  ipcMain.handle('doesFileExistInAppDir',  async (event, path) => {
    console.log("M 6")
    if (!validateSender(event.senderFrame)) return null;
    return existsSync(app.getAppPath() + "/SteadyCMS/" + path);
  });

  /**
   * Run terminal commands on the hugo.exe (Only Hugo commands are accepted and "hugo" already prefixs commands)
   * @param {Array} commands - The command to be executed (Each word of the command must be broken up into the array)
   * @example Example of an array to create an new website in Hugo
   * ['new', 'site', FILE-PATH]
   * @example Example of an array to start a hugo sever to perview a website
   * ['server', '--source', PATH-TO-WEBSITE, '-b', 'http://localhost/', '--port', THE-PORT-NUMBER]
   * @example Example of an array to build a hugo website
   * ['--source', pathToWebsite]
   */
  ipcMain.handle('runHugo', async (event, commands) => {
    console.log("M 7")
    if (!validateSender(event.senderFrame)) return null
    console.log("RUN hugo Command(s): " + commands);
      const util = require('util');
      const execFile = util.promisify(require('child_process').execFile);
      const { stdout } = await execFile(app.getAppPath() + '/static/hugo.exe', commands);
      return stdout;
  });

  /**
   * Openings giving URL in the defult browser, in a new tab
   * @param {String} url - The url to be opened
   */
  ipcMain.on('openInBrowser', (event, url) => {
    if (!validateSender(event.senderFrame)) return null;
    require('electron').shell.openExternal(url);
  });

  /**
   * Downloads a file from a given URL to the users storage (Path is scoped to the 'SteadyCMS' directory)
   * Note: PATH is the path to the directory the file is to downloaded to (Scoped to '/documents/SteadyCMS/').
   * See docs for more info ("decompress" library)
   * @param {String} url - The URL of the file that is to be downloaded
   * @param {Object} info - Object with download settings
   * @example { properties: {directory: PATH, showBadge: false, showProgressBar: true} }
   * @returns Unknown (To be added)
   */
  ipcMain.handle("downloadFile", async (event, url, info) => {
    console.log("M 8")
    if (!validateSender(event.senderFrame)) return null
    info.properties.directory = app.getPath('documents') + '/SteadyCMS/' + info.properties.directory;
    await download(BrowserWindow.getFocusedWindow(), url, info.properties);
    return "done"; // TODO?: must return file name
  });

  /**
   * Extract a zip file to given directory
   * @param {String} source - Full path to the zip file to be extracted
   * @param {String} target - Full path to the directory the file is to be extracted to
   * @returns true if successfull, otherwise false
   */
  ipcMain.handle("extractFile", async (event, source, target) => {
    console.log("M 9")
    if (!validateSender(event.senderFrame)) return null
     try {
     await decompress(source, target);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  });

  /**
   * Deletes a file from the app directory
   * @param {String} path - Path to file to be deleted. (Path is scoped to the 'SteadyCMS' directory)
   */
  ipcMain.on('deleteFileInAppDir', (event, path) => {
    console.log("M 10")
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

  /**
   * Deletes given file at given path  (Path is scoped to the'/documents/SteadyCMS/' directory by defult)
   * @param {String} path - Path to file to be deleted. (Scoped to '/documents/SteadyCMS/' unless scoped is false).
   * @param {Boolean} scoped - If the path should be scoped to '/documents/SteadyCMS/'
   */
  ipcMain.on('deleteFile', (event, path, scoped) => {
    console.log("M 11")
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

  /**
   * Deletes given file directory at given path (Path is scoped to the'/documents/SteadyCMS/') 
   * @param {String} path - Path to the directory to be deleted. (Scoped to '/documents/SteadyCMS/').
   * @warning Use with care!
   */
    ipcMain.on('deleteDir', (event, path) => {
      console.log("M 12")
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

  /**
   * Request the path to given place
   * @param {String} place - The requested place
   * Availble places:
   * "documents": Directory for a user's "My Documents" ("/documents/").
   * "appdir": Apps directory 
   * "home": User's home directory.
   * "temp": Temporary directory.
   * "userdata": The directory for storing your app's configuration files, which by default is the appData directory appended with your app's name. By convention files storing user data should be written to this directory, and it is not recommended to write large files here because some environments may backup this directory to cloud storage.
   * "desktop": The current user's Desktop directory.
   * "downloads": Directory for a user's downloads.
   * "music": Directory for a user's music.
   * "pictures": Directory for a user's pictures.
   * "videos": Directory for a user's videos.
   * "SteadyCMS": To Steady CMS's main directory ("/documents/SteadyCMS/").
   */
  ipcMain.handle('getPathTo', (event, place) => {
    console.log("M 13")
    if (!validateSender(event.senderFrame)) return null
    switch (place) {
      case "documents":
        return app.getPath('documents');

      case "appdir": 
        return app.getAppPath();

      case "home": 
        return app.getPath('home');

      case "temp": 
        return app.getPath('temp');

      case "userdata": 
        return app.getPath('userData');

      case "desktop": 
        return app.getPath('desktop');
        
      case "downloads": 
        return app.getPath('downloads');

      case "music":
        return app.getPath('music');

      case "pictures": 
        return app.getPath('pictures');

      case "videos": 
        return app.getPath('videos');

      case "SteadyCMS": 
      case "steadyCMS": 
        return app.getPath('documents') + '/SteadyCMS/';

      default: 
        console.log(place + "! Not Found. Returning default path [getPathTo:main.js]")
        return app.getPath('documents');
    }
  });

  /**
   * Gets a list of directories in given directory
   * @param {String} rootDir - The full path to the directory to be searched
   * @returns {Array} List of directory
   */
  ipcMain.handle('getDirsIn', (event, rootDir) => {
    console.log("M 14")
    if (!validateSender(event.senderFrame)) return null;
    try {
      return readdirSync(rootDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    }
  });

  /**
   * Gets a list of files in given directory by file type
   * @param {String} directory - The full path to the directory to be searched for files
   * @param {String} fileType - The type of file to be searched for (i.e ".png", ".txt", ".markdown")
   * @returns {Array} List of files
   */
  ipcMain.handle('getFilesIn', (event, directory, fileType) => {
    console.log("M 15")
    if (!validateSender(event.senderFrame)) return null;
    try {
      return readdirSync(directory, { withFileTypes: true })
      .filter(dirent => dirent.name.endsWith(fileType))
      .map(dirent => dirent.name);
    } catch (error) {
      return "error";
    } 
  });

  /**
   * Copy a file from one given directory to another given directory
   *  @param {String} source - Full path to the file to be copied
   *  @param {String} destination - Full path to the directory the file will be copied to
   * @returns {Boolean} true if successfull, otherwise false
   */
  ipcMain.handle('copyFile', async (event, source, destination) => {
    console.log("M 16")
    if (!validateSender(event.senderFrame)) return null;
    try {
      copyFileSync(source, destination, constants.COPYFILE_EXCL); 
    } catch (error) {
      console.log("ERROR:")
      console.log(error.toString())
      return false;
    }
    return true;
  });


  /**
   * Open terminal at a given directory
   * @param {string} path - Full path to be opened in terminal
  */ 
  ipcMain.on('openTerminal', (event, path) => {
    console.log("M 17")
    if (!validateSender(event.senderFrame)) return null;
    try {
      var cp = require('child_process');
      cp.spawn('cmd', ['/C', 'start cmd', `"/K cd ${path}"`]);
    } catch (error) {
      console.log("ERROR:")
      console.log(error.toString())
      return false;
    }
    return true;
  });

  /**
   * Open File Explorer at a given path
   * @param {string} path - Full path to be opened in File Explorer Note: MUST be to a file not just a directory (i.e "path/path/file.txt", NOT "path/path/")
  */ 
    ipcMain.on('openFileExplorer', (event, path) => {
      console.log("M 18")
      if (!validateSender(event.senderFrame)) return null;
      try {
        shell.showItemInFolder(path.replace(/\//g, "\\"));
      } catch (error) {
        console.log("ERROR:")
        console.log(error.toString())
        return false;
      }
      return true;
    });



  function validateSender (frame) {
    //console.log((new URL(frame.url)).host)
    // Value the host of the URL using an actual URL parser and an allowlist
    if ((new URL(frame.url)).host === 'electronjs.org' || (new URL(frame.url)).host === 'localhost:8080') return true
    return false

  }

}); // On ready
