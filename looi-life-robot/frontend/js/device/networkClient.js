import {sha256} from './sha256.js';
import {verifyFirmware,savePreparedFirmware,loadPreparedFirmware} from './firmwareCache.js';
export class DeviceNetworkClient {
  constructor({onLost=()=>{}}={}){this.session='';this.client='';this.info={};this.onLost=onLost;this.poll=null;this.busy=false;this.epoch=0;this.controlToken=0;this.motionEpoch=0;}
  async bridge(path,{body,bytes,headers={}}={}){
    const response=await fetch('/api/device'+path,{method:body||bytes?'POST':'GET',headers:{'X-Looi-Bridge':'1','X-Looi-Session':this.session,...(body?{'Content-Type':'application/json'}:{}),...headers},body:bytes??(body?JSON.stringify(body):undefined)});
    const result=await response.json();if(!response.ok)throw Error(result.message||'Device bridge unavailable');return result;
  }
  async connect(host,password){const r=await this.bridge('/connect',{body:{host,password}});this.session=r.session;this.client=r.client;this.info=r.info;this.startPolling();return r.info;}
  startPolling(){clearInterval(this.poll);this.poll=setInterval(async()=>{if(this.busy)return;this.busy=true;const epoch=this.epoch;try{if(this.info.control_owner==='http:'+this.client&&this.controlToken){const renewing=this.controlToken;try{await this.command({type:'control_renew'});}catch{if(this.controlToken===renewing)this.controlToken=0;}}this.info=await this.bridge('/status');}catch(e){if(epoch===this.epoch){this.close();this.onLost(e);}}finally{this.busy=false;}},250);}
  async rawCommand(payload){const result=await this.bridge('/command',{body:payload});if(result.type==='error'||result.accepted===false)throw Error(result.message||'Device rejected command');return result;}
  async command(payload){
    const type=payload.type;
    if(type==='stop'){this.motionEpoch++;this.controlToken=0;return this.rawCommand(payload);}
    const epoch=this.motionEpoch;
    if(type==='motion'&&!this.controlToken){const claim=await this.rawCommand({type:'control_acquire'});if(epoch!==this.motionEpoch)throw Error('Command cancelled');this.controlToken=claim.control_token;}
    const result=await this.rawCommand({...payload,control_token:this.controlToken});
    if(epoch!==this.motionEpoch)throw Error('Command cancelled');
    if(type==='control_acquire')this.controlToken=result.control_token;
    if(['calibration_set','wifi_configure','wifi_forget','ota_start','control_release','firmware_check','firmware_install'].includes(type))this.controlToken=0;
    return result;
  }
  async disconnect(){try{if(this.session)await this.bridge('/disconnect',{body:{}});}finally{this.close();}}
  close(){this.epoch++;this.motionEpoch++;this.controlToken=0;clearInterval(this.poll);this.session='';}
  async upload(file,expected,closeHotspot=true){if(!file.name.endsWith('.bin')||file.size<32||file.size>3145728)throw Error('Select an application .bin (maximum 3 MB)');const bytes=await file.arrayBuffer(),digest=sha256(bytes);if(expected&&digest!==expected.toLowerCase())throw Error('Firmware checksum mismatch');await this.command({type:'ota_start',close_ap_after_update:closeHotspot});clearInterval(this.poll);try{const r=await this.bridge('/upload',{bytes,headers:{'Content-Type':'application/octet-stream','X-Firmware-SHA256':digest}});this.close();return r;}catch(e){this.startPolling();throw e;}}
  async release(){return this.bridge('/release');}
  async prepare(release){const response=await fetch('/api/device/release/binary',{headers:{'X-Looi-Bridge':'1'}});if(!response.ok)throw Error((await response.json()).message||'Download failed');const bytes=await response.arrayBuffer();verifyFirmware(bytes,release);await savePreparedFirmware(release,bytes);return release;}
  async installPrepared(closeHotspot=true){const cached=await loadPreparedFirmware();if(!cached)throw Error('Download firmware before joining the ESP hotspot');verifyFirmware(cached.bytes,cached.release);return this.upload(new File([cached.bytes],'looi-s3.bin'),cached.release.sha256,closeHotspot);}

}
