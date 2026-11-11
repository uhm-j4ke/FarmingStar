// Repeatable Android builds. Test signing stays local and is never a release identity.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const cfg=require('../release/release-config.json');
const root=path.join(__dirname,'..'),release=process.argv.includes('--release'),instrument=process.argv.includes('--instrument');
function run(command,args,cwd=root){const r=cp.spawnSync(command,args,{cwd,stdio:'inherit',env:process.env});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1)}
if(release){for(const name of ['FARMINGSTAR_KEYSTORE','FARMINGSTAR_STORE_PASSWORD','FARMINGSTAR_KEY_ALIAS','FARMINGSTAR_KEY_PASSWORD'])if(!process.env[name])throw Error('Release signing requirement missing: '+name);if(!fs.existsSync(process.env.FARMINGSTAR_KEYSTORE))throw Error('Configured release keystore file does not exist')}
else{
 const directory=path.join(root,'.local-signing'),file=path.join(directory,'android-debug.keystore');fs.mkdirSync(directory,{recursive:true,mode:0o700});
 if(!fs.existsSync(file)){
  const keytool=process.env.JAVA_HOME?path.join(process.env.JAVA_HOME,'bin',process.platform==='win32'?'keytool.exe':'keytool'):'keytool';
  run(keytool,['-genkeypair','-keystore',file,'-storepass','android','-keypass','android','-alias','androiddebugkey','-keyalg','RSA','-keysize','2048','-validity','3650','-dname','CN=FarmingStar Test,O=FarmingStar,C=GB']);fs.chmodSync(file,0o600);
 }
}
run(process.execPath,[path.join(__dirname,'prepare_web.cjs')]);
const tasks=release?[':app:assembleRelease',':app:lintRelease']:[':app:assembleDebug',':app:lintDebug'];if(instrument)tasks.push(':app:connectedDebugAndroidTest');
if(process.platform==='win32')run('cmd.exe',['/d','/s','/c','gradlew.bat','--no-daemon',...tasks],path.join(root,'android'));
else run('./gradlew',['--no-daemon',...tasks],path.join(root,'android'));
const source=path.join(root,'android/app/build/outputs/apk',release?'release/app-release.apk':'debug/app-debug.apk'),out=path.join(root,'artifacts');fs.mkdirSync(out,{recursive:true});
const target=path.join(out,`FarmingStar-${cfg.version}-Android${release?'':'-TEST'}.apk`);fs.copyFileSync(source,target);console.log('Built '+target+'; runtime verification is a separate required check.');
