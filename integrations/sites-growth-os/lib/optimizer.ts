import {env} from 'cloudflare:workers';
import {staffFor,withAuth,settingsValue,saveSetting} from './staff-auth';
import {body,json,validOrigin,problem,clean} from './console-shared';
import {indiaPeriods,change,searchSummary,opportunities,validateSnapshot,isoDate} from './optimizer-core';
import type {SearchSnapshot} from './optimizer-core';

const prefix='optimizer:';
const errorReasons:Record<string,string>={
  google_permission:'Google reporting permission is not available. Check the selected property and Google account.',
  google_api_disabled:'Enable the Google Search Console API in the script’s linked Google Cloud project.',
  google_unavailable:'Google reporting could not be refreshed. The previous successful report is retained.',
};
async function owner(request:Request,write=false){
  const staff=await staffFor(request);
  if(staff?.role!=='owner')return withAuth(request,json({error:'Owner access is required.'},403));
  if(write&&!validOrigin(request,env.SITE_ORIGIN))return json({error:'Use the owner dashboard.'},403);
  return null;
}
function db(){if(!env.DB)throw new Error('Reporting storage is unavailable.');return env.DB;}
async function read(key:string){return settingsValue(prefix+key);}
async function write(key:string,value:unknown){return saveSetting(prefix+key,value);}
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
async function digest(value:string){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));}
function equal(a:string,b:string){let different=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)different|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return different===0;}

