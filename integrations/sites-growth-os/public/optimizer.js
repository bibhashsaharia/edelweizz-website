const $=selector=>document.querySelector(selector);
const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=String(text);if(className)node.className=className;return node;};
let report=null,currentAction=null,requestEpoch=0;
const number=value=>value===null||value===undefined?'Not available':new Intl.NumberFormat('en-IN',{maximumFractionDigits:1}).format(value);
const when=value=>value?new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(value)):'Not yet';
function notice(text,error=false){const node=$('#dashboard-notice');node.hidden=false;node.textContent=text;node.classList.toggle('error',error);}
async function api(path,options={}){
  const response=await fetch(path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}});
  const data=await response.json().catch(()=>({error:'The report could not be read.'}));
  if(!response.ok)throw new Error(data.error||'The request could not be completed.');
  return data;
}
function metric(target,title,current,previous,delta,suffix=''){
  const card=el('div',undefined,'optimizer-metric');card.append(el('h3',title),el('strong',current===null?'Not available':number(current)+suffix));
  let label='No comparison available';
  if(delta?.absolute!==null&&delta?.absolute!==undefined){
    const absolute=number(Math.abs(delta.absolute));
    label=(delta.absolute>0?'+':delta.absolute<0?'−':'')+absolute+suffix+' vs previous';
    if(delta.percent!==null&&suffix!=='%')label+=' ('+(delta.percent>0?'+':'')+number(delta.percent)+'%)';
    if(previous===0&&current>0)label+=' · previous value was zero';
  }
  card.append(el('small',label,'delta-'+(delta?.direction||'unknown')));target.append(card);
}
function chart(target,rows,key,label){
  target.replaceChildren();
  if(!rows.length){target.append(el('p','No verified observations are available for this chart.','chart-empty'));return;}
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 850 230');svg.setAttribute('role','img');
  const title=document.createElementNS(ns,'title');title.textContent=label;svg.append(title);
  const max=Math.max(1,...rows.map(row=>row[key]||0)),points=rows.map((row,index)=>[40+(rows.length===1?0:index/(rows.length-1)*770),180-(row[key]||0)/max*135]);
  const line=document.createElementNS(ns,'polyline');line.setAttribute('points',points.map(point=>point.join(',')).join(' '));line.setAttribute('class','chart-line');svg.append(line);
  points.forEach((point,index)=>{const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',point[0]);dot.setAttribute('cy',point[1]);dot.setAttribute('r','3');dot.setAttribute('class','chart-dot');const tip=document.createElementNS(ns,'title');tip.textContent=rows[index].date+': '+number(rows[index][key]);dot.append(tip);svg.append(dot);});
  [[40,210,rows[0].date],[680,210,rows[rows.length-1].date],[10,35,number(max)],[16,185,'0']].forEach(([x,y,text])=>{const node=document.createElementNS(ns,'text');node.setAttribute('x',x);node.setAttribute('y',y);node.setAttribute('class','chart-axis');node.textContent=text;svg.append(node);});
  target.append(svg,el('p',label+' · '+rows.length+' reporting days','chart-caption'));
  const details=el('details'),summary=el('summary','Read chart values');details.append(summary);
  const list=el('p');list.textContent=rows.map(row=>row.date+': '+number(row[key])).join(' · ');details.append(list);target.append(details);
}
function connection(target,title,status,note){
  const card=el('div',undefined,'connection-card');card.append(el('h3',title),el('strong',status),el('p',note));target.append(card);
}
function actionForm(action={}){
  currentAction=action.id?action:null;const form=$('#action-form');form.reset();
  for(const name of ['title','path','rationale','note','status','commit','deployment','appliedDate'])if(action[name]!==undefined&&action[name]!==null)form.elements[name].value=action[name];
  form.querySelector('.form-status').textContent='';$('#action-dialog').showModal();
}
function render(data){
  report=data;$('#generated-at').textContent='Dashboard refreshed '+when(data.generatedAt);
  const p=data.period;$('#period-label').textContent=p.startDate+' – '+p.endDate+' compared with '+p.previousStartDate+' – '+p.previousEndDate+' · India time';
  const outcomes=$('#outcome-metrics');outcomes.replaceChildren();
  [['New recorded enquiries','enquiries'],['Reviewed conversations','reviewedEnquiries'],['Consented website visitors','visitors'],['Call-click interest','callClicks'],['WhatsApp-click interest','whatsappClicks']].forEach(([title,key])=>metric(outcomes,title,data.current[key],data.previous[key],data.changes[key]));
  $('#history-note').textContent=(data.history.partialHistory?'The previous period includes time before the first recorded enquiry; this comparison may not have complete history. ':'')+'First recorded visit: '+when(data.history.firstRecordedVisit)+'. '+data.history.note;
  chart($('#enquiry-chart'),data.trend,'enquiries','New recorded enquiries each day');
  const google=data.google,summary=google.summary,search=$('#search-metrics');search.replaceChildren();
  $('#search-status').textContent=google.state==='not_connected'?'Google reporting is not connected. No search numbers have been substituted.':
    (google.mode==='manual_export'?'Manual Search Console export. Automatic refresh is not yet established. ':'Google Apps Script report received. ')+
    (google.stale?'The last successful report is more than 48 hours old. ':'')+
    'Observed '+when(google.snapshotObservedAt)+'. Last reported Google date: '+google.lastReportedDate+'. '+(google.lastError?.message||'');
  $('#search-period').textContent=summary?summary.startDate+' – '+summary.endDate+' versus '+summary.previousStartDate+' – '+summary.previousEndDate+' · Pacific reporting dates · '+summary.dataState+' data':'Connect Google or import a dated CSV to review search trends.';
  [['Search impressions','impressions',''],['Search clicks','clicks',''],['Click-through rate','ctr','%'],['Average position','position','']].forEach(([title,key,suffix])=>metric(search,title,summary?.current?.[key]??null,summary?.previous?.[key]??null,summary?.changes?.[key],suffix));
  chart($('#search-chart'),google.trend.filter(row=>!summary||row.date>=summary.startDate),'impressions','Google Search impressions each reporting day');
  const sources=$('#source-rows');sources.replaceChildren();
  data.sources.forEach(source=>{const row=el('tr');[source.source,source.current,source.previous].forEach(value=>row.append(el('td',value)));sources.append(row);});
  if(!data.sources.length){const row=el('tr'),cell=el('td','No enquiry records in these periods.');cell.colSpan=3;row.append(cell);sources.append(row);}
  const opp=$('#opportunities');opp.replaceChildren();
  data.opportunities.forEach(item=>{const card=el('article',undefined,'opportunity-card');card.append(el('h3',item.query),el('p',item.localIntent),el('p',item.impressions+' impressions · '+item.clicks+' clicks · position '+number(item.position)+' · CTR '+number(item.ctr)+'%'),el('p',item.recommendation),el('small',item.note));const button=el('button','Add to change log','secondary');button.type='button';button.addEventListener('click',()=>actionForm({title:'Review: '+item.query,path:item.page||'/',status:'proposed',rationale:item.impressions+' impressions, '+item.clicks+' clicks, average position '+number(item.position)+'. '+item.recommendation}));card.append(button);opp.append(card);});
  if(!data.opportunities.length)opp.append(el('p','No query/page opportunity meets the evidence threshold yet. Connect a final Google query report, or collect a longer baseline.','chart-empty'));
  const actions=$('#actions');actions.replaceChildren();data.actions.forEach(action=>{const card=el('article',undefined,'action-card');card.append(el('h3',action.title),el('p',action.status+' · '+action.path+' · updated '+when(action.updatedAt)),el('p',action.rationale));
    if(action.commit)card.append(el('p','Source commit: '+action.commit));
    if(action.deployment)card.append(el('p','Deployment: '+action.deployment));
    if(action.reviewAfter)card.append(el('p','Review results on or after '+action.reviewAfter+'.'));
    const details=el('details'),summaryNode=el('summary','Change history');details.append(summaryNode);action.history.forEach(entry=>details.append(el('p',when(entry.at)+' · '+entry.status+' · '+(entry.note||'Status recorded'))));card.append(details);
    const button=el('button','Update log','secondary');button.type='button';button.addEventListener('click',()=>actionForm(action));card.append(button);actions.append(card);});
  if(!data.actions.length)actions.append(el('p','No changes have been logged yet. Record the evidence and source commit when a change is applied.','chart-empty'));
  const connections=$('#connection-states');connections.replaceChildren();
  connection(connections,'Website enquiries','Live records','New people deduplicated from the existing enquiry inbox. Staff review is still needed for new submissions.');
  connection(connections,'Google Search',google.state==='not_connected'?'Not connected':google.stale?'Stale report':google.dataState+' data','Last received '+when(google.receivedAt)+'. '+google.note);
  connection(connections,'Unattended updater',data.updater.lastSuccessAt?'Report received':data.updater.verifiedAt?'Writer verified; Google report pending':'Not verified','Writer check: '+when(data.updater.verifiedAt)+'. Successful report: '+when(data.updater.lastSuccessAt)+'. '+(data.updater.error||'A successful report does not by itself confirm that a daily trigger is installed.'));
  connection(connections,'Maps reporting',data.metricool.state==='report_received'?'Dated report received':'Not ingested',data.metricool.note);
  const maps=$('#maps-report');maps.replaceChildren();
  if(data.metricool.rows?.length){const table=el('table'),head=el('tr');['Date','Search views','Maps views','Website clicks','Call clicks','Directions'].forEach(name=>head.append(el('th',name)));const thead=el('thead');thead.append(head);table.append(thead);const tbody=el('tbody');data.metricool.rows.forEach(item=>{const row=el('tr');[item.date,number(item.reachSearch),number(item.reachMaps),number(item.websiteClicks),number(item.callClicks),number(item.directionsClicks)].forEach(value=>row.append(el('td',value)));tbody.append(row);});table.append(tbody);const scroll=el('div',undefined,'table-scroll');scroll.append(table);maps.append(el('p','Metricool report received '+when(data.metricool.observedAt)+'. No continuous daily feed has been inferred.','muted'),scroll);}
  else maps.append(el('p','No Maps reporting rows have been imported.','chart-empty'));
  const history=$('#run-history');history.replaceChildren();data.runs.forEach(run=>history.append(el('div',when(run.receivedAt)+' · '+run.status+' · '+run.mode+' · '+run.startDate+' – '+run.endDate+' · '+run.dailyRows+' daily rows','receipt-row')));
  if(!data.runs.length)history.append(el('p','No reporting run has been received yet.','muted'));
}
async function load(){
  const epoch=++requestEpoch;$('#refresh').disabled=true;
  try{const data=await api('/api/optimizer?days='+$('#period').value);if(epoch!==requestEpoch)return;render(data);$('#dashboard-notice').hidden=true;}
  catch(error){notice(error.message+(report?' The last successful dashboard remains visible.':''),true);}
  finally{if(epoch===requestEpoch)$('#refresh').disabled=false;}
}
$('#refresh').addEventListener('click',load);$('#period').addEventListener('change',load);
$('#new-action').addEventListener('click',()=>actionForm());$('#close-action').addEventListener('click',()=>$('#action-dialog').close());
$('#action-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]');button.disabled=true;
  try{const payload=Object.fromEntries(new FormData(form));payload.revision=currentAction?.revision||0;if(currentAction)payload.id=currentAction.id;await api('/api/optimizer/actions',{method:'POST',body:JSON.stringify(payload)});$('#action-dialog').close();await load();}
  catch(error){form.querySelector('.form-status').textContent=error.message;}finally{button.disabled=false;}
});
$('#create-key').addEventListener('click',async()=>{if(!window.confirm('Create a new private reporting key? Any previous updater key will stop working.'))return;
  const button=$('#create-key');button.disabled=true;try{const result=await api('/api/optimizer/key',{method:'POST',body:'{}'});$('#sync-key').value=result.key;$('#sync-key').type='password';$('#show-key').textContent='Show key';$('#key-expiry').textContent='Expires '+when(result.expiresAt)+'. Keep it in private Script Properties, never in a public repository.';$('#key-result').hidden=false;}
  catch(error){notice(error.message,true);}finally{button.disabled=false;}
});
$('#show-key').addEventListener('click',()=>{const input=$('#sync-key');input.type=input.type==='password'?'text':'password';$('#show-key').textContent=input.type==='password'?'Show key':'Hide key';});
function csv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(char===','&&!quoted){row.push(field);field='';}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(Boolean))rows.push(row);row=[];field='';}else field+=char;}
  if(quoted)throw new Error('The CSV contains an unfinished quoted field.');row.push(field);if(row.some(Boolean))rows.push(row);return rows;
}
$('#import-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]');button.disabled=true;
  try{const file=form.elements.file.files[0];if(!file||file.size>200000)throw new Error('Choose a Dates CSV smaller than 200 KB.');
    const rows=csv((await file.text()).replace(/^\uFEFF/,'')),header=rows.shift().map(value=>value.trim().toLowerCase());
    const indexes=['date','clicks','impressions','position'].map(name=>header.indexOf(name));if(indexes.some(index=>index<0))throw new Error('Export the English Search Console Dates CSV, with Date, Clicks, Impressions and Position columns.');
    const dates=rows.map(row=>({date:row[indexes[0]],clicks:Number(row[indexes[1]].replace(/,/g,'')),impressions:Number(row[indexes[2]].replace(/,/g,'')),position:Number(row[indexes[3]].replace(/,/g,''))})).sort((a,b)=>a.date.localeCompare(b.date));
    if(!dates.length)throw new Error('The CSV has no daily observations.');
    const result=await api('/api/optimizer/import',{method:'POST',body:JSON.stringify({requestId:crypto.randomUUID(),snapshot:{version:1,source:'gsc',mode:'manual_export',property:form.elements.property.value,observedAt:new Date().toISOString(),startDate:dates[0].date,endDate:dates[dates.length-1].date,dataState:form.elements.dataState.value,dates,windows:[]}})});
    form.querySelector('.form-status').textContent=result.saved?'Daily report saved.':'The same request is processing; refresh the dashboard.';await load();
  }catch(error){form.querySelector('.form-status').textContent=error.message;}finally{button.disabled=false;}
});
load();
