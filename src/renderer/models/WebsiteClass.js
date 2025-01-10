 export default class Website {
    static name = "";
    static folder = "";
    static appPath = "";
    static path = "";
    static contentPath = "";
    static mediaPath = "";
    static favicon = "";
    static logo = "";
    static serverHost = "";
    static serverPassword = "";
    static saveServerPassword = "";
    static serverUsername = "";
    static serverPort = "";
    static developmentMode = "";
    static images = [];

    constructor() {
    }

    loadInfo(){ // Load settings from local Storage
        let data = JSON.parse(localStorage.getItem("websiteData")); 
        Website.name = data.name;
        Website.folder = data.folder;
        Website.appPath = data.appPath;
        Website.contentPath = data.contentPath;
        Website.mediaPath = data.mediaPath;
        Website.favicon = data.favicon;
        Website.logo = data.logo;
        Website.serverHost = data.serverHost;
        Website.serverPassword = data.serverPassword;
        Website.saveServerPassword = data.saveServerPassword;
        Website.serverUsername = data.serverUsername;
        Website.serverPort = data.serverPort;
        Website.developmentMode = data.developmentMode;
        Website.images = data.images;
    }

    saveInfo(){  // Save settings to  local Storage
        let data = {
          "name": Website.name,
          "folder": Website.folder,
          "appPath": Website.appPath,
          "path": Website.path,
          "contentPath": Website.contentPath, 
          "mediaPath": Website.mediaPath,
          "favicon": Website.favicon,
          "logo": Website.logo,
          "serverHost": Website.serverHost,
          "serverUsername": Website.serverUsername,
          "serverPassword": Website.serverPassword,
          "saveServerPassword": Website.saveServerPassword,
          "serverPort": Website.serverPort,
          "developmentMode": Website.developmentMode,
          "images": Website.images
        };
        localStorage.setItem('websiteData', JSON.stringify(data)); 
    }
    
    setup(data){
      Website.name = data.name;
      Website.folder = data.folder;
      Website.appPath = data.appPath;
      Website.contentPath = data.contentPath;
      Website.mediaPath = data.mediaPath;
      Website.favicon = data.favicon;
      Website.logo = data.logo;
      Website.serverHost = data.serverHost;
      Website.serverPassword = data.serverPassword;
      Website.serverUsername = data.serverUsername;
      Website.saveServerPassword = data.saveServerPassword;
      Website.serverPort = data.serverPort;
      Website.developmentMode = data.developmentMode;
      Website.images = data.images;
    }


  }

















//OLD FORMAT
//   let siteSettings = {
//     "path": {
//       "folderName": websiteFolderName,
//       "displayName": websiteDisplayName,
//       "main": `${path}/SteadyCMS/`,
//       "site": "/sites/" + websiteFolderName + "/",
//       "content": "/sites/" + websiteFolderName + "/content/post/", // TODO: change "post" with var of folder name
//       "media": "/sites/" + websiteFolderName + "/static/",
//     },
//     "medadata": {
//       "favicon": "",
//       "logo": ""
//     },
//     "server": {
//       "host": "",
//       "username": "",
//       "password": "",
//       "savePassword": true,
//       "port": 22
//     },
//     "developmentMode": CMSDevelopmentMode.value,
//     "images": [
//     ]
//   };


