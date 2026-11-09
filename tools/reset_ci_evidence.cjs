// Only an ephemeral GitHub runner checkout may discard retained historical test evidence.
const fs=require('node:fs');
if(process.env.GITHUB_ACTIONS!=='true'||process.env.CI!=='true')throw Error('Evidence reset is only permitted in a GitHub Actions checkout');
fs.rmSync('release/evidence',{recursive:true,force:true});fs.mkdirSync('release/evidence',{recursive:true});fs.writeFileSync('release/evidence/run.json',JSON.stringify({commit:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,os:process.platform,arch:process.arch,startedAt:new Date().toISOString()},null,2)+'\n');
