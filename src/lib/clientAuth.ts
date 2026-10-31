const MASTER='https://nurcupnuhkzpssrwgyxr.supabase.co';
let cached:{key:string;expires:number}|undefined;
export class ClientAccessError extends Error{constructor(message:string,public status=401){super(message)}}
export async function verifiedClient(request:Request):Promise<{id:string;email:string}>{
 const token=request.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9._~-]+)$/)?.[1];
 if(!token||token.length>12000)throw new ClientAccessError('Sign in at https://www.anyhealth.asia/meeting before booking.');
 if(!cached||cached.expires<Date.now()){
  const r=await fetch('https://www.anyhealth.asia/client-projects-api/config',{cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw new ClientAccessError('Account verification is temporarily unavailable.',503);
  const config=await r.json();if(config.url?.replace(/\/$/,'')!==MASTER||typeof config.anon_key!=='string')throw new ClientAccessError('Account verification is temporarily unavailable.',503);
  cached={key:config.anon_key,expires:Date.now()+300000};
 }
 const r=await fetch(MASTER+'/auth/v1/user',{headers:{apikey:cached.key,Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw new ClientAccessError('Sign in again before booking.');const user=await r.json();
 if(!user.id||!user.email||!user.email_confirmed_at)throw new ClientAccessError('Verify your account email before booking.',403);
 return{id:user.id,email:user.email};
}
