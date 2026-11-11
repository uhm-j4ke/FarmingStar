// Shared HTML is the sole game source. Release copies remove test-only exports.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),cfg=require('../release/release-config.json');
function prepareHTML(input){
// HTML parsers normalise CRLF before CSP hashes are checked. Compile canonical LF on every host.
let html=input.replace(/\r\n?/g,'\n');
html=html.replace('const BUILD_FLAGS=Object.freeze({developerTools:true});','const BUILD_FLAGS=Object.freeze({developerTools:false});');
html=html.replace(/\/\/ BEGIN TEST HOOKS[\s\S]*?\/\/ END TEST HOOKS/g,'// Test instrumentation omitted from production.');
if(/window\.FarmingStar\s*=|__FARMINGSTAR_TEST__/.test(html))throw Error('Unrestricted test hooks remain in release HTML');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1],hash=crypto.createHash('sha256').update(source).digest('base64');
const policy=`default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`;
html=html.replace('<head>','<head><meta http-equiv="Content-Security-Policy" content="'+policy+'">');
return html;
}
function prepareWeb(){
const original=fs.readFileSync(path.join(root,'index.html')),html=prepareHTML(original.toString('utf8'));
for(const rel of (process.argv.includes('--desktop-only')?['dist/web']:['dist/web','android/app/src/main/assets/web'])){
 const out=path.join(root,rel);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);
 fs.writeFileSync(path.join(out,'release.json'),JSON.stringify({version:cfg.version,channel:cfg.prerelease?'Prerelease':'Release',sourceHtmlSha256:crypto.createHash('sha256').update(original).digest('hex')},null,2)+'\n');
}
console.log('Production HTML prepared: offline assets, hashed script policy, no diagnostic state API.');
}
if(require.main===module)prepareWeb();
module.exports={prepareHTML,prepareWeb};
