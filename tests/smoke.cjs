// Development-only browser checks. The game itself has no dependencies.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const server = require('node:http').createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(require('node:fs').readFileSync(path.resolve(__dirname,'../index.html')))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context = await browser.newContext({viewport:{width:1280,height:800}});
 const page = await context.newPage(); const errors=[];const requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))requests.push(r.url())});
 await page.addInitScript(()=>{window.testUse=(x,y)=>{const f=FarmingStar,g=f.state;if(f.placement){f.placeStation(x,y);return}g.x=x*24+12;g.y=(y-1)*24+12;g.dir=2;f.use();f.stepAction(.6);if(f.activity?.type==='fishwait')f.update(5)}});
 await page.goto('http://127.0.0.1:'+server.address().port);
 await page.getByRole('button',{name:'Begin your story'}).click();
 await page.locator('#name').fill('Fern');await page.locator('#accessory').selectOption('hat');
 await page.getByRole('button',{name:'Make this place home'}).click();
 await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>FarmingStar.state.profile.name),'Fern');
 // Walk through real input and ensure world updates without console exceptions.
 const x=await page.evaluate(()=>FarmingStar.state.x);await page.keyboard.down('d');await page.waitForTimeout(200);await page.keyboard.up('d');
 assert.ok(await page.evaluate(x=>FarmingStar.state.x>x,x));
 const loop=await page.evaluate(()=>{
  const f=FarmingStar,g=f.state;g.bagTier=1;g.bagSlots.push(...Array(10).fill(null));g.weather='Sunny';
  f.travel('farm',7,11);g.selected='hoe';window.testUse(7,12);if(!g.plots['7,12'])throw Error('hoe');
  g.selected='carrotSeed';const before=g.inv.carrotSeed;window.testUse(7,12);if(g.inv.carrotSeed!==before-1)throw Error('seed debit');
  g.selected='can';window.testUse(7,12);if(!g.plots['7,12'].water)throw Error('watering');
  f.nextDay();f.travel('farm',7,11);g.selected='can';window.testUse(7,12);f.nextDay();
  f.travel('farm',7,11);g.selected='hand';window.testUse(7,12);if(g.inv.carrot!==1)throw Error('harvest');
  const inv=JSON.stringify(g.inv),coins=g.coins;if(f.transact({pumpkin:999},{bread:1},99999))throw Error('invalid purchase accepted');if(JSON.stringify(g.inv)!==inv||g.coins!==coins)throw Error('failed purchase mutated inventory');
  // Exercise actual shop door and counter.
  f.travel('town',7,8);f.interact();if(g.area!=='grocery')throw Error('door transition');g.time=660;const service=f.interiors[g.area].service;g.x=service.x*24+12;g.y=service.y*24+12;g.dir=0;f.interact();
  return {beforeCoins:g.coins,harvest:g.inv.carrot,sale:Math.floor(16*[1,1.2,1.45][g.bagSlots.find(v=>v?.id==='carrot').q||0])};
 });
 const saleSlot=await page.evaluate(()=>FarmingStar.state.bagSlots.findIndex(v=>v?.id==='carrot'));await page.locator('[data-sellslot="'+saleSlot+'"]').click();
 assert.equal(await page.evaluate(()=>FarmingStar.state.coins),loop.beforeCoins+loop.sale+5);
 const beforeSeeds=await page.evaluate(()=>FarmingStar.state.inv.carrotSeed);
 await page.locator('[data-buy="carrotSeed"]').click();assert.equal(await page.evaluate(()=>FarmingStar.state.inv.carrotSeed),beforeSeeds+1);
 await page.locator('[data-act="close"]').click();
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;f.travel('farm',14,9);f.interact()});
 const seedCount=await page.evaluate(()=>FarmingStar.state.inv.carrotSeed);
 const seedSlot=await page.evaluate(()=>FarmingStar.state.bagSlots.findIndex(v=>v?.id==='carrotSeed'));await page.locator('[data-bagindex="'+seedSlot+'"]').click();await page.locator('[data-bagstore="1"]').click();assert.equal(await page.evaluate(()=>FarmingStar.state.inv.carrotSeed),seedCount-1);
 await page.locator('[data-bagtake="carrotSeed"][data-amount="1"]').click();assert.equal(await page.evaluate(()=>FarmingStar.state.inv.carrotSeed),seedCount);
 await page.locator('[data-act="close"]').click();
 // Installed stations require proximity, debit inputs once, and yield exactly one output.
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;f.travel('home',5,5);g.inv.potato=2;f.beginCook('chopped');if(g.inv.potato!==1||!f.activity)throw Error('recipe transaction');f.timing(true);if(g.inv.chopped!==1)throw Error('recipe output');f.save(true)});
 // Shop placement is an actual object with collision and no debit until placed.
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;g.coins=500;g.time=660;f.travel('town',18,8);f.interact();g.time=660;const service=f.interiors[g.area].service;g.x=service.x*24+12;g.y=service.y*24+12;g.dir=0;f.interact()});
 await page.locator('[data-machine="mill"]').click();
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;const c=g.coins;window.testUse(10,9);if(g.coins!==c-90||!g.stations.some(s=>s.id==='mill'))throw Error('station placement');if(f.walkable(10*24+12,9*24+12))throw Error('station collision');f.save(true)});
 // Weather, season turnover, household exit destination and fishing output.
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;g.returnTo={area:'town',x:18,y:8};f.nextDay();if(g.returnTo.area!=='farm')throw Error('sleep exit destination');g.day=14;g.plots['7,12']={crop:'carrot',age:1,water:true};f.nextDay();if(g.plots['7,12'].crop)throw Error('season withering');f.travel('town',31,22);g.rod=true;g.rodTier=1;g.inv.rod=1;g.selected='rod';window.testUse(32,22);if(!f.activity)throw Error('fishing start');f.timing(true);if(!Object.values(g.collections.fish).some(n=>n>0))throw Error('fishing output');f.travel('farm',8,10);g.inv.carrotSeed=3;f.save(true)});
 // Save and restore all meaningful state, including area and position.
 const saved=await page.evaluate(()=>{FarmingStar.save(true);return JSON.stringify(FarmingStar.state)});
 await page.reload();await page.getByRole('button',{name:'Continue your farm'}).click();
 const restored=await page.evaluate(()=>FarmingStar.state);
 const old=JSON.parse(saved);for(const k of ['profile','inv','plots','stations','coins','area','x','y'])assert.deepEqual(restored[k],old[k],k);
 await context.setOffline(true);await page.evaluate(()=>{FarmingStar.travel('farm',8,10);FarmingStar.save(true)});
 await page.waitForTimeout(550);await page.screenshot({path:path.join(__dirname,'desktop.png')});
 // Mobile portrait and landscape: all hotbar slots and touch input reachable.
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Settings & controls'}).click();await page.locator('#controls').selectOption('mobile');await page.getByRole('button',{name:'Save settings'}).click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);assert.ok(await page.locator('#joy').isVisible());assert.ok(await page.locator('#use').isVisible());
 await page.screenshot({path:path.join(__dirname,'mobile.png')});
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(100);
 const overlaps=await page.evaluate(()=>{const ids=['#hotbar','#joy','#mobileActions','#hud','#mini'];const a=ids.map(id=>({id,r:document.querySelector(id).getBoundingClientRect()}));return a.flatMap((v,i)=>a.slice(i+1).filter(w=>v.r.left<w.r.right&&v.r.right>w.r.left&&v.r.top<w.r.bottom&&v.r.bottom>w.r.top).map(w=>v.id+' overlaps '+w.id))});
 assert.deepEqual(overlaps,[],'mobile landscape controls');
 await page.waitForTimeout(150);assert.deepEqual(errors,[],'browser errors');assert.deepEqual(requests,[],'external requests');
 // Corrupt saves recover with an explicit message, without deletion.
 await context.setOffline(false);await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Save & title screen'}).click();await page.evaluate(()=>localStorage.setItem('farmingstar.moss-ember.slot.1','broken'));await page.reload();assert.ok(await page.getByRole('button',{name:'Begin your story'}).isVisible());assert.equal(await page.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1')),'broken');
 console.log('PASS: creation, movement, farming, shop transactions, storage, cooking, placement, save/load, offline, mobile layout, corrupt save recovery.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
