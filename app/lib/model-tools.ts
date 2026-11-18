import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatStellarUSDC} from './stellar-amount.mjs';

export type ModelKind = 'chat' | 'image' | 'voice';
export interface ToolModel {
  id:string; name:string; kind:ModelKind; description:string; contextLength:number;
  pricing:Record<string,string>; voices:string[]; inputModalities:string[]; outputModalities:string[];
}
export interface ModelCatalog {models:ToolModel[];configured:boolean;paymentsEnabled:boolean;generationStatus:string;fetchedAt:number;warnings:string[]}
export interface ModelPurchase {
  id:string;state:string;terms:{modelId:string;kind:ModelKind;amount:string;expiresAt:number;provider:string;markupBps:number;limits:Record<string,unknown>};
  transaction:string|null;error:string|null;commitmentId?:string|null;channelId?:string|null;
  result:{kind:ModelKind;text?:string;base64?:string;mediaType?:string;generationId:string|null;providerCost:number|null}|null;
}
export const MODEL_MANAGER_URL = process.env.EXPO_PUBLIC_MANAGER_URL || 'https://helixbox-stellar-manager-43f4.onrender.com';
const MANAGER=MODEL_MANAGER_URL;
export function formatUSDC(amount:string):string {
  return formatStellarUSDC(amount);
}
export async function modelRequest<T>(path:string,password?:string,body?:unknown):Promise<T> {
  if (!MANAGER) throw new Error('Configure a separate Stellar manager before using model tools');
  if (body !== undefined) throw new Error('Stellar payments are not available yet');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),30000);
  try {
  const response = await fetch(`${MANAGER}/v2/models${path}`,{
    method:body===undefined?'GET':'POST',
    signal:controller.signal,
    headers:{Accept:'application/json',...(password?{Authorization:`Bearer ${password}`} :{}),...(body===undefined?{}:{'Content-Type':'application/json'})},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),
  });
  const data=await response.json().catch(()=>null);
  if(controller.signal.aborted) throw new Error('Model request timed out');
  if(!response.ok) throw new Error(typeof data?.error==='string'?data.error:`Model service unavailable (${response.status})`);
  return data as T;
  } catch(error) {
    if(controller.signal.aborted) throw new Error('Model request timed out. Check the existing purchase or mandate status before trying again.');
    throw error;
  } finally { clearTimeout(timeout); }
}
export async function payForModelCall(job:ModelPurchase,password:string):Promise<ModelPurchase> {
  void job; void password;
  throw new Error('Stellar payments are not available yet');
}
export const activeModelPurchase = {
  get:(code:string)=>AsyncStorage.getItem(`helixbox:model-purchase:${code}`),
  set:(code:string,id:string)=>AsyncStorage.setItem(`helixbox:model-purchase:${code}`,id),
};
