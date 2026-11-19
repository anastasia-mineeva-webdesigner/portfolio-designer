// Run against a built site and a local Chromium instance with remote debugging.
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

const [resumeUrl = 'http://127.0.0.1:4173/cv/', debuggerUrl = 'http://127.0.0.1:9222'] = process.argv.slice(2);
const targetResponse = await fetch(new URL('/json/new?about:blank', debuggerUrl), {method:'PUT'});
if (!targetResponse.ok) throw new Error('Unable to open a local Chromium tab.');
const target = await targetResponse.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
 socket.addEventListener('open', resolve, {once:true});
 socket.addEventListener('error', reject, {once:true});
});

let id = 0;
const pending = new Map();
socket.addEventListener('message', ({data}) => {
 const reply = JSON.parse(data);
 pending.get(reply.id)?.(reply);
 pending.delete(reply.id);
});
async function call(method, params = {}){
 const key = ++id;
 const reply = new Promise(resolve => pending.set(key, resolve));
 socket.send(JSON.stringify({id:key, method, params}));
 const {result, error} = await reply;
 if (error) throw new Error(error.message);
 return result;
}

try {
 await call('Page.enable');
 await call('Emulation.setDeviceMetricsOverride', {width:1280,height:900,deviceScaleFactor:1,mobile:false});
 await call('Emulation.setEmulatedMedia', {media:'print'});
 const navigation = await call('Page.navigate', {url:resumeUrl});
 if (navigation.errorText) throw new Error(navigation.errorText);

 let ready = false;
 for (let attempt = 0; attempt < 100 && !ready; attempt++){
  const {result} = await call('Runtime.evaluate', {
   expression: "document.fonts.ready.then(()=>Boolean(document.querySelector('.cv-page #cv-tools')))",
   awaitPromise:true,
   returnByValue:true,
  });
  ready = result.value === true;
  if (!ready) await delay(100);
 }
 if (!ready) throw new Error('The Resume page did not finish rendering.');

 const {data} = await call('Page.printToPDF', {
  displayHeaderFooter:false,
  preferCSSPageSize:true,
  generateTaggedPDF:true,
 });
 const pdf = Buffer.from(data, 'base64');
 for (const folder of ['public','dist']){
  const directory = new URL(`../${folder}/downloads/`, import.meta.url);
  await mkdir(directory, {recursive:true});
  const path = new URL('mira-smirnova-cv.pdf', directory);
  await writeFile(path, pdf);
  console.log(fileURLToPath(path));
 }
} finally {
 socket.close();
 await fetch(new URL('/json/close/' + target.id, debuggerUrl));
}
