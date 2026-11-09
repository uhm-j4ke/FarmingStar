const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const html=fs.readFileSync(path.join(__dirname,'../dist/web/index.html'));
 const server=require('node:http').createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true}),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
  const url='http://127.0.0.1:'+server.address().port;await page.goto(url);assert.equal(await page.evaluate(()=>typeof window.FarmingStar),'undefined');assert.equal(await page.evaluate(()=>typeof window.__FARMINGSTAR_TEST__),'undefined');
  await page.getByRole('button',{name:'Begin your story'}).tap();await page.locator('#name').fill('Native baseline');await page.getByRole('button',{name:'Make this place home'}).tap();
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('farmingstar.moss-ember.slot.1')));
  assert.equal((await saved()).profile.name,'Native baseline');
  await page.locator('[data-ui="inventory"]').tap();assert.equal(await page.locator('[data-bagindex]').count(),10);await page.locator('[data-act="close"]').tap();
  await page.evaluate(()=>window.FarmingStarLifecycle.suspend());const before=await saved();await page.waitForTimeout(600);await page.keyboard.down('d');await page.waitForTimeout(200);await page.keyboard.up('d');await page.evaluate(()=>window.FarmingStarLifecycle.suspend());assert.equal((await saved()).time,before.time);
  await page.evaluate(()=>window.FarmingStarLifecycle.resume());await page.keyboard.down('d');await page.waitForTimeout(300);await page.keyboard.up('d');await page.evaluate(()=>window.FarmingStarLifecycle.suspend());assert.ok((await saved()).x>before.x);await page.evaluate(()=>window.FarmingStarLifecycle.resume());
  await page.reload();await page.getByRole('button',{name:'Continue your farm'}).tap();assert.equal((await saved()).profile.name,'Native baseline');
  await page.evaluate(()=>window.FarmingStarLifecycle.back());assert.ok(await page.getByRole('button',{name:'Return to the valley'}).isVisible());await page.evaluate(()=>window.FarmingStarLifecycle.back());assert.ok(await page.locator('#modal').evaluate(el=>el.classList.contains('hidden')));
  await page.evaluate(()=>window.FarmingStarLifecycle.back());await page.getByRole('button',{name:'Save files & transfer',exact:true}).tap();await page.locator('[data-slotoptions="1"]').tap();
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export portable save',exact:true}).tap()]);
  const portable=fs.readFileSync(await download.path(),'utf8'),document=JSON.parse(portable);assert.equal(document.format,'FarmingStar.Save');assert.ok(!('settings' in document.state));
  await page.locator('[data-act="close"]').tap();await page.evaluate(()=>window.FarmingStarLifecycle.back());await page.getByRole('button',{name:'Save files & transfer',exact:true}).tap();
  const chosen=page.waitForEvent('filechooser');await page.locator('[data-importslot="2"]').tap();await (await chosen).setFiles({name:'portable.json',mimeType:'application/json',buffer:Buffer.from(portable)});await page.getByRole('button',{name:'Replace & import',exact:true}).tap();
  const imported=await page.evaluate(()=>JSON.parse(localStorage.getItem('farmingstar.moss-ember.slot.2')));assert.equal(imported.farmId,document.state.farmId);assert.deepEqual(imported.bagSlots,document.state.bagSlots);assert.equal(await page.evaluate(()=>typeof window.FarmingStar),'undefined');
  const host=await browser.newPage();host.on('pageerror',e=>errors.push(e.message));await host.addInitScript(()=>{window.nativeWrites=0;window.FarmingStarHost={getPlatform:()=> 'android',getItem:k=>localStorage.getItem(k),setItem(k,v){window.nativeWrites++;localStorage.setItem(k,v);return true},removeItem(k){localStorage.removeItem(k);return true}}});await host.goto(url);await host.getByRole('button',{name:'Begin your story'}).click();await host.getByRole('button',{name:'Make this place home'}).click();assert.ok(await host.evaluate(()=>window.nativeWrites>0));assert.equal(await host.evaluate(()=>typeof window.FarmingStar),'undefined');
  assert.equal(await host.evaluate(()=>window.FarmingStarLifecycle.suspend()),true);
  const nativeBytes=await host.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1'));
  await host.evaluate(()=>{window.FarmingStarHost.setItem=()=>false;window.FarmingStarLifecycle.resume()});await host.waitForTimeout(500);
  assert.equal(await host.evaluate(()=>window.FarmingStarLifecycle.suspend()),false);
  assert.equal(await host.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1')),nativeBytes);
  const blocked=await browser.newPage();await blocked.addInitScript(()=>{window.FarmingStarHost={getItem:()=>null,setItem:()=>false,removeItem:()=>false}});await blocked.goto(url);await blocked.getByRole('button',{name:'Begin your story'}).click();await blocked.getByRole('button',{name:'Make this place home'}).click();assert.ok(await blocked.locator('#name').isVisible());assert.ok((await blocked.locator('#toast').innerText()).includes('could not be saved'));
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS: production HTML startup, CSP/offline assets, absent mutation hooks, save/reload, native lifecycle/back, native-storage contract and failed-write protection.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
