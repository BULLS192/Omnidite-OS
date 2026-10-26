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


// Progressive Web App: installed shortcuts, mobile Home Screen and offline shell.
// The service worker caches application assets, never user records or API data.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/service-worker.js').catch(error =>
      console.warn('Omnidite OS offline shell unavailable:', error)
    )
  );
}
