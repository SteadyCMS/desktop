

// For running Hugo things

  export function startServer(port, pathToWebsite) {
    window.electronAPI.runHugo(['server', '--source', pathToWebsite, '-b', 'http://localhost/', '--port', port]);
  } 

export async function createNewSite(pathToWebsite) {
  await window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
  }

  export async function buildNewSite(pathToWebsite) {
    await window.electronAPI.runHugo(['--source', pathToWebsite]);
    }
















