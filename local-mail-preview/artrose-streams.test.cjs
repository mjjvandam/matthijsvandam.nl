'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {matches,select,loadContent}=require('./core.cjs');
const config=require('./config.json'),lists=require('./brevo-lists.json');
test('artrose stream requires audience and either both topics or the cohort',()=>{
  for(const [id,audience,listId] of [['artrose-patienten','patienten',13],['artrose-zorgprofessionals','zorgprofessionals',14]]){
    const stream=config.streams.find(s=>s.id===id);
    assert.equal(lists.listIds[id],listId);
    const article={audience:[audience],topics:['artrose','leefstijl'],project:null};
    assert.equal(matches(article,stream),true);
    for(const topics of [[],['artrose'],['leefstijl'],['voet-en-enkel','artrose']]) assert.equal(matches({...article,topics},stream),false);
    assert.equal(matches({...article,topics:[],project:'transmuraal-tilburg-cohort'},stream),true);
    assert.equal(matches({...article,audience:[audience==='patienten'?'zorgprofessionals':'patienten']},stream),false);
  }
});
test('malformed allTopics fails closed and publication is not distribution clearance',()=>{
  for(const allTopics of ['artrose',[],['unknown']]) assert.throws(()=>select({...config,streams:[{...config.streams[0],allTopics}]},loadContent(),[],()=>''));
  assert.ok(Object.values(select({...config,releases:[]},loadContent(),[],()=>{throw Error('No clearance');})).every(a=>a.length===0));
});
