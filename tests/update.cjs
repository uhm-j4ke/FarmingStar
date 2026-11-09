const {chromium}=require('./browser.cjs');const assert=require('node:assert/strict');const path=require('node:path');const fs=require('node:fs');
(async()=>{
 const server=require('node:http').createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync(path.join(__dirname,'../index.html')))});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1280,height:800}}),page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))requests.push(r.url())});
 const url='http://127.0.0.1:'+server.address().port;await page.addInitScript(()=>{window.testUse=(x,y)=>{const f=FarmingStar,g=f.state;if(f.placement){f.placeStation(x,y);return}g.x=x*24+12;g.y=(y-1)*24+12;g.dir=2;f.use();f.stepAction(.6);if(f.activity?.type==='fishwait')f.update(5)}});
 await page.goto(url);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
 await page.screenshot({path:path.join(__dirname,'title.png')});
 const art=await page.locator('#titleScene').screenshot();await page.waitForTimeout(250);const art2=await page.locator('#titleScene').screenshot();assert.notDeepEqual(art,art2,'title scene animates');
 await page.getByRole('button',{name:'Settings',exact:true}).click();await page.locator('#controls').selectOption('desktop');await page.getByRole('button',{name:'Save settings'}).click();assert.ok(await page.locator('#titleScene').isVisible(),'title settings return to title');
 await page.getByRole('button',{name:'Begin your story'}).click();
 await page.locator('#name').fill('Test');await page.locator('#name').press('Home');await page.keyboard.type('WASD eim ');await page.locator('#name').press('End');await page.keyboard.press('Backspace');assert.equal(await page.locator('#name').inputValue(),'WASD eim Tes');
 const colors=await page.locator('#name').evaluate(el=>{const s=getComputedStyle(el);return {text:s.color,fill:s.webkitTextFillColor,bg:s.backgroundColor,font:s.fontFamily}});assert.equal(colors.text,'rgb(64, 45, 37)');assert.match(colors.font,/Ember/);assert.notEqual(colors.fill,'rgb(255, 255, 255)');
 assert.ok(await page.locator('#portrait').evaluate(a=>{const data=a.getContext('2d').getImageData(0,0,a.width,2).data;return !data.some((v,i)=>i%4===3&&v>0)}),'portrait head is not clipped');await page.screenshot({path:path.join(__dirname,'creation.png')});await page.getByRole('button',{name:'Make this place home'}).click();assert.equal(await page.evaluate(()=>FarmingStar.state.day),29,'new farms start in autumn');
 await page.waitForTimeout(700);await page.screenshot({path:path.join(__dirname,'farm.png')});
 // Native pointer targeting still matches the world after integer camera scaling.
 for(const zoom of [3,4,5]){
  await page.evaluate(z=>{const f=FarmingStar;f.state.settings.zoom=z;window.dispatchEvent(new Event('resize'));f.travel('farm',8,11);f.state.selected='hoe';delete f.state.plots['8,12']},zoom);await page.waitForTimeout(650);
  const pos=await page.evaluate(()=>{const f=FarmingStar,c=f.camera;return {x:(8*24+12-Math.floor(c.x))/c.vw*innerWidth,y:(12*24+12-Math.floor(c.y))/c.vh*innerHeight}});
  await page.mouse.click(pos.x,pos.y);await page.waitForTimeout(250);assert.ok(await page.evaluate(()=>!!FarmingStar.state.plots['8,12']),`pointer target at ${zoom}x`);
 }
 // Journal rewards once, and merely opening the book never completes tasks.
 await page.evaluate(()=>{FarmingStar.state.settings.zoom=4;window.dispatchEvent(new Event('resize'));FarmingStar.save(true)});
 const coins=await page.evaluate(()=>FarmingStar.state.coins);assert.equal(await page.evaluate(()=>FarmingStar.transact({carrot:-1},{carrot:1})),false,'negative inputs cannot hide behind matching output keys');
 await page.getByRole('button',{name:'Bag [I]',exact:true}).click();await page.getByRole('button',{name:'Journal',exact:true}).click();assert.ok(await page.getByText('Pages already written').isVisible());await page.screenshot({path:path.join(__dirname,'journal.png')});await page.locator('[data-act="close"]').click();
 assert.equal(await page.evaluate(()=>FarmingStar.state.coins),coins);
 await page.evaluate(()=>{for(let i=0;i<4;i++)FarmingStar.save(true)});assert.equal(await page.evaluate(()=>FarmingStar.state.coins),coins,'journal rewards cannot repeat');
 // Every requested landmark has a real collision-free route, including both bridges.
 const routes=await page.evaluate(()=>{const f=FarmingStar;return f.destinations.filter(d=>d.area==='town').map(d=>{const r=f.route('town',{x:2,y:11},d);return {name:d.name,len:r.length,valid:r.every(p=>!f.blocked('town',p.x,p.y))}})});
 for(const r of routes){assert.ok(r.len>0,r.name+' reachable');assert.ok(r.valid,r.name+' uses walkable tiles')}
 const paths=await page.evaluate(()=>{const f=FarmingStar;return ['farm','town'].every(a=>{const {w,h}=f.worldSize(a);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(f.pathTile(a,x,y)&&f.blocked(a,x,y)&&!(a==='town'&&f.water(x,y)))return false;return true})});
 // Path art may touch river at the bank; routes must use only bridge crossings.
 assert.ok(paths,'visible footpaths never cross solid objects');assert.ok(routes.every(r=>r.valid));
 await page.evaluate(()=>{FarmingStar.travel('town',30,23)});await page.waitForTimeout(650);await page.screenshot({path:path.join(__dirname,'town.png')});
 await page.locator('#mini').click();assert.ok(await page.locator('#atlas').isVisible());
 await page.locator('[data-destination="garden"]').click();await page.getByRole('button',{name:'Zoom map in',exact:true}).click();const oldPan=await page.evaluate(()=>FarmingStar.atlas);
 const box=await page.locator('#atlas').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+30,{steps:6});await page.mouse.up();const pan=await page.evaluate(()=>FarmingStar.atlas);assert.notEqual(pan.x,oldPan.x);assert.notEqual(pan.y,oldPan.y);
 await page.getByRole('button',{name:'Recenter',exact:true}).click();assert.equal(await page.evaluate(()=>FarmingStar.atlas.area),'town');
 await page.screenshot({path:path.join(__dirname,'atlas.png')});await page.locator('[data-destination="garden"]').click();await page.getByRole('button',{name:'Set Waypoint',exact:true}).click();assert.equal(await page.evaluate(()=>FarmingStar.state.waypoint),'garden');
 await page.locator('#mini').click();await page.locator('[data-destination="garden"]').click();await page.getByRole('button',{name:'Travel',exact:true}).click();assert.equal(await page.evaluate(()=>Math.floor(FarmingStar.state.x/24)),45);
 // Intro community request consumes exactly one carrot and pays once.
 await page.evaluate(()=>{const f=FarmingStar,g=f.state;g.inv.carrot=2;f.travel('town',11,20);f.interact();g.time=660;const service=f.interiors[g.area].service;g.x=service.x*24+12;g.y=service.y*24+12;g.dir=0;f.interact()});const before=await page.evaluate(()=>({c:FarmingStar.state.coins,n:FarmingStar.state.inv.carrot}));await page.locator('[data-act="introdelivery"]').click();assert.equal(await page.evaluate(()=>FarmingStar.state.inv.carrot),before.n-1);assert.equal(await page.evaluate(()=>FarmingStar.state.coins),before.c+35);assert.ok(await page.locator('[data-act="introdelivery"]').isDisabled());
 await page.locator('[data-act="close"]').click();
 // Responsive touch layout; native touch gestures are checked separately below.
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Settings & controls'}).click();await page.locator('#controls').selectOption('mobile');await page.getByRole('button',{name:'Save settings'}).click();
 await page.evaluate(()=>FarmingStar.travel('farm',8,11));await page.waitForTimeout(650);
 for(const size of [{width:390,height:844},{width:844,height:390}]){await page.setViewportSize(size);await page.waitForTimeout(180);const overlap=await page.evaluate(()=>{const a=['#hotbar','#joy','#mobileActions','#hud','#mini'].map(id=>({id,r:document.querySelector(id).getBoundingClientRect()}));return a.flatMap((v,i)=>a.slice(i+1).filter(w=>v.r.left<w.r.right&&v.r.right>w.r.left&&v.r.top<w.r.bottom&&v.r.bottom>w.r.top).map(w=>v.id+' '+w.id))});assert.deepEqual(overlap,[],JSON.stringify(size));
 const dims=await page.locator('#hotbar').boundingBox();assert.ok(dims.height<=52&&dims.width<=256,'compact phone hotbar');assert.equal(await page.locator('#hotbar .key').first().isVisible(),false,'keyboard numbers hidden on mobile');const slotOverflow=await page.locator('#hotbar button').evaluateAll(bs=>bs.some(b=>b.scrollHeight>b.clientHeight||b.scrollWidth>b.clientWidth));assert.equal(slotOverflow,false,'hotbar has no overflowing labels');await page.screenshot({path:path.join(__dirname,`mobile-${size.width}.png`)});}
 // Multiple slots: starting a second farm preserves the first; deleting asks first.
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Save & title screen'}).click();const first=await page.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1'));
 await page.getByRole('button',{name:'Start a new farm'}).click();await page.locator('#name').fill('Second');await page.getByRole('button',{name:'Make this place home'}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1')),first);
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Save & title screen'}).click();await page.getByRole('button',{name:'Load Game',exact:true}).click();await page.locator('[data-slotoptions="1"]').click();await page.locator('[data-deleteslot="1"]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.slot.1')),first,'delete waits for confirmation');await page.getByRole('button',{name:'Cancel',exact:true}).click();await page.locator('[data-loadslot="1"]').click();assert.notEqual(await page.evaluate(()=>FarmingStar.state.profile.name),'Second');
 // Legacy migration on a fresh browser origin state preserves original bytes and date.
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Save & title screen'}).click();const legacy=await page.evaluate(()=>{const old=FarmingStar.defaults();old.version=1;old.day=7;old.profile.name='Legacy';old.coins=321;delete old.events;delete old.journal;const raw=JSON.stringify(old);localStorage.clear();localStorage.setItem('farmingstar.moss-ember.v1',raw);return raw});await page.reload();await page.getByRole('button',{name:'Continue your farm'}).click();assert.equal(await page.evaluate(()=>FarmingStar.state.day),7);assert.equal(await page.evaluate(()=>FarmingStar.state.coins),321);assert.equal(await page.evaluate(()=>localStorage.getItem('farmingstar.moss-ember.v1')),legacy);
 // Invalid new geometry positions are relocated on load.
 await page.evaluate(()=>{const g=FarmingStar.state;g.area='town';g.x=34*24+12;g.y=3*24+12;FarmingStar.save(true)});await page.reload();await page.getByRole('button',{name:'Continue your farm'}).click();assert.ok(await page.evaluate(()=>FarmingStar.walkable(FarmingStar.state.x,FarmingStar.state.y)));

 // Browser-generated touch events verify horizontal hotbar swiping and joystick input.
 const tc=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const tp=await tc.newPage();tp.on('pageerror',e=>errors.push(e.message));await tp.goto(url);await tp.getByRole('button',{name:'Begin your story'}).tap();await tp.getByRole('button',{name:'Make this place home'}).tap();await tp.waitForTimeout(700);
 const touch=await tc.newCDPSession(tp);const bar=await tp.locator('#hotbar').boundingBox();
 const point=(x,y)=>({x,y,id:1,radiusX:2,radiusY:2,force:1});
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(bar.x+bar.width-20,bar.y+22)]});
 for(let i=1;i<=8;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(bar.x+bar.width-20-i*20,bar.y+22)]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await tp.waitForTimeout(250);
 assert.ok(await tp.locator('#hotbar').evaluate(b=>b.scrollLeft>0),'phone hotbar swipes to more tools');
 const seedIndex=await tp.evaluate(()=>FarmingStar.state.bagSlots.findIndex(v=>v?.id==='carrotSeed'));await tp.locator('[data-hotindex="'+seedIndex+'"]').tap();assert.equal(await tp.evaluate(()=>FarmingStar.state.selected),'carrotSeed');await tp.waitForTimeout(1800);assert.equal(await tp.locator('#itemLabel').isVisible(),false,'item name retracts');
 const joy=await tp.locator('#joy').boundingBox(),beforeX=await tp.evaluate(()=>FarmingStar.state.x);
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(joy.x+joy.width*.85,joy.y+joy.height/2)]});await tp.waitForTimeout(350);await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await tp.evaluate(x=>FarmingStar.state.x>x,beforeX),'touch joystick moves farmer');
 await tp.locator('#mini').tap();await tp.getByRole('button',{name:'Zoom map in',exact:true}).tap();const ab=await tp.locator('#atlas').boundingBox();
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(ab.x+ab.width/2,ab.y+ab.height/2)]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(ab.x+ab.width/2+45,ab.y+ab.height/2+30)]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await tp.evaluate(()=>FarmingStar.atlas.x>0),'atlas pans by touch');await tc.close();
 assert.deepEqual(errors,[],'no runtime errors');assert.deepEqual(requests,[],'no external requests');console.log('PASS: pixel UI, title animation, editable inputs, zoom targeting, journal rewards, routes, atlas controls, request, mobile layouts, independent saves, migration and relocation.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
