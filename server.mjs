import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.PORT||8788);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};

function safePath(raw){
  const pathname=decodeURIComponent((raw||'/').split('?')[0]);
  const requested=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  const normalized=normalize(requested).replace(/^(\.\.[/\\])+/, '');
  return join(root,normalized);
}

const server=http.createServer(async(req,res)=>{
  try{
    let path=safePath(req.url);
    const info=await stat(path);
    if(info.isDirectory()) path=join(path,'index.html');
    const data=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(data);
  }catch{
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
});

server.listen(port,'127.0.0.1',()=>console.log(`Omnidite OS V0.1: http://localhost:${port}`));
