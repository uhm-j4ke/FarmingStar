'use strict';
const {app,BrowserWindow,Menu,dialog,ipcMain,protocol,session}=require('electron');
const fs=require('node:fs'),path=require('node:path'),{Store,readBounded,writeAtomic,LIMIT}=require('./store.cjs'),config=require('../release/release-config.json');
const ENTRY='farmingstar://app/index.html';let window,store,pickerOpen=false,closing=false,quitRequested=false;
app.setName(config.productName);
app.on('before-quit',()=>{quitRequested=true});
if(process.env.FARMINGSTAR_E2E==='1'&&process.env.FARMINGSTAR_QA_DATA)app.setPath('userData',path.resolve(process.env.FARMINGSTAR_QA_DATA));
protocol.registerSchemesAsPrivileged([{scheme:'farmingstar',privileges:{standard:true,secure:true}}]);
const single=app.requestSingleInstanceLock();if(!single)app.quit();
else{
 app.on('second-instance',()=>{if(window&&!window.isDestroyed()){if(window.isMinimized())window.restore();window.focus()}});
 app.whenReady().then(()=>{
  store=new Store(app.getPath('userData'));
  protocol.handle('farmingstar',request=>request.url===ENTRY&&request.method==='GET'?new Response(fs.readFileSync(path.join(__dirname,'../dist/web/index.html')),{headers:{'Content-Type':'text/html; charset=utf-8'}}):new Response('Offline application',{status:403}));
  session.defaultSession.setPermissionRequestHandler((contents,permission,callback)=>callback(false));
  session.defaultSession.setPermissionCheckHandler(()=>false);
  session.defaultSession.webRequest.onBeforeRequest((details,callback)=>callback({cancel:details.url!==ENTRY&&!/^(data|blob):/.test(details.url)}));
  ipcMain.on('farm:storage',(event,method,...args)=>{
   try{
    if(!trusted(event))throw Error('Untrusted storage request');let value;
    if(method==='get')value=store.get(args[0]);else if(method==='put')value=store.put(args[0],args[1]);
    else if(method==='batch'){if(typeof args[0]!=='string'||Buffer.byteLength(args[0])>32*1024*1024)throw Error('Invalid import transaction');value=store.batch(JSON.parse(args[0]))}
    else throw Error('Unknown storage operation');event.returnValue={ok:true,value};
   }catch(error){event.returnValue={ok:false,error:error.message}}
  });
  ipcMain.on('farm:import',async event=>{
   if(!trusted(event)||pickerOpen)return;pickerOpen=true;
   try{const result=await dialog.showOpenDialog(window,{title:'Import FarmingStar save',properties:['openFile'],filters:[{name:'FarmingStar portable save',extensions:['json']}]});if(result.canceled)return await files('cancel');const text=readBounded(result.filePaths[0],LIMIT);await files('receiveImport',text)}catch(error){await files('error','Import could not be read: '+error.message)}finally{pickerOpen=false}
  });
  ipcMain.on('farm:export',async(event,name,text)=>{
   if(!trusted(event)||pickerOpen)return;pickerOpen=true;
   try{if(typeof text!=='string'||Buffer.byteLength(text)>LIMIT||typeof name!=='string')throw Error('Invalid portable save');const result=await dialog.showSaveDialog(window,{title:'Export FarmingStar save',defaultPath:name.replace(/[^A-Za-z0-9._-]/g,'_').slice(0,100),filters:[{name:'FarmingStar portable save',extensions:['json']}],properties:['showOverwriteConfirmation']});if(result.canceled)return await files('cancel');writeAtomic(result.filePath,text);await files('exportResult',true)}catch(error){await files('error','Export could not be written: '+error.message)}finally{pickerOpen=false}
  });
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
 }).catch(error=>{dialog.showErrorBox('FarmingStar could not start',error.message+'\nExisting saved data has been retained.');app.exit(1)});
}
function trusted(event){return window&&!window.isDestroyed()&&event.sender===window.webContents&&event.senderFrame?.url===ENTRY}
async function files(method,...args){if(window&&!window.isDestroyed()&&window.webContents.getURL()===ENTRY)try{await window.webContents.executeJavaScript('window.FarmingStarFiles&&window.FarmingStarFiles['+JSON.stringify(method)+'](...'+JSON.stringify(args)+')')}catch{}}
function lifecycle(method){if(!window||window.isDestroyed())return Promise.resolve(false);return window.webContents.executeJavaScript('window.FarmingStarLifecycle?window.FarmingStarLifecycle['+JSON.stringify(method)+']():true').catch(()=>false)}
function createWindow(){
 closing=false;
 window=new BrowserWindow({width:1200,height:760,minWidth:700,minHeight:420,show:false,title:config.productName,backgroundColor:'#233f38',icon:path.join(__dirname,'../assets/icons/icon.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false,webSecurity:true,allowRunningInsecureContent:false,devTools:process.env.FARMINGSTAR_E2E==='1'}});
 window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 window.webContents.on('will-navigate',(event,url)=>{if(url!==ENTRY)event.preventDefault()});
 window.webContents.on('will-attach-webview',event=>event.preventDefault());
 window.webContents.on('render-process-gone',async(event,details)=>{const current=window;if(!current||current.isDestroyed())return;const answer=await dialog.showMessageBox(current,{type:'error',title:'Game renderer stopped',message:'Saved farms have been preserved.',detail:'The renderer exited ('+details.reason+'). Retry loading, or close the application.',buttons:['Retry','Close'],defaultId:0,cancelId:1});if(current.isDestroyed())return;if(answer.response===0)current.loadURL(ENTRY);else app.exit(1)});
 window.on('blur',()=>{void lifecycle('suspend')});window.on('focus',()=>{void lifecycle('resume')});
 window.on('close',event=>{event.preventDefault();if(closing)return;closing=true;void lifecycle('suspend').then(async saved=>{if(!window||window.isDestroyed())return;if(saved){window.destroy();if(quitRequested||process.platform!=='darwin')app.quit()}else{closing=false;quitRequested=false;await dialog.showMessageBox(window,{type:'error',title:'Progress could not be saved',message:'Keep the application open to retain current progress.',detail:'Free some disk space, then try saving again.',buttons:['Keep playing']});void lifecycle('resume')}})});
 window.once('ready-to-show',()=>window.show());
 const template=[...(process.platform==='darwin'?[{role:'appMenu'}]:[]),{role:'fileMenu'},{role:'editMenu'},{label:'View',submenu:[{role:'togglefullscreen',accelerator:process.platform==='darwin'?'Control+Command+F':'F11'}]}];Menu.setApplicationMenu(Menu.buildFromTemplate(template));
 window.loadURL(ENTRY);
}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
