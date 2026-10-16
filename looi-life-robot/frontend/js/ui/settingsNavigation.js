const groups={device:new Set(['settingsRobotBody','deviceManagement','settingsMovement']),companion:new Set(['settingsPersonality','settingsIdleScenarios','settingsScenarios','settingsFaceDemo']),ai:new Set(['settingsCamera','settingsLocalBrain']),diagnostics:new Set(['settingsStatus','settingsLifeEngine','settingsLog'])};
export function installSettingsNavigation(){
 const panel=document.getElementById('settingsPanel'),nav=panel.querySelector('.settings-nav');
 nav.className='df26-settings-tabs';nav.replaceChildren();nav.setAttribute('aria-label','Control center sections');
 panel.querySelector('.settings-drawer-header h2').textContent='Control center';panel.querySelector('.settings-drawer-header .eyebrow').textContent='LOOI / DF26';
 panel.querySelector('.title-card').hidden=true;
 const select=group=>{
  if(!groups[group])group='device';localStorage.setItem('looi.settings.section',group);
  for(const[id,ids]of Object.entries(groups))for(const sectionId of ids){const section=document.getElementById(sectionId);if(section)section.hidden=id!==group;}
  for(const button of nav.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.group===group));
 };
 for(const[group,label]of Object.entries({device:'Devices',companion:'Companion',ai:'AI & vision',diagnostics:'Diagnostics'})){
  const button=document.createElement('button');button.type='button';button.dataset.group=group;button.textContent=label;button.onclick=()=>select(group);nav.append(button);
 }
 panel.querySelector('.settings-drawer-header').after(nav);
 document.addEventListener('looi-open-device-panel',()=>select('device'));
 select(localStorage.getItem('looi.settings.section')||'device');
}
