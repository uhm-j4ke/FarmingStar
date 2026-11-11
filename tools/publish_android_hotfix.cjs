// The user explicitly authorised replacing ONLY Android inside the existing 1.0.0 release.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict'),cfg=require('../release/release-config.json');
assert.equal(cfg.version,'1.0.0');assert.equal(cfg.androidVersionCode,10001);
const tag='v1.0.0',oldName='FarmingStar-1.0.0-Android-TEST.apk',newName='FarmingStar-1.0.0-Android.apk',file=path.resolve('artifacts/release-android',newName),integrity=JSON.parse(fs.readFileSync('release/evidence/android-integrity.json'));
assert.equal(integrity.appName,'FarmingStar');assert.equal(integrity.canUpdatePreviousBeta,true,'Existing installs must accept this certificate');assert.equal(integrity.versionCode,10001);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),integrity.apkSha256);
const manifest=require('../release/published-manifest.json'),read=()=>JSON.parse(cp.execFileSync('gh',['release','view',tag,'--json','tagName,isDraft,isPrerelease,assets'],{encoding:'utf8'})),run=args=>cp.execFileSync('gh',args,{stdio:'inherit'}),before=read();assert.equal(before.tagName,tag);assert.equal(before.isDraft,false);assert.equal(before.isPrerelease,false);
const preserved=manifest.artifacts.filter(a=>!a.name.endsWith('.apk'));assert.equal(preserved.length,3);const names=new Set([...preserved.map(a=>a.name),oldName,newName]);for(const a of before.assets)assert.ok(names.has(a.name),'Unexpected release attachment: '+a.name);
for(const a of preserved){const asset=before.assets.find(v=>v.name===a.name);assert.ok(asset,'Missing original '+a.name);assert.equal(asset.size,a.bytes);if(asset.digest)assert.equal(asset.digest,'sha256:'+a.sha256)}
const identity=a=>({name:a.name,id:a.id,size:a.size}),order=(a,b)=>a.name.localeCompare(b.name),original=before.assets.filter(a=>preserved.some(p=>p.name===a.name)).map(identity).sort(order);
run(['release','upload',tag,file,'--clobber']);
const uploaded=read().assets.find(a=>a.name===newName);assert.ok(uploaded);assert.equal(uploaded.size,fs.statSync(file).size);if(uploaded.digest)assert.equal(uploaded.digest,'sha256:'+integrity.apkSha256);
if(before.assets.some(a=>a.name===oldName))run(['release','delete-asset',tag,oldName,'--yes']);
const after=read();assert.equal(after.assets.length,4);assert.deepEqual(after.assets.filter(a=>a.name!==newName).map(identity).sort(order),original,'A non-Android asset changed');
run(['release','edit',tag,'--notes-file','release/RELEASE_NOTES.md']);
console.log('Published Android build 10001; original EXE, DMG and HTML identities are unchanged.');
