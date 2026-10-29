// Pure reporting rules. No provider credentials or family records belong here.
export type SearchRow = {date:string; clicks:number; impressions:number; position:number};
export type QueryRow = {query:string; page:string; clicks:number; impressions:number; position:number};
export type QueryWindow = {days:number; startDate:string; endDate:string; rows:QueryRow[]; rowLimit:number};
export type SearchSnapshot = {
  version:1; source:'gsc'; property:string; mode:'apps_script'|'manual_export';
  observedAt:string; startDate:string; endDate:string; dataState:'final'|'preliminary';
  dates:SearchRow[]; windows:QueryWindow[]; privacyFilteredRows:number;
};
export const searchProperties=['sc-domain:edelweizzindia.com','https://edelweizzindia.com/'];
const dayMs=86400000;
export function isoDate(value:unknown):string {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new Error('Use a date in YYYY-MM-DD format.');
  const parsed=new Date(value+'T00:00:00Z');
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value)throw new Error('Choose a real calendar date.');
  return value;
}
export const addDays=(date:string,days:number)=>new Date(Date.parse(isoDate(date)+'T00:00:00Z')+days*dayMs).toISOString().slice(0,10);
export function indiaPeriods(days:7|28,now=Date.now()){
  const today=new Date(now+330*60000).toISOString().slice(0,10);
  const startDate=addDays(today,-days),previousStartDate=addDays(today,-days*2);
  return {days,startDate,endDate:addDays(today,-1),previousStartDate,previousEndDate:addDays(startDate,-1),
    startMs:Date.parse(startDate+'T00:00:00+05:30'),endMs:Date.parse(today+'T00:00:00+05:30'),
    previousStartMs:Date.parse(previousStartDate+'T00:00:00+05:30'),timeZone:'Asia/Kolkata'};
}
export function change(current:number|null,previous:number|null,lowerIsBetter=false){
  if(current===null||previous===null)return {absolute:null,percent:null,direction:'unknown'};
  const absolute=current-previous;
  return {absolute,percent:previous>0?absolute/previous*100:null,
    direction:absolute===0?'flat':(absolute>0)!==lowerIsBetter?'up':'down'};
}
function number(value:unknown,max=1e12){
  if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>max)throw new Error('Reporting numbers must be finite and non-negative.');
  return value;
}
function publicPage(value:unknown){
  if(value===undefined||value==='')return '';
  if(typeof value!=='string'||value.length>500)throw new Error('Choose an Edelweizz public page.');
  const url=new URL(value,'https://edelweizzindia.com');
  if(url.origin!=='https://edelweizzindia.com'||url.search||url.hash||
    !/^\/(?:$|journal(?:\/[a-z0-9-]+)?$|services\/[a-z0-9-]+$)/.test(url.pathname))throw new Error('Only canonical public Edelweizz pages can be imported.');
  return url.pathname;
}
export function validateSnapshot(input:any,now=Date.now()):SearchSnapshot {
  if(!input||input.version!==1||input.source!=='gsc'||!searchProperties.includes(input.property))throw new Error('Use the verified Edelweizz Search Console property.');
  if(!['apps_script','manual_export'].includes(input.mode))throw new Error('Choose a supported reporting source.');
  const observed=Date.parse(input.observedAt);
  if(!Number.isFinite(observed)||observed>now+300000||observed<now-2*dayMs)throw new Error('The import must have a current observation timestamp.');
  const startDate=isoDate(input.startDate),endDate=isoDate(input.endDate);
  if(endDate<startDate||Date.parse(endDate)-Date.parse(startDate)>90*dayMs||endDate>new Date(now).toISOString().slice(0,10))throw new Error('Import up to 90 days of past reporting data.');
  if(!['final','preliminary'].includes(input.dataState)||!Array.isArray(input.dates)||input.dates.length>90)throw new Error('Choose final or preliminary daily Search Console data.');
  const seen=new Set<string>();
  const dates=input.dates.map((row:any)=>{
    const date=isoDate(row.date);
    if(seen.has(date)||date<startDate||date>endDate)throw new Error('Daily reporting dates must be unique and within the reporting period.');
    seen.add(date);
    return {date,clicks:number(row.clicks),impressions:number(row.impressions),position:number(row.position,100000)};
  }).sort((a:SearchRow,b:SearchRow)=>a.date.localeCompare(b.date));
  let privacyFilteredRows=0;
  if(!Array.isArray(input.windows)||input.windows.length>4)throw new Error('Import at most four bounded query reports.');
  const windows:QueryWindow[]=input.windows.map((window:any)=>{
    const start=isoDate(window.startDate),end=isoDate(window.endDate);
    if(![7,28].includes(window.days)||addDays(start,window.days-1)!==end||start<startDate||end>endDate||
      !Array.isArray(window.rows)||window.rows.length>250)throw new Error('Query reports must match a 7-day or 28-day window within the daily data.');
    const pairs=new Set<string>();
    const rows=window.rows.flatMap((row:any)=>{
      if(typeof row.query!=='string'||!row.query.trim()||row.query.length>240)throw new Error('Use a short, real Search Console query.');
      const query=row.query.trim().replace(/[\u0000-\u001f]/g,' '),page=publicPage(row.page);
      // Do not retain obvious personal contact details embedded in a query.
      if(/@|(?:\d[\s()+-]*){7,}/.test(query)){privacyFilteredRows++;return [];}
      const pair=query+'\n'+page;
      if(pairs.has(pair))throw new Error('Duplicate query/page rows are not allowed.');
      pairs.add(pair);
      return [{query,page,clicks:number(row.clicks),impressions:number(row.impressions),position:number(row.position,100000)}];
    });
    return {days:window.days,startDate:start,endDate:end,rows,rowLimit:250};
  });
  return {version:1,source:'gsc',property:input.property,mode:input.mode,observedAt:new Date(observed).toISOString(),
    startDate,endDate,dataState:input.dataState,dates,windows,privacyFilteredRows};
}
export function searchSummary(snapshot:SearchSnapshot|null,days:7|28){
  if(!snapshot||!snapshot.dates.length)return null;
  const endDate=snapshot.endDate,startDate=addDays(endDate,1-days),previousEndDate=addDays(startDate,-1),previousStartDate=addDays(startDate,-days);
  function summarize(start:string,end:string){
    if(start<snapshot!.startDate)return null;
    const rows=snapshot!.dates.filter(row=>row.date>=start&&row.date<=end);
    const clicks=rows.reduce((n,row)=>n+row.clicks,0),impressions=rows.reduce((n,row)=>n+row.impressions,0);
    return {clicks,impressions,ctr:impressions?clicks/impressions*100:null,
      position:impressions?rows.reduce((n,row)=>n+row.position*row.impressions,0)/impressions:null};
  }
  const current=summarize(startDate,endDate),previous=summarize(previousStartDate,previousEndDate);
  return {startDate,endDate,previousStartDate,previousEndDate,timeZone:'America/Los_Angeles',current,previous,
    changes:{clicks:change(current?.clicks??null,previous?.clicks??null),impressions:change(current?.impressions??null,previous?.impressions??null),
      ctr:change(current?.ctr??null,previous?.ctr??null),position:change(current?.position??null,previous?.position??null,true)},
    dataState:snapshot.dataState,mode:snapshot.mode,observedAt:snapshot.observedAt};
}
export function opportunities(snapshot:SearchSnapshot|null){
  if(!snapshot||snapshot.dataState!=='final')return [];
  const current=snapshot.windows.find(w=>w.days===28&&w.endDate===snapshot.endDate);
  if(!current)return [];
  const previous=snapshot.windows.find(w=>w.days===28&&w.endDate===addDays(current.startDate,-1));
  return current.rows.filter(row=>row.impressions>=30&&!/edelwei[sz]+/i.test(row.query)).map(row=>{
    const before=previous?.rows.find(x=>x.query===row.query&&x.page===row.page),ctr=row.impressions?row.clicks/row.impressions:0;
    const local=/sarjapur|sarjapura|chembanahalli|kallahalli|volagere|dommasandra|kada agrahara/i.test(row.query);
    const near=/near me|nearby/i.test(row.query),rank=row.position>=5&&row.position<=20;
    const lowCtr=row.position<=20&&ctr<0.03;
    const score=Math.round(Math.log2(row.impressions+1)*(rank?3:1)+(local?6:near?3:0)+(lowCtr?5:0));
    return {id:row.query+'\n'+row.page,query:row.query,page:row.page,clicks:row.clicks,impressions:row.impressions,
      ctr:ctr*100,position:row.position,previousClicks:before?.clicks??null,score,
      localIntent:local?'Named nearby locality':near?'Near-me intent; searcher location unavailable':'Location not specified',
      recommendation:lowCtr?'Review whether the title and opening answer match this parent question.':rank?'Improve the existing page’s useful answer and internal links.':'Review the existing page for the query’s intent.',
      note:'A review rule, not a promised uplift. At least 30 impressions are required; observe a change for 14 days.'};
  }).sort((a,b)=>b.score-a.score||b.impressions-a.impressions).slice(0,12);
}
