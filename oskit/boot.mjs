import {createOS} from './core.mjs';
import {omniditeProfile} from './profiles/omnidite.mjs';
import {mountOS} from './ui.mjs';
try {
  const os=createOS(omniditeProfile,window.localStorage);
  mountOS(os);
} catch(error) {
  const notice=document.createElement('div');
  notice.setAttribute('role','alert');
  notice.className='oskit-failure';
  notice.textContent='OS Core could not start. Existing Omnidite portfolio is still available. '+error.message;
  document.querySelector('.shell main')?.prepend(notice);
  console.error('OS Core initialization failed:',error);
}
