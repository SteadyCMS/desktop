
    export function openInBrowser(websiteAdress) {
        window.electronAPI.openInBrowser(websiteAdress);
        }

    // Write To File (IN DOCUMENTS)
    export async function writeToFile(content, path, fileName) {
        return await window.electronAPI.writeToFile(content, path, fileName);
        }

    // Read From File (IN DOCUMENTS)
    export async function readFile(path) {
            const exists = await window.electronAPI.doesFileExist(path);
            if(exists){
                const rawData = await window.electronAPI.readFile(path);
                return { success: true, data: rawData };
            }else{
                return { success: false, data: path + " File does not exists."};
            }
        }

    // Write To File (IN APP DIR)
    export async function writeToFileInAppDir(content, path, fileName) {
        return await window.electronAPI.writeToFileInAppDir(content, path, fileName);
        }

    // Read From File (IN APP DIR)
    export async function readFileInAppDir(path) {
            const exists = await window.electronAPI.doesFileExistInAppDir(path);
            if(exists){
                const rawData = await window.electronAPI.readFileInAppDir(path);
                return { success: true, data: rawData };
            }else{
                return { success: false, data: path + "File does not exists."};
            }
        }

    // Download File (TO DOCUMENTS)
    export async function downloadFile(url, directory) {
            const data = await window.electronAPI.downloadFile(url, directory);
            return data;
    }

    // Extract zip File (IN DOCUMENTS)
    export async function extractFile(source, target) {
        const data = await window.electronAPI.extractFile(source, target);
        return data;
    }

    // Delete File (IN APP DIR)
    export async function deleteFileInAppDir(path) {
        await window.electronAPI.deleteFileInAppDir(path);
        }

    // Delete File (IN DOCUMENTS)
    export async function deleteFile(path) {
        await window.electronAPI.deleteFile(path);
        }

    // Delete Dir (IN DOCUMENTS)
    export async function deleteDir(path) {
        await window.electronAPI.deleteDir(path);
        }

    // Check if file exsists (IN DOCUMENTS)
    export async function doesFileExist(path) {
        const data = await window.electronAPI.doesFileExist(path);
        return data;
        }

    // Check if file exsists (IN APP DIR)
    export async function doesFileExistInAppDir(path) {
        const data = await window.electronAPI.doesFileExistInAppDir(path);
        return data;
        }
        
    // Get Paths
    export async function getPathTo(place) {
        const path = await window.electronAPI.getPathTo(place);
        return path;
        }
        
    // Get Dirs
    export function getDirsIn(rootDir) {
        const dirs =  window.electronAPI.getDirsIn(rootDir);
        return dirs;
        }

    // Get Files
    export function getFilesIn(dir) {
        const files =  window.electronAPI.getFilesIn(dir);
        return files;
        }
  
