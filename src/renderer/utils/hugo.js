

// For running Hugo things

export function startServer(pathToWebsite) {
    window.electronAPI.runHugo(['server', '-s', pathToWebsite ]);
  }

export async function createNewSite(pathToWebsite) {
  await window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
  }





















