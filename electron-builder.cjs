const cfg=require('./release/release-config.json');
module.exports={
 appId:cfg.applicationId,productName:cfg.productName,electronVersion:'45.2.3',asar:true,npmRebuild:false,
 directories:{output:'artifacts/desktop',buildResources:'assets/icons'},
 files:['desktop/*.cjs','dist/web/index.html','dist/web/release.json','release/release-config.json','assets/icons/icon.png','package.json'],
 artifactName:'FarmingStar-Alpha-0.4.0-${os}-${arch}.${ext}',
 mac:{target:[{target:'dmg',arch:['universal']}],icon:'assets/icons/icon.icns',category:'public.app-category.games',identity:'-',hardenedRuntime:true,entitlements:'desktop/entitlements.mac.plist',entitlementsInherit:'desktop/entitlements.mac.plist',notarize:false},
 dmg:{title:'FarmingStar Alpha 0.4.0',artifactName:'FarmingStar-Alpha-0.4.0-macOS-Universal.dmg'},
 win:{target:[{target:'portable',arch:['x64']}],icon:'assets/icons/icon.ico',artifactName:'FarmingStar-Alpha-0.4.0-Windows-x64.exe',signAndEditExecutable:true},
 portable:{artifactName:'FarmingStar-Alpha-0.4.0-Windows-x64.exe',requestExecutionLevel:'user'},
 linux:{executableName:'farmingstar',target:['dir'],icon:'assets/icons/icon.png',category:'Game'},
 publish:null
};
