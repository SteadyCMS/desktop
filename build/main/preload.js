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
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => electron_1.ipcRenderer.send('message', message),
    // readFromFile: (path) => ipcRenderer.send('readFromFile', path),
    writeToFile: (data, filePath, fileName) => electron_1.ipcRenderer.send('writeToFile', data, filePath, fileName),
    runHugo: (commands) => electron_1.ipcRenderer.send('runHugo', commands),
    readFile: (path) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield electron_1.ipcRenderer.invoke('readFromFile', path);
        return data;
    }),
});
