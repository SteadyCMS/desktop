
    export function openInBrowser(websiteAdress) {
        window.electronAPI.openInBrowser(websiteAdress);
        }

    // Write To File (IN DOCUMENTS)
    export function writeToFile(content, path, fileName) {
        window.electronAPI.writeToFile(content, path, fileName);
        }

    // Read From File (IN DOCUMENTS)
    export async function readFile(path) {
            const exists = await window.electronAPI.doesFileExist(path);
            if(exists){
                const rawData = await window.electronAPI.readFile(path);
                return { success: true, data: rawData };
            }else{
                return { success: false, data: path + "File does not exists."};
            }
        }

    // Write To File (IN APP DIR)
    export function writeToFileInAppDir(content, path, fileName) {
        window.electronAPI.writeToFile(content, path, fileName);
        }

    // Read From File (IN APP DIR)
    export async function readFileInAppDir(path) {
            const exists = await window.electronAPI.doesFileExist(path);
            if(exists){
                const rawData = await window.electronAPI.readFile(path);
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

    // extract zip File (IN DOCUMENTS)
    export async function extractFile(source, target) {
        const data = await window.electronAPI.extractFile(source, target);
        return data;
    }

    // Delete File (IN DOCUMENTS)
    export async function deleteFile(path) {
        await window.electronAPI.deleteFile(path);
        }

