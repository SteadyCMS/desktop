


export function titleToFileName(postTitle) {
    return postTitle.trim().replaceAll(" ", "-").replace(/[`_!@#$%^&*()+.=\[\]{};':"/|,<>\/?~]/g, "-").toLowerCase();
  } 

  export function fileNameToTitle(fileName) {
    const rawName = fileName[0].toUpperCase() + fileName.slice(1);
    return rawName.replaceAll('_', ' ').replaceAll('-', ' ');
  } 

  export function siteToFolderName(name) {
    return name.trim().replaceAll(" ", "_").replace(/[`_!@#$%^&*()+.=\[\]{};':"/|,<>\/?~]/g, "_").toLowerCase();
  }