export async function optimizerReport(request:Request){
  const denied=await owner(request);if(denied)return denied;
  try{
    const database=db(),days=Number(new URL(request.url).searchParams.get('days'))===7?7:28,period=indiaPeriods(days);
    // Deduplicate new people in SQL. Neither the dedupe value nor family payloads leave this query.
    const leads=await database.prepare(
      "WITH valid AS (SELECT e.id,e.created_at,e.status,COALESCE(d.source,'unknown') AS source,"+
      "ROW_NUMBER() OVER (PARTITION BY COALESCE(NULLIF(json_extract(e.payload,'$.phone'),''),e.id) ORDER BY e.created_at,e.id) AS occurrence,"+
      "MAX(CASE WHEN e.status IN ('contacted','qualified','assessment_booked','assessment_attended','enrolled') THEN 1 ELSE 0 END) OVER "+
      "(PARTITION BY COALESCE(NULLIF(json_extract(e.payload,'$.phone'),''),e.id)) AS reviewed "+
      "FROM enquiries e LEFT JOIN lead_details d ON d.enquiry_id=e.id WHERE COALESCE(d.lost_reason,'') NOT IN ('Duplicate','Spam')) "+
      "SELECT created_at,source,reviewed FROM valid WHERE occurrence=1 AND created_at>=? AND created_at<? ORDER BY created_at"
    ).bind(period.previousStartMs,period.endMs).all<any>();
    const events=await database.prepare(
      'SELECT visit_id,kind,source,created_at FROM growth_events WHERE created_at>=? AND created_at<? ORDER BY created_at'
    ).bind(period.previousStartMs,period.endMs).all<any>();
    const first=await database.prepare('SELECT MIN(created_at) AS first FROM growth_events').first<any>();
    const firstLead=await database.prepare('SELECT MIN(created_at) AS first FROM enquiries').first<any>();
    function summarize(start:number,end:number){
      const received=leads.results.filter(row=>row.created_at>=start&&row.created_at<end),interest=events.results.filter(row=>row.created_at>=start&&row.created_at<end);
      const count=(kind:string)=>new Set(interest.filter(row=>row.kind===kind).map(row=>row.visit_id)).size;
      return {enquiries:received.length,reviewedEnquiries:received.filter(row=>row.reviewed===1).length,
        visitors:count('visit'),callClicks:count('call_click'),whatsappClicks:count('whatsapp_click')};
    }
    const current=summarize(period.startMs,period.endMs),previous=summarize(period.previousStartMs,period.startMs);
    const sources=Array.from(new Set(leads.results.map(row=>String(row.source)))).map(source=>({
      source,current:leads.results.filter(row=>row.source===source&&row.created_at>=period.startMs).length,
      previous:leads.results.filter(row=>row.source===source&&row.created_at<period.startMs).length
    })).sort((a,b)=>b.current-a.current);
    const trend=[];
    for(let stamp=period.startMs;stamp<period.endMs;stamp+=86400000){
      const counts=summarize(stamp,stamp+86400000);
      trend.push({date:new Date(stamp+330*60000).toISOString().slice(0,10),...counts});
    }
    const stored=await read('gsc'),snapshot=stored?.snapshot as SearchSnapshot|null||null;
    const sync=await read('sync-key'),updater=await read('updater'),maps=await read('metricool');
    const history=await database.prepare("SELECT key,value,updated_at FROM site_settings WHERE key LIKE 'optimizer:action:%' OR key LIKE 'optimizer:run:%' ORDER BY updated_at DESC LIMIT 100").all<any>();
    const actions=history.results.filter(row=>row.key.startsWith(prefix+'action:')).map(row=>JSON.parse(row.value)).slice(0,50);
    const runs=history.results.filter(row=>row.key.startsWith(prefix+'run:')).map(row=>JSON.parse(row.value)).slice(0,30);
    const technical=await database.prepare('SELECT created_at,report FROM seo_checks ORDER BY created_at DESC LIMIT 1').first<any>();
    const changes=Object.fromEntries(Object.keys(current).map(key=>[key,change(current[key as keyof typeof current],previous[key as keyof typeof previous])]));
    const partialHistory=firstLead?.first===null||firstLead?.first>period.previousStartMs;
    if(partialHistory){changes.enquiries=change(null,null);changes.reviewedEnquiries=change(null,null);}
    if(first?.first===null||first?.first>period.previousStartMs)for(const key of ['visitors','callClicks','whatsappClicks'])changes[key]=change(null,null);
    return withAuth(request,json({
      generatedAt:Date.now(),period,current,previous,changes,sources,trend,
      history:{firstRecordedVisit:first?.first??null,firstRecordedEnquiry:firstLead?.first??null,partialHistory,
        note:'These are recorded, consented observations. Missing historical capture is not evidence that traffic was zero. Review new submissions in the enquiry inbox before treating them as genuine conversations.'},
      google:{state:snapshot?'data_received':'not_connected',snapshotObservedAt:snapshot?.observedAt??null,
        receivedAt:stored?.receivedAt??null,dataState:snapshot?.dataState??null,mode:snapshot?.mode??null,
        lastReportedDate:snapshot?.endDate??null,stale:!stored?.receivedAt||Date.now()-stored.receivedAt>48*3600000,
        summary:searchSummary(snapshot,days),trend:snapshot?.dates??[],privacyFilteredRows:snapshot?.privacyFilteredRows??0,
        lastError:stored?.lastError??null,note:'Search Console shows searches where this website appeared. It does not measure every neighbourhood search or a Google Maps ranking grid. Query rows are capped at 250 per window; totals come from date-only property data.'},
      updater:{keyConfigured:!!sync||!!(env as any).OPTIMIZER_SYNC_KEY,verifiedAt:updater?.verifiedAt??null,lastSuccessAt:updater?.lastSuccessAt??null,
        lastAttemptAt:updater?.lastAttemptAt??null,error:updater?.error??null},
      metricool:maps?{state:'report_received',...maps,note:'These are the actual dated rows returned by Metricool. Missing dates and a daily refresh are not assumed. Maps actions are interest, not received enquiries.'}:
        {state:'not_ingested',note:'The external Metricool account connection does not establish a reporting feed to this dashboard. No Maps or Instagram performance is inferred.'},
      opportunities:opportunities(snapshot),actions,runs,
      technical:technical?{checkedAt:technical.created_at,...JSON.parse(technical.report)}:null
    }));
  }catch{return withAuth(request,json({error:'The optimizer report could not be loaded. Existing reports have been retained.'},503));}
}

export async function optimizerKey(request:Request){
  const denied=await owner(request,true);if(denied)return denied;
  try{
    const bytes=crypto.getRandomValues(new Uint8Array(32)),key='edg_'+hex(bytes.buffer),now=Date.now();
    await write('sync-key',{hash:await digest(key),createdAt:now,expiresAt:now+180*86400000});
    return withAuth(request,json({key,expiresAt:now+180*86400000,
      endpoint:'https://edelweizzindia.com/api/optimizer/ingest',
      note:'Shown once. Store it only in your private Google Apps Script properties. Previous updater keys stop working immediately.'}));
  }catch{return withAuth(request,json({error:'The updater key could not be created.'},503));}
}

