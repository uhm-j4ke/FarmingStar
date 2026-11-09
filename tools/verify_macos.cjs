// Run on macOS against the actual .app, not merely a filename labelled Universal.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
if(process.platform!=='darwin')throw Error('macOS verification requires lipo and codesign on a real Mac');
const app=path.resolve(process.argv[2]||'artifacts/desktop/mac-universal/FarmingStar.app'),rows=[];
function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isSymbolicLink())continue;if(entry.isDirectory())walk(file);else if(entry.isFile()){
 const fd=fs.openSync(file,'r'),head=Buffer.alloc(4);let n;try{n=fs.readSync(fd,head,0,4,0)}finally{fs.closeSync(fd)}if(n!==4)continue;
 if(!['cffaedfe','cefaedfe','feedface','feedfacf','cafebabe','bebafeca','cafebabf','bfbafeca'].includes(head.toString('hex')))continue;
 const archs=cp.execFileSync('lipo',['-archs',file],{encoding:'utf8'}).trim().split(/\s+/);assert.ok(archs.includes('x86_64')&&archs.includes('arm64'),'Missing architecture: '+file);rows.push({file:path.relative(app,file),archs});
 }}}
assert.ok(fs.existsSync(app));walk(path.join(app,'Contents'));assert.ok(rows.some(v=>v.file==='Contents/MacOS/FarmingStar'));assert.ok(rows.length>5);cp.execFileSync('codesign',['--verify','--deep','--strict',app],{stdio:'inherit'});
const version=cp.execFileSync('/usr/libexec/PlistBuddy',['-c','Print :CFBundleShortVersionString',path.join(app,'Contents/Info.plist')],{encoding:'utf8'}).trim();assert.equal(version,'0.4.0');assert.ok(fs.existsSync(path.join(app,'Contents/Resources/icon.icns')));
const signature=cp.spawnSync('codesign',['-d','--verbose=4',app],{encoding:'utf8'});assert.equal(signature.status,0);assert.ok(/Signature=adhoc/.test(signature.stderr));assert.ok(signature.stderr.includes('Identifier=io.github.uhmj4ke.farmingstar'));
fs.mkdirSync('release/evidence',{recursive:true});fs.writeFileSync('release/evidence/macos-binaries.json',JSON.stringify({recordedAt:new Date().toISOString(),version,rows,signature:'verified ad-hoc; not Developer ID signed or notarised',runtime:'separate required check'},null,2)+'\n');console.log('PASS: actual Universal 2 main executable and all '+rows.length+' Mach-O files, version, icon and code signatures.');
