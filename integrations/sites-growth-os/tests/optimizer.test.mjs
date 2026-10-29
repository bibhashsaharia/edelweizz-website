import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';

const sqlite=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(file=>file.endsWith('.sql')).sort())sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
function stmt(sql,args=[]){return {
  bind(...values){return stmt(sql,values);},
  async first(){return sqlite.prepare(sql).get(...args)||null;},
  async all(){return {results:sqlite.prepare(sql).all(...args)};},
  async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}};}
};}
const db={prepare:stmt,async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const statement of statements)results.push(await statement.run());sqlite.exec('COMMIT');return results;}catch(error){sqlite.exec('ROLLBACK');throw error;}}};
const origin='https://edelweizzindia.com',out='/tmp/edelweizz-optimizer-tests.mjs';
globalThis.__optimizerEnv={DB:db,ENQUIRY_OWNER_EMAIL:'owner@example.test',SITE_ORIGIN:origin,OPTIMIZER_SYNC_KEY:'edg_'+'a'.repeat(64)};
await build({stdin:{contents:"export * from './lib/optimizer.ts';export * from './lib/optimizer-core.ts';",resolveDir:process.cwd(),loader:'ts'},outfile:out,bundle:true,platform:'node',format:'esm',plugins:[{name:'worker-env',setup(builder){builder.onResolve({filter:/^cloudflare:workers$/},()=>({path:'env',namespace:'test-env'}));builder.onLoad({filter:/.*/,namespace:'test-env'},()=>({contents:'export const env=globalThis.__optimizerEnv;',loader:'js'}));}}]});
const api=await import(pathToFileURL(out).href+'?t='+Date.now());
let checks=0;function check(value,message){assert.ok(value,message);checks++;}
function throws(fn,message){assert.throws(fn,undefined,message);checks++;}
const owner={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@example.test'};
const front={'oai-authenticated-user-id':'front','oai-authenticated-user-email':'front@example.test'};
sqlite.prepare('INSERT INTO staff_users(id,email,name,role,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').run('front','front@example.test','Front','frontdesk',1,Date.now(),Date.now());
function request(path,method='GET',data,headers=owner){
  return new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...headers},...(data===undefined?{}:{body:JSON.stringify(data)})});
}
check((await api.optimizerReport(request('/api/optimizer','GET',undefined,{}))).status===403,'Anonymous reporting denied');
check((await api.optimizerReport(request('/api/optimizer','GET',undefined,front))).status===403,'Front desk cannot read owner optimizer');
check((await api.optimizerKey(request('/api/optimizer/key','POST',{}, {...owner,origin:'https://untrusted.example'}))).status===403,'Cross-origin key creation rejected');
const periods=api.indiaPeriods(7,Date.parse('2026-10-29T12:00:00Z'));
check(periods.startDate==='2026-10-22'&&periods.endDate==='2026-10-28'&&periods.previousStartDate==='2026-10-15','India periods exclude today and compare equal days');
check(api.change(10,0).percent===null&&api.change(10,0).absolute===10,'Zero baseline has no invented percentage');
check(api.change(8,12,true).direction==='up','Lower ranking number is an improvement');
check(api.change(null,12).direction==='unknown','Missing data has unknown change');
throws(()=>api.isoDate('2026-02-30'),'Invalid calendar dates rejected');
const now=Date.now(),period=api.indiaPeriods(28,now);
function lead(phone,createdAt,status,source,reason=''){
  const id=crypto.randomUUID();
  sqlite.prepare('INSERT INTO enquiries(id,request_id,reference,created_at,status,payload,consent_version,submitter_hash) VALUES (?,?,?,?,?,?,?,?)')
    .run(id,crypto.randomUUID(),id,createdAt,status,JSON.stringify({phone,childName:'Secret child fixture',notes:'Private notes fixture'}),'test','test');
  sqlite.prepare('INSERT INTO lead_details(enquiry_id,source,lost_reason,updated_at) VALUES (?,?,?,?)').run(id,source,reason,createdAt);
  return id;
}
lead('9880000001',period.previousStartMs+86400000,'contacted','google_organic');
lead('9880000001',period.startMs+86400000,'contacted','direct');
lead('9880000002',period.startMs+86400000,'new','google_maps');
lead('9880000002',period.startMs+2*86400000,'qualified','direct');
lead('9880000003',period.startMs+86400000,'closed','other','Spam');
lead('9880000004',period.startMs+86400000,'closed','other','Duplicate');
lead('9880000005',period.endMs+1000,'new','direct');
for(const [visit,kind,path] of [['one','visit','/'],['one','visit','/journal'],['two','visit','/'],['one','call_click','/'],['one','call_click','/journal'],['two','whatsapp_click','/']]){
  sqlite.prepare('INSERT INTO growth_events(id,visit_id,kind,path,source,created_at) VALUES (?,?,?,?,?,?)').run(crypto.randomUUID(),visit,kind,path,'direct',period.startMs+86400000);
}
let response=await api.optimizerReport(request('/api/optimizer?days=28')),report=await response.json();
check(report.current.enquiries===1&&report.previous.enquiries===1,'New people deduplicated across records and periods; spam and today excluded');
check(report.current.reviewedEnquiries===1,'Later reviewed record qualifies the deduplicated person');
check(report.current.visitors===2&&report.current.callClicks===1&&report.current.whatsappClicks===1,'Consented interest deduplicated and kept separate from enquiries');
check(!JSON.stringify(report).includes('988000000')&&!JSON.stringify(report).includes('Secret child')&&!JSON.stringify(report).includes('Private notes'),'No family payload or dedupe contact leaves reporting');
check(report.google.state==='not_connected'&&report.google.summary===null,'Missing Google integration is not a zero-metric report');
check(report.period.endDate===api.indiaPeriods(28).endDate&&report.trend.length===28,'Report returns complete-period dates and trend');
check(report.history.partialHistory&&report.changes.enquiries.direction==='unknown','Partial capture history does not advertise a growth percentage');
const end=api.addDays(new Date(now).toISOString().slice(0,10),-2),start=api.addDays(end,-55);
const dates=Array.from({length:56},(_,i)=>({date:api.addDays(start,i),clicks:i<28?1:2,impressions:100,position:i<28?12:8}));
const snapshot={version:1,source:'gsc',property:'sc-domain:edelweizzindia.com',mode:'apps_script',observedAt:new Date(now).toISOString(),startDate:start,endDate:end,dataState:'final',dates,windows:[
  {days:28,startDate:api.addDays(end,-27),endDate:end,rowLimit:250,rows:[{query:'occupational therapy chembanahalli',page:'/services/occupational-therapy',clicks:1,impressions:100,position:8},{query:'parent@example.test',page:'/',clicks:0,impressions:10,position:20}]},
  {days:28,startDate:start,endDate:api.addDays(end,-28),rowLimit:250,rows:[{query:'occupational therapy chembanahalli',page:'/services/occupational-therapy',clicks:0,impressions:60,position:12}]}
]};
const normalized=api.validateSnapshot(snapshot,now),summary=api.searchSummary(normalized,28);
check(normalized.privacyFilteredRows===1,'Obvious contact details in query removed');
check(summary.current.clicks===56&&summary.previous.clicks===28&&summary.current.impressions===2800,'Totals use daily property data, not truncated query rows');
check(summary.current.position===8&&summary.changes.position.direction==='up'&&summary.current.ctr===2,'Weighted position and CTR computed correctly');
check(api.opportunities(normalized).length===1&&api.opportunities(normalized)[0].localIntent==='Named nearby locality','Evidence-backed local query opportunity generated');
throws(()=>api.validateSnapshot({...snapshot,property:'sc-domain:other.example'},now),'Foreign properties rejected');
throws(()=>api.validateSnapshot({...snapshot,dates:[{...dates[0],impressions:-1}]},now),'Negative metrics rejected');
throws(()=>api.validateSnapshot({...snapshot,dates:[dates[0],dates[0]]},now),'Duplicate daily dates rejected');
throws(()=>api.validateSnapshot({...snapshot,windows:[{...snapshot.windows[0],rows:[{...snapshot.windows[0].rows[0],page:'https://untrusted.example/'}]}]},now),'Foreign page URLs rejected');
check(api.searchSummary({...normalized,startDate:api.addDays(end,-27)},28).previous===null,'Insufficient baseline remains unavailable');
check(api.searchSummary({...normalized,dates:[]},28)===null,'An empty provider observation set is not fabricated zero traffic');
check(api.opportunities({...normalized,dataState:'preliminary'}).length===0,'Preliminary reports do not generate edit recommendations');
check((await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'verify'},{}))).status===401,'Public writer rejects unsigned traffic');
const writerHeaders={authorization:'Bearer '+globalThis.__optimizerEnv.OPTIMIZER_SYNC_KEY};
check((await(await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'verify'},writerHeaders))).json()).verified,'Scoped unattended writer verified without a staff cookie');
const payload={requestId:crypto.randomUUID(),snapshot};
let saved=await(await api.optimizerIngest(request('/api/optimizer/ingest','POST',payload,writerHeaders))).json();
check(saved.saved&&saved.receipt.status==='saved','Writer durably saves Google report');
check((await(await api.optimizerIngest(request('/api/optimizer/ingest','POST',payload,writerHeaders))).json()).duplicate,'Retry uses idempotent request receipt');
await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'source_error',reason:'google_permission'},writerHeaders));
report=await(await api.optimizerReport(request('/api/optimizer'))).json();
check(report.google.summary.current.clicks===56&&!!report.google.lastError,'Failed refresh retains successful report and visible error');
check(report.runs.length===1&&report.runs[0].status==='saved','One successful request creates one durable receipt');
const keyResult=await(await api.optimizerKey(request('/api/optimizer/key','POST',{}))).json();
check(/^edg_[0-9a-f]{64}$/.test(keyResult.key),'Owner creates an opaque scoped writer key');
check((await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'verify'},writerHeaders))).status===401,'Owner key supersedes bootstrap writer immediately');
const newWriter={authorization:'Bearer '+keyResult.key};
check((await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'verify'},newWriter))).status===200,'New private writer works');
check((await api.optimizerReport(request('/api/optimizer','GET',undefined,newWriter))).status===403,'Writer cannot read owner reports or family records');
response=await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'metricool',brandId:'7292781',rows:[{date:end,callClicks:0,websiteClicks:2}]},newWriter));
check(response.status===200,'Bounded real-source Metricool observations accepted');
report=await(await api.optimizerReport(request('/api/optimizer'))).json();
check(report.metricool.rows.length===1&&report.metricool.rows[0].callClicks===0&&report.metricool.rows[0].reachMaps===undefined,'Maps zero applies only to an observed metric/date; missing metrics remain unavailable');
check((await api.optimizerIngest(request('/api/optimizer/ingest','POST',{kind:'metricool',brandId:'other',rows:[]},newWriter))).status===400,'Other Metricool brands rejected');
const action={revision:0,title:'Improve a useful existing page',path:'/services/occupational-therapy',status:'proposed',rationale:'A local query has 100 verified impressions.',note:'Review first.'};
let actionSaved=await(await api.optimizerAction(request('/api/optimizer/actions','POST',action))).json();
check(actionSaved.saved&&actionSaved.action.revision===1,'Owner action log persists with a revision');
check((await api.optimizerAction(request('/api/optimizer/actions','POST',{...action,id:actionSaved.action.id}))).status===409,'Stale action update rejected');
check((await api.optimizerAction(request('/api/optimizer/actions','POST',{...action,id:actionSaved.action.id,revision:1,status:'applied'}))).status===400,'Applied change requires commit provenance');
actionSaved=await(await api.optimizerAction(request('/api/optimizer/actions','POST',{...action,id:actionSaved.action.id,revision:1,status:'applied',commit:'b'.repeat(40),deployment:'Test version',appliedDate:end}))).json();
check(actionSaved.action.history.length===2&&actionSaved.action.reviewAfter===api.addDays(end,14),'Action history records a 14-day observation window and source commit');
check((await api.optimizerAction(request('/api/optimizer/actions','POST',action,front))).status===403,'Front desk cannot approve or log optimizer changes');

