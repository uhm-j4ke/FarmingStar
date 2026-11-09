// Real installed APK checks. No game-state mutation hooks are used.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),http=require('node:http'),assert=require('node:assert/strict'),{_android}=require('playwright');
const root=path.join(__dirname,'..'),adb=process.env.ADB||(process.env.ANDROID_HOME?path.join(process.env.ANDROID_HOME,'platform-tools',process.platform==='win32'?'adb.exe':'adb'):'adb'),pkg=process.env.ANDROID_PACKAGE||'io.github.uhmj4ke.farmingstar.test',rows=[],out=path.join(root,'release/evidence');fs.mkdirSync(out,{recursive:true});
function run(args,timeout=25000){return cp.execFileSync(adb,args,{encoding:'utf8',timeout,env:process.env}).trim()}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function record(id,details){rows.push({id,status:'PASS',details});console.log('PASS:',id,JSON.stringify(details||{}))}
function write(error){fs.writeFileSync(path.join(out,'android-runtime.json'),JSON.stringify({package:pkg,environment:`Android emulator, API ${process.env.ANDROID_API||'unspecified'}, x86_64, CPU acceleration: ${process.env.ANDROID_ACCELERATION||'unspecified'}; not a physical device`,audio:'WebAudio synthesis/context checks attempted; emulator uses no-audio, audible speaker output unverified',rows,error:error||null},null,2)+'\n')}
const runtimeDeadline=setTimeout(()=>{write('BLOCKED: native runtime verification exceeded eight minutes; no missing checks are marked passed.');process.exit(1)},8*60*1000);
let device;
async function waitForDocument(){
 let port;
 try{
  for(let i=0;i<90;i++){
   try{
    const pid=run(['shell','pidof',pkg]).split(/\s+/)[0];
    if(pid&&!port)port=run(['forward','tcp:0','localabstract:webview_devtools_remote_'+pid]);
    if(port){const targets=await new Promise((resolve,reject)=>{http.get('http://127.0.0.1:'+port+'/json/list',r=>{let body='';r.on('data',b=>body+=b);r.on('end',()=>{try{resolve(JSON.parse(body))}catch(e){reject(e)}})}).on('error',reject).setTimeout(3000,function(){this.destroy(Error('DevTools target timeout'))})});if(targets.some(t=>t.type==='page'&&t.url.includes('appassets.androidplatform.net')))return pid}
   }catch{}
   if(i%15===0)console.log('Waiting for a live Android WebView document');await delay(2000);
  }
  throw Error('No live Android WebView document; inspect renderer/crash logs');
 }finally{if(port)try{run(['forward','--remove','tcp:'+port])}catch{}}
}
async function connect(){
 const pid=await waitForDocument();
 if(!device){const devices=await _android.devices({host:'127.0.0.1',port:5037});device=devices.find(d=>!process.env.ANDROID_SERIAL||d.serial()===process.env.ANDROID_SERIAL);if(!device)throw Error('Requested Android device is not connected')}
 const webview=await device.webView({socketName:'webview_devtools_remote_'+pid},{timeout:120000});
 let page;for(let i=0;i<30&&!page;i++){page=await webview.page();if(!page)await delay(1000)}if(!page)throw Error('Android WebView has no live document; inspect native renderer crash evidence');page.setDefaultTimeout(90000);
 return {browser:page.context().browser(),page};
}

