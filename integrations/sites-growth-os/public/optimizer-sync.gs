/**
 * Private free Google updater. Credentials belong in Script Properties.
 * Required properties: GSC_PROPERTY and EDELWEIZZ_SYNC_KEY.
 */
var EDELWEIZZ_ORIGIN = 'https://edelweizzindia.com';
var EDELWEIZZ_GSC_PROPERTIES = ['sc-domain:edelweizzindia.com', 'https://edelweizzindia.com/'];
function edelweizzDateOffset(date, days) {
  return new Date(Date.parse(date + 'T00:00:00Z') + days * 86400000).toISOString().slice(0, 10);
}
function edelweizzSend(key, payload) {
  var response = UrlFetchApp.fetch(EDELWEIZZ_ORIGIN + '/api/optimizer/ingest', {
    method:'post', contentType:'application/json', headers:{Authorization:'Bearer ' + key},
    payload:JSON.stringify(payload), muteHttpExceptions:true, followRedirects:false
  });
  var status=response.getResponseCode(), data;
  try { data=JSON.parse(response.getContentText()); } catch (_) { data={}; }
  if(status<200 || status>=300) throw new Error('Edelweizz reporting returned HTTP ' + status + '. Check the key and dashboard connection status.');
  return data;
}
function edelweizzGoogleQuery(property,token,startDate,endDate,dimensions,rowLimit) {
  var response=UrlFetchApp.fetch('https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(property) + '/searchAnalytics/query', {
    method:'post', contentType:'application/json', headers:{Authorization:'Bearer ' + token},
    payload:JSON.stringify({startDate:startDate,endDate:endDate,dimensions:dimensions,type:'web',dataState:'final',rowLimit:rowLimit}),
    muteHttpExceptions:true, followRedirects:false
  });
  if(response.getResponseCode()!==200) {
    var error=new Error('Google Search Console returned HTTP ' + response.getResponseCode() + '.');
    error.reason=/SERVICE_DISABLED|accessNotConfigured|has not been used|disabled/i.test(response.getContentText())?'google_api_disabled':
      response.getResponseCode()===401 || response.getResponseCode()===403?'google_permission':'google_unavailable';
    throw error;
  }
  return JSON.parse(response.getContentText()).rows || [];
}
function syncEdelweizz() {
  var lock=LockService.getScriptLock();
  if(!lock.tryLock(1000)) throw new Error('Another updater run is active.');
  var properties=PropertiesService.getScriptProperties(), key=properties.getProperty('EDELWEIZZ_SYNC_KEY');
  try {
    var property=properties.getProperty('GSC_PROPERTY');
    if(EDELWEIZZ_GSC_PROPERTIES.indexOf(property)===-1 || !/^edg_[a-f0-9]{64}$/.test(key || '')) throw new Error('Set GSC_PROPERTY and the private EDELWEIZZ_SYNC_KEY in Script Properties.');
    edelweizzSend(key,{kind:'verify'});
    var today=Utilities.formatDate(new Date(),'America/Los_Angeles','yyyy-MM-dd');
    var requestedEnd=edelweizzDateOffset(today,-1),requestedStart=edelweizzDateOffset(requestedEnd,-61);
    var token=ScriptApp.getOAuthToken();
    var rawDays=edelweizzGoogleQuery(property,token,requestedStart,requestedEnd,['date'],90);
    rawDays.sort(function(a,b){return a.keys[0].localeCompare(b.keys[0]);});
    var endDate=rawDays.length?rawDays[rawDays.length-1].keys[0]:requestedEnd;
    var startDate=edelweizzDateOffset(endDate,-55);
    if(startDate<requestedStart)startDate=requestedStart;
    var dates=rawDays.filter(function(row){return row.keys[0]>=startDate && row.keys[0]<=endDate;}).map(function(row){
      return {date:row.keys[0],clicks:row.clicks,impressions:row.impressions,position:row.position};
    });
    var windows=[];
    [7,28].forEach(function(days){
      [0,days].forEach(function(offset){
        var end=edelweizzDateOffset(endDate,-offset),start=edelweizzDateOffset(end,1-days);
        if(start<startDate)return;
        var rows=edelweizzGoogleQuery(property,token,start,end,['query','page'],250).filter(function(row){
          return row.keys[0] && row.keys[0].length<=240 && /^https:\/\/edelweizzindia\.com\/(?:$|journal(?:\/[a-z0-9-]+)?$|services\/[a-z0-9-]+$)/.test(row.keys[1]);
        }).map(function(row){return {query:row.keys[0],page:row.keys[1],clicks:row.clicks,impressions:row.impressions,position:row.position};});
        windows.push({days:days,startDate:start,endDate:end,rows:rows,rowLimit:250});
      });
    });
    var requestId=Utilities.getUuid();
    var result=edelweizzSend(key,{requestId:requestId,snapshot:{
      version:1,source:'gsc',property:property,mode:'apps_script',observedAt:new Date().toISOString(),
      startDate:startDate,endDate:endDate,dataState:'final',dates:dates,windows:windows
    }});
    if(!result.saved || result.receipt.status!=='saved')throw new Error('The dashboard did not confirm a durable save.');
    properties.setProperty('LAST_SUCCESS_AT',new Date().toISOString());
    console.log('Report saved. Request '+requestId+'; '+dates.length+' daily observations; last reported final Google date '+endDate+'.');
  } catch(error) {
    if(key && error.reason){try{edelweizzSend(key,{kind:'source_error',reason:error.reason});}catch(_){}}
    throw new Error(error.message || 'The Google updater could not complete.');
  } finally {lock.releaseLock();}
}
function installDailyTrigger() {
  var last=Date.parse(PropertiesService.getScriptProperties().getProperty('LAST_SUCCESS_AT') || '');
  if(!isFinite(last) || Date.now()-last>86400000)throw new Error('Run syncEdelweizz successfully and verify its dashboard receipt first.');
  var exists=ScriptApp.getProjectTriggers().some(function(trigger){return trigger.getHandlerFunction()==='syncEdelweizz';});
  if(!exists)ScriptApp.newTrigger('syncEdelweizz').timeBased().atHour(8).nearMinute(0).everyDays(1).inTimezone('Asia/Kolkata').create();
  console.log(exists?'The existing daily trigger was preserved.':'Daily refresh installed for approximately 8 AM India time.');
}
