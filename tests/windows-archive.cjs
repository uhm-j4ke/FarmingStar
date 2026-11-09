// Reproduce ASAR's host-path semantics even when regression tests run on Linux.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),{createRequire}=require('node:module'),assert=require('node:assert/strict'),asar=require('@electron/asar');
(async()=>{
 const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'farmingstar-asar-'));
 try{
  const source=path.join(temporary,'source'),archive=path.join(temporary,'app.asar'),text='Offline nested asset';fs.mkdirSync(path.join(source,'dist/web'),{recursive:true});fs.writeFileSync(path.join(source,'dist/web/index.html'),text);await asar.createPackage(source,archive);
  const entry=require.resolve('@electron/asar/lib/filesystem.js'),load=createRequire(entry),header=asar.getRawHeader(archive);
  for(const api of [path.posix,path.win32]){
   const instance={exports:{}},run=vm.runInThisContext('(function(exports,require,module,__filename,__dirname){'+fs.readFileSync(entry,'utf8')+'\n})',{filename:entry});run(instance.exports,name=>name==='path'?api:load(name),instance,entry,path.dirname(entry));
   const filesystem=new instance.exports.Filesystem('.');filesystem.setHeader(header.header,header.headerSize);
   if(api===path.win32)assert.throws(()=>filesystem.getFile('dist/web/index.html'),/was not found/);
   assert.equal(filesystem.getFile(api.normalize('dist/web/index.html')).size,Buffer.byteLength(text));
  }
  console.log('PASS: real ASAR nested asset lookup uses normalized host paths on Windows and Unix; original Windows failure reproduced.');
 }finally{fs.rmSync(temporary,{recursive:true,force:true})}
})().catch(error=>{console.error(error);process.exitCode=1});
