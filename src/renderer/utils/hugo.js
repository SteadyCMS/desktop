

// For running Hugo

export function startServer(pathToWebsite) {
    window.electronAPI.runHugo(['server', '-s', pathToWebsite ]);
  }

export function createNewSite(pathToWebsite) {
  window.electronAPI.runHugo(['new', 'site', pathToWebsite]);
  }






















