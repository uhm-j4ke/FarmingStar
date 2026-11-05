const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const server=require('node:http').createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync(path.join(__dirname,'../index.html')))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url())});
  const url='http://127.0.0.1:'+server.address().port;await page.goto(url);
  await page.evaluate(()=>{const f=FarmingStar,g=f.defaults();g.day=29;g.time=1260;g.energy=10;g.settings.reduced=false;g.settings.zoom=3;f.start(g);f.travel('home',5,5);f.state.dir=3;f.state.plots['10,17']={crop:'carrot',age:0,water:true};f.state.forecast[30]='Sunny';f.updateInteraction()});
  assert.equal(await page.evaluate(()=>FarmingStar.resolveInteraction()?.label),'Sleep');
  await page.keyboard.press('e');await page.getByRole('button',{name:'Sleep until morning & save'}).click();
  const first=await page.evaluate(()=>{const f=FarmingStar,g=f.state;return {day:g.day,time:g.time,energy:g.energy,age:g.plots['10,17'].age,sleep:g.events.sleep,repeat:f.sleepInBed()}});
  assert.deepEqual(first,{day:30,time:480,energy:100,age:1,sleep:1,repeat:false});
  await page.keyboard.press('Escape');assert.ok(await page.locator('#sleepArt').isVisible());
  await page.screenshot({path:path.join(__dirname,'bedtime.png')});await page.waitForTimeout(1800);
  assert.equal(await page.evaluate(()=>FarmingStar.resting),null);
  await page.reload();await page.getByRole('button',{name:'Continue your farm'}).click();
  assert.equal(await page.evaluate(()=>FarmingStar.state.day),30);
  // Midnight already commits the daily crop/shipping update. A 01:00 bedtime wakes today.
  await page.evaluate(()=>{const f=FarmingStar,g=f.state;f.travel('farm',10,16);g.plots['10,17'].water=true;g.forecast[31]='Sunny';g.time=1439.9;f.update(.3);if(g.day!==31||g.plots['10,17'].age!==2)throw Error('midnight failed');f.travel('home',5,5);g.dir=3;g.time=60;g.energy=8;f.interact()});
  await page.getByRole('button',{name:'Sleep until morning & save'}).click();
  assert.deepEqual(await page.evaluate(()=>{const g=FarmingStar.state;return {day:g.day,time:g.time,age:g.plots['10,17'].age,energy:g.energy,sleep:g.events.sleep}}),{day:31,time:480,age:2,energy:100,sleep:2});
  await page.waitForTimeout(1800);
  // Sleep is physically tied to a bed, not a remote menu action.
  assert.equal(await page.evaluate(()=>{FarmingStar.travel('town',12,11);return FarmingStar.sleepInBed()}),false);
  // Continuous leaves are behind the sheet, seasonal, non-interactive and disabled by reduced motion.
  await page.evaluate(()=>FarmingStar.journal());await page.waitForTimeout(150);
  const leaves=await page.evaluate(()=>{const c=document.querySelector('#menuAmbience'),sheet=document.querySelector('#sheet');return {painted:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0),pointer:getComputedStyle(c).pointerEvents,behind:+getComputedStyle(c).zIndex<+getComputedStyle(sheet).zIndex}});
  assert.deepEqual(leaves,{painted:true,pointer:'none',behind:true});
  for(const [day,color]of [[1,[184,216,138]],[15,[129,172,102]],[29,[228,178,99]],[43,[213,228,216]]]){
   await page.evaluate(day=>FarmingStar.state.day=day,day);await page.waitForTimeout(100);
   assert.ok(await page.evaluate(color=>{const c=document.querySelector('#menuAmbience'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i+=4)if(d[i]===color[0]&&d[i+1]===color[1]&&d[i+2]===color[2]&&d[i+3]===255)return true;return false},color),'seasonal leaf palette '+day);
  }
  await page.evaluate(()=>FarmingStar.state.day=31);await page.waitForTimeout(100);
  await page.screenshot({path:path.join(__dirname,'seasonal-menu.png')});
  await page.evaluate(()=>FarmingStar.state.settings.reduced=true);await page.waitForTimeout(120);
  assert.equal(await page.evaluate(()=>{const c=document.querySelector('#menuAmbience');return c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)}),false);
  await page.evaluate(()=>{const f=FarmingStar;f.close();f.state.settings.reduced=false;f.travel('home',7,6);f.state.dir=2});await page.waitForTimeout(500);
  await page.screenshot({path:path.join(__dirname,'art-home.png')});
  await page.evaluate(()=>FarmingStar.travel('grocery'));await page.waitForTimeout(500);await page.screenshot({path:path.join(__dirname,'art-grocery.png')});
  await page.evaluate(()=>FarmingStar.travel('farm',9,8));await page.waitForTimeout(500);await page.screenshot({path:path.join(__dirname,'art-buildings.png')});
  const phone=await browser.newPage({viewport:{width:844,height:390},deviceScaleFactor:3,isMobile:true,hasTouch:true});phone.on('pageerror',e=>errors.push(e.message));await phone.goto(url);
  await phone.evaluate(()=>{const f=FarmingStar,g=f.defaults();g.settings.mobile=true;g.time=1260;f.start(g);f.travel('home',5,5);f.state.dir=3;f.updateInteraction()});
  await phone.locator('#interact').tap();await phone.getByRole('button',{name:'Sleep until morning & save'}).tap();assert.ok(await phone.locator('#sleepArt').isVisible());
  const message=await phone.locator('.sleepScene p').boundingBox(),sheet=await phone.locator('#sheet').boundingBox();assert.ok(message.y+message.height<=sheet.y+sheet.height,'landscape bedtime message fits');
  await phone.screenshot({path:path.join(__dirname,'bedtime-mobile.png')});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('PASS: bedside interaction, night and after-midnight sleep, one-shot save/crop advancement, reduced-motion menu leaves and mobile bedtime.');
 }finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exit(1)});