function nativeSave(){const all=JSON.parse(run(['shell','run-as',pkg,'cat','files/farmingstar-storage.json']));return JSON.parse(all['farmingstar.moss-ember.slot.1'])}
async function snapshot(page){await page.evaluate(()=>window.FarmingStarLifecycle.suspend());const state=nativeSave();await page.evaluate(()=>window.FarmingStarLifecycle.resume());return state}
(async()=>{
 let browser,page;
 try{
  console.log('Waiting for Android package service and boot');
  for(let i=0;i<100;i++){try{if(run(['shell','getprop','sys.boot_completed'],10000)==='1')break}catch{}if(i===99)throw Error('Emulator boot not complete');if(i%10===0)console.log('Emulator still booting');await delay(3000)}
  run(['shell','svc','wifi','disable']);let mobileData='disabled';try{run(['shell','svc','data','disable'])}catch(e){if(String(e.stderr).includes("Can't find service: phone"))mobileData='not present in this emulator image';else throw e}record('ANDROID-OFFLINE-CONFIG',{wifi:'disabled',mobileData});
  run(['shell','am','start','-n',pkg+'/io.github.uhmj4ke.farmingstar.MainActivity']);({browser,page}=await connect());
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.waitForFunction(()=>!!document.querySelector('#titleScene'),null,{timeout:120000});
  assert.equal(await page.evaluate(()=>typeof window.FarmingStar),'undefined');record('ANDROID-STARTUP',{title:await page.title(),diagnostics:'absent',url:page.url()});
  await page.evaluate(()=>{window.__qaAudio=[];window.__qaSources=0;const Native=window.AudioContext;window.AudioContext=class extends Native{constructor(...args){super(...args);window.__qaAudio.push(this)}createOscillator(){window.__qaSources++;return super.createOscillator()}}});
  if(await page.getByRole('button',{name:'Continue your farm'}).count())await page.getByRole('button',{name:'Continue your farm'}).tap();
  else{await page.getByRole('button',{name:'Begin your story'}).tap();await page.getByRole('button',{name:'Make this place home'}).tap()}
  await page.waitForFunction(()=>document.querySelector('#modal').classList.contains('hidden'));
  const first=await snapshot(page);assert.equal(first.version,4);record('ANDROID-NATIVE-SAVE',{farmId:first.farmId,coins:first.coins,bagSlots:first.bagSlots.length,storage:'files/farmingstar-storage.json'});
  const viewport=await page.evaluate(()=>({width:innerWidth,height:innerHeight,mobile:document.body.classList.contains('mobile')}));assert.ok(viewport.width>viewport.height);assert.ok(viewport.mobile);record('ANDROID-LANDSCAPE',viewport);
  await device.screenshot({path:path.join(out,'android-game.png')});
  await page.locator('[data-ui="inventory"]').tap();assert.ok(await page.locator('[data-bagindex]').count()>=10);await page.locator('[data-bagindex="0"]').tap();assert.ok(await page.locator('#bagDetails').isVisible());await page.locator('[data-act="close"]').tap();record('ANDROID-BAG-HOTBAR');
  const joy=await page.locator('#joy').boundingBox(),use=await page.locator('#use').boundingBox(),cdp=await page.context().newCDPSession(page);assert.ok(joy&&use);
  const a={id:1,x:joy.x+joy.width/2,y:joy.y+joy.height/2},b={id:2,x:use.x+use.width/2,y:use.y+use.height/2};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});a.x+=25;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[a]});await delay(1800);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[a]});await delay(1200);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const moved=await snapshot(page);assert.ok(moved.x!==first.x||moved.y!==first.y);record('ANDROID-MULTITOUCH-MOVE-TOOL',{before:[first.x,first.y],after:[moved.x,moved.y]});
  const audio=await page.evaluate(()=>({states:window.__qaAudio.map(a=>a.state),sources:window.__qaSources}));assert.ok(audio.states.includes('running'));assert.ok(audio.sources>0);record('ANDROID-WEBAUDIO',audio);
  run(['shell','input','keyevent','KEYCODE_BACK']);await page.getByRole('button',{name:'Return to the valley'}).waitFor();run(['shell','input','keyevent','KEYCODE_BACK']);await page.waitForFunction(()=>document.querySelector('#modal').classList.contains('hidden'));record('ANDROID-BACK');
  run(['shell','input','keyevent','KEYCODE_HOME']);await delay(1500);const hidden1=nativeSave();await delay(2000);const hidden2=nativeSave();assert.equal(hidden1.time,hidden2.time);assert.equal(hidden1.playtime,hidden2.playtime);run(['shell','am','start','-n',pkg+'/io.github.uhmj4ke.farmingstar.MainActivity']);await delay(1000);record('ANDROID-BACKGROUND-RESUME',{time:hidden2.time});
  if(process.env.FARMINGSTAR_ANDROID_FILES==='1'){
   run(['shell','input','keyevent','KEYCODE_BACK']);await page.getByRole('button',{name:'Save files & transfer',exact:true}).tap();await page.locator('[data-slotoptions="1"]').tap();await page.getByRole('button',{name:'Export portable save',exact:true}).tap();
   const filename='FarmingStar-QA-'+Date.now()+'.json';await device.wait({pkg:'com.android.documentsui'},{timeout:30000});await device.fill({clazz:'android.widget.EditText'},filename);await device.tap({text:/^save$/i});await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('exported'));
   const exported=nativeSave();await page.locator('[data-act="close"]').tap();run(['shell','input','keyevent','KEYCODE_BACK']);await page.getByRole('button',{name:'Save files & transfer',exact:true}).tap();await page.locator('[data-importslot="2"]').tap();await device.wait({pkg:'com.android.documentsui'},{timeout:30000});await device.tap({text:filename});await page.getByRole('button',{name:'Replace & import',exact:true}).tap();
   const all=JSON.parse(run(['shell','run-as',pkg,'cat','files/farmingstar-storage.json'])),imported=JSON.parse(all['farmingstar.moss-ember.slot.2']);for(const key of ['farmId','coins','bagSlots','plots','containerSlots','skills','friends','furniture'])assert.deepEqual(imported[key],exported[key]);record('ANDROID-SYSTEM-DOCUMENT-EXPORT-IMPORT',{picker:'Android DocumentsUI',semantics:'export to a real document; read it back and replace destination slot 2'});await page.locator('[data-loadslot="1"]').tap();
  }
  const saved=await snapshot(page);run(['shell','am','force-stop',pkg]);if(browser)await browser.close().catch(()=>{});else await page.context().close().catch(()=>{});browser=null;run(['shell','am','start','-n',pkg+'/io.github.uhmj4ke.farmingstar.MainActivity']);({browser,page}=await connect());await page.getByRole('button',{name:'Continue your farm'}).tap();const restored=await snapshot(page);
  for(const key of ['farmId','coins','bagSlots','plots','containerSlots','skills','friends','furniture'])assert.deepEqual(restored[key],saved[key]);record('ANDROID-FORCE-STOP-RELAUNCH',{savedFarm:restored.farmId,coins:restored.coins});
  assert.deepEqual(errors,[]);record('ANDROID-JS-ERRORS',{count:errors.length});write();
 }catch(e){write(e.stack||e.message);throw e}finally{if(browser)await browser.close().catch(()=>{});if(device)await device.close().catch(()=>{});clearTimeout(runtimeDeadline)}
})().catch(e=>{console.error(e);process.exitCode=1});
