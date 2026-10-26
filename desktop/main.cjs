'use strict';
/**
 * OmniditeOS Electron host. The app uses a private secure custom origin
 * for stable localStorage (unlike file:// or a random localhost port).
 * There is no embedded API server and no remote code loaded.
 */
const {app,BrowserWindow,protocol,session,shell}=require('electron');
const {readFile}=require('node:fs/promises');
const path=require('node:path');

protocol.registerSchemesAsPrivileged([{
  scheme:'osapp',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}
}]);

const allowed=new Set([
  'index.html','app.js','seed.js','styles.css',
  'oskit/core.mjs','oskit/ui.mjs','oskit/ui.css','oskit/access.css',
  'oskit/boot.mjs','oskit/profiles/omnidite.mjs',
  'manifest.webmanifest','assets/os-icon.svg'
]);
const mime={
  '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.svg':'image/svg+xml','.webmanifest':'application/manifest+json'
};
const contentSecurityPolicy="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'";

async function serve(request){
  try {
    const url=new URL(request.url);
    if(url.host!=='omnidite')return new Response('Not found',{status:404});
    const requested=url.pathname.replace(/^\/+/, '')||'index.html';
    if(!allowed.has(requested))return new Response('Not found',{status:404});
    const file=path.join(__dirname,'..',requested);
    const body=await readFile(file);
    return new Response(body,{status:200,headers:{
      'Content-Type':mime[path.extname(file)]||'application/octet-stream',
      'Content-Security-Policy':contentSecurityPolicy,
      'X-Content-Type-Options':'nosniff'
    }});
  }catch{return new Response('Not found',{status:404});}
}
let window;
function createWindow(){
  window=new BrowserWindow({
    title:'Omnidite OS',width:1320,height:860,minWidth:800,minHeight:560,
    backgroundColor:'#0b1f33',show:false,autoHideMenuBar:true,
    webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}
  });
  window.webContents.setWindowOpenHandler(({url})=>{
    // No implicit access to local disk, arbitrary schemes or child windows.
    if(/^https:\/\/[^/\s]+/.test(url))shell.openExternal(url).catch(()=>{});
    return {action:'deny'};
  });
  window.webContents.on('will-navigate',(event,url)=>{
    if(!url.startsWith('osapp://omnidite/'))event.preventDefault();
  });
  window.once('ready-to-show',()=>window?.show());
  window.loadURL('osapp://omnidite/index.html');
}
app.whenReady().then(()=>{
  app.setAppUserModelId('com.omnidite.os');
  session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  protocol.handle('osapp',serve);
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
}).catch(err=>{console.error(err);app.quit();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
