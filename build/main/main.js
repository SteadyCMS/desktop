"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
//import open from 'open';
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 1000,
        minHeight: 800,
        icon: 'src/renderer/assets/images/steady-cms-logomark.png',
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
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
        mainWindow.loadFile((0, path_1.join)(electron_1.app.getAppPath(), 'renderer', 'index.html'));
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: Object.assign(Object.assign({}, details.responseHeaders), { 'Content-Security-Policy': ['script-src \'self\''] })
        });
    });
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.on('message', (event, message) => {
    console.log(message);
});
// Mine
electron_1.ipcMain.handle('readFromFile', (event, path) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = (0, path_1.join)(electron_1.app.getAppPath(), "\\data\\" + path);
    const data = (0, fs_1.readFileSync)(filePath);
    return data.toString();
}));
// Mine
electron_1.ipcMain.on('writeToFile', (event, rawData, filePath, fileName) => {
    (0, fs_1.mkdir)(electron_1.app.getAppPath() + "\\data\\" + filePath, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        else {
            (0, fs_1.writeFile)(electron_1.app.getAppPath() + "\\data\\" + filePath + "\\" + fileName, rawData, (err) => {
                if (err)
                    throw err;
            });
        }
    });
});
// Mine
electron_1.ipcMain.handle('doesFileExist', (event, path) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, fs_1.existsSync)(electron_1.app.getAppPath() + "\\data\\" + path);
}));
// mine
electron_1.ipcMain.on('runHugo', (event, commands) => {
    let fun = function () {
        console.log("RUN hugo Command(s): " + commands);
        (0, child_process_1.execFile)(electron_1.app.getAppPath() + '\\static\\hugo.exe', commands, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    };
    fun();
});
// Mine
electron_1.ipcMain.on('openInBrowser', (event, url) => {
    require('electron').shell.openExternal(url);
    //open(url);
});
