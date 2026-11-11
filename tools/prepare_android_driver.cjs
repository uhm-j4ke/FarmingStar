// Test-runner-only workaround for Playwright 1.58.2 caching an unattached WebView page.
// This never changes the APK or game. Fail explicitly when upgrading the pinned dependency.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.dirname(require.resolve('playwright-core/package.json')),pkg=require(path.join(root,'package.json'));
assert.equal(pkg.version,'1.58.2','Reassess the Android target-readiness workaround after a Playwright upgrade');
const file=path.join(root,'lib/client/android.js'),source=fs.readFileSync(file,'utf8'),before='return import_browserContext.BrowserContext.from(context).pages()[0];',after='const attachedContext = import_browserContext.BrowserContext.from(context);\n    return attachedContext.pages()[0] || await attachedContext.waitForEvent("page", { timeout: 120000 });';
if(source.includes(after))console.log('Android target-readiness workaround already applied.');
else{assert.equal(source.split(before).length,2,'Pinned Android helper structure changed');fs.writeFileSync(file,source.replace(before,after));console.log('Applied Android page-readiness fix; app binaries unchanged.');}