// Exercise the actual Apps Script through isolated provider and trigger mocks.
const properties=new Map([['GSC_PROPERTY',snapshot.property],['EDELWEIZZ_SYNC_KEY',keyResult.key]]);
let triggerCount=0,googleReads=0,posts=0;
const context={Date,JSON,Math,isFinite,encodeURIComponent,Error,console:{log(){}},
  LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties.get(key),setProperty:(key,value)=>properties.set(key,value)})},
  Utilities:{formatDate:()=>api.addDays(end,1),getUuid:()=>crypto.randomUUID()},
  ScriptApp:{getOAuthToken:()=> 'isolated-token',getProjectTriggers:()=>triggerCount?[{getHandlerFunction:()=> 'syncEdelweizz'}]:[],newTrigger:()=>({timeBased(){return this;},atHour(){return this;},nearMinute(){return this;},everyDays(){return this;},inTimezone(){return this;},create(){triggerCount++;}})},
  UrlFetchApp:{fetch:(url,options)=>{
    if(url.startsWith('https://www.googleapis.com/')){googleReads++;const input=JSON.parse(options.payload);const rows=input.dimensions[0]==='date'?dates.map(row=>({keys:[row.date],...row})):[];return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({rows})};}
    assert.equal(url,origin+'/api/optimizer/ingest');posts++;const input=JSON.parse(options.payload);
    if(input.snapshot){api.validateSnapshot(input.snapshot);return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({saved:true,receipt:{status:'saved'}})};}
    return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({verified:true})};
  }}
};
vm.runInNewContext(fs.readFileSync('public/optimizer-sync.gs','utf8'),context);
throws(()=>context.installDailyTrigger(),'Daily trigger blocked until a real save receipt exists');
context.syncEdelweizz();
check(googleReads===5&&posts===2&&properties.has('LAST_SUCCESS_AT'),'Script reads Google dates and bounded windows, verifies writer and checks a save receipt');
context.installDailyTrigger();context.installDailyTrigger();
check(triggerCount===1,'Trigger installation is idempotent');
check(!fs.readFileSync('site/optimizer.html','utf8').includes('gtag')&&!fs.readFileSync('public/optimizer.js','utf8').includes('innerHTML'),'Owner dashboard has no analytics and uses safe DOM text rendering');
sqlite.close();
console.log(checks+' optimizer checks passed.');
