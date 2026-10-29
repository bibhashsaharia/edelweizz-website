import {staffFor,withAuth} from '../../lib/staff-auth';
import {page,privateHeaders} from '../../lib/console-shared';
import html from '../../site/optimizer.html?raw';
export const dynamic='force-dynamic';
export async function GET(request:Request){
  const staff=await staffFor(request);
  if(!staff)return withAuth(request,new Response(null,{status:302,headers:{Location:'/login'}}));
  if(staff.role!=='owner')return withAuth(request,new Response('Owner access is required.',{status:403,headers:privateHeaders}));
  const output=page('Growth optimizer',html,'/optimizer.js').replace('</head>','<link rel="stylesheet" href="/optimizer.css"></head>');
  return withAuth(request,new Response(output,{headers:privateHeaders}));
}
