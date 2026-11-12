// Reuse a completed shared gate only when every input to those tests is byte-identical.
// Any changed game, test, dependency, version, or unverifiable proof runs the full suite again.
const fs=require('node:fs'),cp=require('node:child_process');
const output=value=>fs.appendFileSync(process.env.GITHUB_OUTPUT,'reused='+value+'\n'),git=args=>cp.execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
try{
 const run=process.env.FARMINGSTAR_SHARED_PROOF_RUN;if(!run||!/^\d+$/.test(run))throw Error('No prior proof selected');
 const report=JSON.parse(cp.execFileSync('gh',['run','view',run,'--json','headSha,jobs'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}));
 const job=report.jobs.find(j=>j.steps?.some(s=>s.name.startsWith('Run npm test ')&&s.conclusion==='success'));if(!job)throw Error('Previous shared gate did not pass');
 git(['fetch','--depth=1','origin',report.headSha]);
 const command=require('../package.json').scripts.test,tests=[...command.matchAll(/node (tests\/[\w.-]+\.cjs)/g)].map(m=>m[1]);if(tests.length!==8)throw Error('Shared suite definition changed');
 const inputs=['index.html','package.json','package-lock.json','release/release-config.json','tests/browser.cjs',...tests],hashes={};
 for(const file of inputs){const before=git(['rev-parse',report.headSha+':'+file]),after=git(['rev-parse','HEAD:'+file]);if(before!==after)throw Error('Changed shared input: '+file);hashes[file]=after}
 const proof={status:'PASS: reused only after identical game/test/dependency blobs were verified',previousRun:run,previousCommit:report.headSha,previousJob:job.databaseId,currentCommit:process.env.GITHUB_SHA,runUrl:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${run}`,blobs:hashes};fs.mkdirSync('release/evidence',{recursive:true});fs.writeFileSync('release/evidence/shared-browser-proof.json',JSON.stringify(proof,null,2)+'\n');output('true');console.log('Prior eight-suite pass is valid for these identical inputs: '+proof.runUrl);
}catch(e){console.log('Run all shared tests: '+e.message);output('false')}
