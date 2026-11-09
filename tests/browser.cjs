// Test hooks are opt-in before document execution; release copies strip them entirely.
const playwright=require('playwright');
const chromium=Object.create(playwright.chromium);
chromium.launch=async options=>{
 const browser=await playwright.chromium.launch(options),newContext=browser.newContext.bind(browser),newPage=browser.newPage.bind(browser);
 browser.newContext=async options=>{const context=await newContext(options);await context.addInitScript(()=>{window.__FARMINGSTAR_TEST__=true});return context};
 browser.newPage=async options=>{const page=await newPage(options);await page.addInitScript(()=>{window.__FARMINGSTAR_TEST__=true});return page};
 return browser;
};
module.exports={...playwright,chromium};
