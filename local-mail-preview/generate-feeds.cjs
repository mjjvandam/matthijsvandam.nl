'use strict';
// Local build output only; this command never approves content or publishes a feed.
const fs=require('node:fs'),path=require('node:path');
const {loadContent,select,rss,root}=require('./core.cjs');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'config.json')));
const selected=select(config,loadContent(),JSON.parse(fs.readFileSync(path.join(root,'PUBLICATIE_REGISTER.json'))).pages,p=>fs.readFileSync(path.join(root,p)));
const outputs=config.streams.map(s=>[s.id+'.xml',rss(s,selected[s.id])]);
const dir=path.join(__dirname,'generated');
if(process.argv.includes('--check')){
 for(const [name,body] of outputs) if(!fs.existsSync(path.join(dir,name)) || fs.readFileSync(path.join(dir,name),'utf8')!==body)throw Error('Feed ontbreekt of is verouderd: '+name);
 const known=new Set(outputs.map(([n])=>n));
 if(fs.readdirSync(dir).some(n=>n.endsWith('.xml')&&!known.has(n)))throw Error('Verouderde feed aanwezig.');
 console.log('RSS-uitvoer actueel; geen verzending of livecontrole uitgevoerd.');
}else{
 fs.mkdirSync(dir,{recursive:true});
 const known=new Set(outputs.map(([n])=>n));
 if(fs.readdirSync(dir).some(n=>n.endsWith('.xml')&&!known.has(n)))throw Error('Oude feed aanwezig; beoordeel deze voordat je opnieuw genereert.');
 for(const [name,body] of outputs)fs.writeFileSync(path.join(dir,name),body);
 console.log('Lokale RSS-uitvoer gegenereerd: '+outputs.length+' feeds, '+Object.values(selected).flat().length+' vrijgegeven plaatsingen.');
}