async function writer(request:Request){
  const token=/^Bearer (edg_[a-f0-9]{64})$/.exec(request.headers.get('authorization')||'')?.[1];
  if(!token)return false;
  const stored=await read('sync-key');
  if(stored)return stored.expiresAt>Date.now()&&equal(await digest(token),stored.hash);
  // A deployment-managed bootstrap writer is superseded by the owner's first key.
  const runtimeKey=(env as any).OPTIMIZER_SYNC_KEY;
  return typeof runtimeKey==='string'&&equal(await digest(token),await digest(runtimeKey));
}
async function saveSnapshot(input:any,mode:'apps_script'|'manual_export'){
  const requestId=clean(input.requestId,80);
  if(!/^[0-9a-f-]{36}$/.test(requestId))throw new Error('Use a unique reporting request ID.');
  const snapshot=validateSnapshot({...input.snapshot,mode});
  const existing=await read('gsc'),receivedAt=Date.now();
  if(existing?.snapshot?.observedAt>snapshot.observedAt)throw new Error('A newer report is already stored. Refresh the export before importing.');
  const runKey=prefix+'run:'+requestId;
  const receipt={id:requestId,status:'saved',mode,receivedAt,observedAt:snapshot.observedAt,startDate:snapshot.startDate,endDate:snapshot.endDate,
    dailyRows:snapshot.dates.length,queryRows:snapshot.windows.reduce((n,row)=>n+row.rows.length,0),dataState:snapshot.dataState};
  const prior=await db().prepare('SELECT value FROM site_settings WHERE key=?').bind(runKey).first<{value:string}>();
  if(prior){const receipt=JSON.parse(prior.value);return receipt.status==='saved'?{saved:true,duplicate:true,receipt}:
    receipt.status==='superseded'?{saved:false,superseded:true,receipt}:{saved:false,inProgress:true};}
  const claim=await db().prepare('INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO NOTHING')
    .bind(runKey,JSON.stringify({...receipt,status:'processing'}),receivedAt).run();
  if(!claim.meta.changes)return {saved:false,inProgress:true};
  const writes=await db().batch([
    db().prepare('INSERT INTO site_settings(key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at WHERE json_extract(site_settings.value,\'$.snapshot.observedAt\')<=?')
      .bind(prefix+'gsc',JSON.stringify({snapshot,receivedAt,lastError:null}),receivedAt,snapshot.observedAt),
    db().prepare("INSERT INTO site_settings(key,value,updated_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM site_settings WHERE key=? AND json_extract(value,'$.snapshot.observedAt')=? AND updated_at=?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at")
      .bind(prefix+'updater',JSON.stringify({verifiedAt:receivedAt,lastSuccessAt:receivedAt,lastAttemptAt:receivedAt,error:null,mode}),receivedAt,prefix+'gsc',snapshot.observedAt,receivedAt),
    db().prepare("UPDATE site_settings SET value=CASE WHEN EXISTS(SELECT 1 FROM site_settings WHERE key=? AND json_extract(value,'$.snapshot.observedAt')=? AND updated_at=?) THEN ? ELSE ? END,updated_at=? WHERE key=?")
      .bind(prefix+'gsc',snapshot.observedAt,receivedAt,JSON.stringify(receipt),JSON.stringify({...receipt,status:'superseded'}),receivedAt,runKey),
    db().prepare("DELETE FROM site_settings WHERE key LIKE 'optimizer:run:%' AND updated_at<?").bind(receivedAt-180*86400000)
  ]);
  return writes[0].meta.changes?{saved:true,receipt}:{saved:false,superseded:true,receipt:{...receipt,status:'superseded'}};
}
export async function optimizerImport(request:Request){
  const denied=await owner(request,true);if(denied)return denied;
  try{return withAuth(request,json(await saveSnapshot(await body(request,700000),'manual_export')));}
  catch(e){return withAuth(request,problem(e));}
}
export async function optimizerIngest(request:Request){
  try{
    if(!await writer(request))return json({error:'A valid scoped updater key is required.'},401);
    const now=Date.now(),rate=await db().prepare('INSERT INTO auth_attempts(id,subject,created_at) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM auth_attempts WHERE subject=? AND created_at>?)<12')
      .bind(crypto.randomUUID(),'optimizer-sync',now,'optimizer-sync',now-3600000).run();
    if(!rate.meta.changes)return json({error:'Reporting refresh limit reached. Try later.'},429);
    const input=await body(request,700000);
    if(input.kind==='verify'){
      const existing=await read('updater')||{};
      await write('updater',{...existing,verifiedAt:now,lastAttemptAt:now});
      return json({verified:true,serverTime:now});
    }
    if(input.kind==='source_error'){
      const message=errorReasons[String(input.reason)]||errorReasons.google_unavailable,stored=await read('gsc');
      if(stored)await write('gsc',{...stored,lastError:{at:now,message}});
      const existing=await read('updater')||{};
      await write('updater',{...existing,lastAttemptAt:now,error:message});
      return json({recorded:true});
    }
    if(input.kind==='metricool'){
      if(input.brandId!=='7292781'||!Array.isArray(input.rows)||input.rows.length>90)throw new Error('Use bounded reports from the connected Edelweizz brand.');
      const allowed=['reachSearch','reachMaps','websiteClicks','callClicks','directionsClicks'],seen=new Set<string>();
      const rows=input.rows.map((row:any)=>{
        const date=isoDate(row.date);if(seen.has(date)||date>new Date(now).toISOString().slice(0,10))throw new Error('Use unique past Metricool dates.');seen.add(date);
        const metrics:any={date};for(const field of allowed){const value=row[field];if(value!==null&&value!==undefined){if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>1e12)throw new Error('Use non-negative provider metrics.');metrics[field]=value;}}
        return metrics;
      }).sort((a:any,b:any)=>a.date.localeCompare(b.date));
      await write('metricool',{source:'metricool',brandId:'7292781',observedAt:now,timeZone:'Asia/Kolkata',rows,
        fields:{reachSearch:'GMEV18',reachMaps:'GMEV19',websiteClicks:'GMEV21',callClicks:'GMEV22',directionsClicks:'GMEV23'}});
      return json({saved:true,source:'metricool',receivedAt:now,rows:rows.length});
    }
    return json(await saveSnapshot(input,'apps_script'));
  }catch(e){return problem(e);}
}
export async function optimizerAction(request:Request){
  const denied=await owner(request,true);if(denied)return denied;
  try{
    const input=await body(request,7000),id=input.id?clean(input.id,80):crypto.randomUUID();
    if(!/^[0-9a-f-]{36}$/.test(id)||!Number.isInteger(input.revision))throw new Error('Reload the action before saving.');
    const key=prefix+'action:'+id,old=await read('action:'+id);
    if((old?.revision||0)!==input.revision)return json({error:'The action changed elsewhere. Reload before saving.'},409);
    const title=clean(input.title,200),path=clean(input.path,200)||'/',rationale=clean(input.rationale,1200),note=clean(input.note,1200);
    if(!title||!rationale||!/^\/(?:$|journal(?:\/[a-z0-9-]+)?$|services\/[a-z0-9-]+$)/.test(path))throw new Error('Record a title, public page and evidence for the change.');
    const statuses=['proposed','approved','applied','measuring','reverted','dismissed'],status=String(input.status);
    if(!statuses.includes(status))throw new Error('Choose an action status.');
    const commit=clean(input.commit,40),deployment=clean(input.deployment,100);
    if(commit&&!/^[0-9a-f]{40}$/.test(commit))throw new Error('Use the full source commit SHA.');
    if(['applied','measuring','reverted'].includes(status)&&!commit)throw new Error('An applied or reverted change needs its source commit.');
    const appliedDate=input.appliedDate?isoDate(input.appliedDate):null;
    if(appliedDate&&appliedDate>new Date().toISOString().slice(0,10))throw new Error('Record a past or current date for an applied change.');
    if(['applied','measuring'].includes(status)&&!appliedDate)throw new Error('Record the actual change date.');
    const now=Date.now(),action={id,title,path,rationale,note,status,commit,deployment,appliedDate,reviewAfter:appliedDate?new Date(Date.parse(appliedDate+'T00:00:00Z')+14*86400000).toISOString().slice(0,10):null,
      createdAt:old?.createdAt||now,updatedAt:now,revision:Number(input.revision)+1,
      history:[...(old?.history||[]),{at:now,status,note,commit,deployment}].slice(-40)};
    const result=old?await db().prepare("UPDATE site_settings SET value=?,updated_at=? WHERE key=? AND json_extract(value,'$.revision')=?")
      .bind(JSON.stringify(action),now,key,input.revision).run():
      await db().prepare('INSERT INTO site_settings(key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO NOTHING').bind(key,JSON.stringify(action),now).run();
    if(!result.meta.changes)return json({error:'Another session saved this action. Reload first.'},409);
    return withAuth(request,json({saved:true,action}));
  }catch(e){return withAuth(request,problem(e));}
}
