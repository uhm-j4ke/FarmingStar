'use strict';
const {contextBridge,ipcRenderer}=require('electron');
function storage(method,...args){const result=ipcRenderer.sendSync('farm:storage',method,...args);if(!result?.ok)throw Error(result?.error||'Native storage unavailable');return result.value}
contextBridge.exposeInMainWorld('FarmingStarHost',Object.freeze({
 getPlatform:()=>process.platform,
 getItem:key=>storage('get',key),
 setItem:(key,value)=>storage('put',key,value),
 removeItem:key=>storage('put',key,null),
 batch:json=>storage('batch',json),
 pickImport(){ipcRenderer.send('farm:import');return true},
 exportSave(name,text){ipcRenderer.send('farm:export',name,text);return true}
}));
