const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => callback({responseHeaders:{...details.responseHeaders,'Content-Security-Policy':["default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://openaccess-cdn.clevelandart.org data:; connect-src 'self' https://openaccess-api.clevelandart.org; object-src 'none'; base-uri 'none'"]}}));
  function open() {
    const win = new BrowserWindow({width:1360,height:920,minWidth:900,minHeight:720,backgroundColor:'#141b18',autoHideMenuBar:true,title:'ArtLoft',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
    win.webContents.setWindowOpenHandler(() => ({action:'deny'}));
    win.webContents.on('will-navigate', event => event.preventDefault());
    win.loadFile(path.join(__dirname,'index.html'));
  }
  open(); app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length) open();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin') app.quit();});
