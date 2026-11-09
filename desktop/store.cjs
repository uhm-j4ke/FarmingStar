'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const LIMIT=4*1024*1024,TOTAL=32*1024*1024;
const allowed=key=>typeof key==='string'&&/^farmingstar\.moss-ember\.(preferences|migrated\.v2|v1|slot\.[123](\.(history|before-restore)(\.unreadable)?|\.import-backup)?)$/.test(key);
function readBounded(file,limit){const fd=fs.openSync(file,'r');try{const buffer=Buffer.alloc(limit+1);let n=0;while(n<buffer.length){const read=fs.readSync(fd,buffer,n,buffer.length-n,null);if(!read)break;n+=read}if(n>limit)throw Error('File is too large');return buffer.subarray(0,n).toString('utf8')}finally{fs.closeSync(fd)}}
function writeAtomic(file,text){
 const next=path.join(path.dirname(file),'.'+path.basename(file)+'.'+crypto.randomUUID()+'.tmp');let fd,created=false;
 try{
  fd=fs.openSync(next,'wx',0o600);created=true;fs.writeFileSync(fd,text,'utf8');fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;
  fs.renameSync(next,file);
 }catch(e){if(fd!==undefined)try{fs.closeSync(fd)}catch{}if(created)try{fs.unlinkSync(next)}catch{}throw e}
 // Directory fsync is unavailable on some supported filesystems. The file itself was synced before replacement.
 try{const directory=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(directory)}finally{fs.closeSync(directory)}}catch{}
}
class Store{
 constructor(directory){fs.mkdirSync(directory,{recursive:true,mode:0o700});this.file=path.join(directory,'farmingstar-storage.json');this.values={};this.damaged=false;
  try{const value=JSON.parse(readBounded(this.file,TOTAL));if(!value||typeof value!=='object'||Array.isArray(value)||Object.entries(value).some(([k,v])=>!allowed(k)||typeof v!=='string'||Buffer.byteLength(v)>LIMIT))throw Error('Invalid native save table');this.values=value}catch(e){if(e.code!=='ENOENT')this.damaged=true}
  // Only this private directory is managed. Export destinations never remove pre-existing sibling files.
  if(!this.damaged)for(const name of fs.readdirSync(directory))if(/^\.farmingstar-storage\.json\.[0-9a-f-]{36}\.tmp$/.test(name))try{const pending=path.join(directory,name);if(fs.lstatSync(pending).isFile())fs.unlinkSync(pending)}catch{}
 }
 get(key){if(!allowed(key))return null;if(this.damaged)throw Error('Native save data is unreadable and has been preserved');return Object.hasOwn(this.values,key)?this.values[key]:null}
 put(key,value){return this.batch({[key]:value})}
 batch(changes){
  if(this.damaged||!changes||typeof changes!=='object'||Array.isArray(changes))return false;
  const entries=Object.entries(changes);if(!entries.length||entries.length>8||entries.some(([k,v])=>!allowed(k)||v!==null&&(typeof v!=='string'||Buffer.byteLength(v)>LIMIT)))return false;
  const next={...this.values};for(const [k,v]of entries)if(v===null)delete next[k];else next[k]=v;
  const text=JSON.stringify(next);if(Buffer.byteLength(text)>TOTAL)return false;
  try{writeAtomic(this.file,text);this.values=next;return true}catch{return false}
 }
}
module.exports={Store,allowed,readBounded,writeAtomic,LIMIT};
