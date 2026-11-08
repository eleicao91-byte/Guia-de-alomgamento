import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../',import.meta.url));
const port = Number(process.env.PORT || 8787);
const types = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json',
  '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.pdf':'application/pdf',
};
http.createServer(async (req,res)=>{
  try {
    const url = new URL(req.url,'http://localhost');
    let file = path.resolve(root,'.'+decodeURIComponent(url.pathname));
    const relative = path.relative(root,file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return res.writeHead(403).end();
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) return res.writeHead(302,{Location:url.pathname+'/'+url.search}).end();
      file = path.join(file,'index.html');
    }
    const content = await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(req.method==='HEAD'?undefined:content);
  } catch {
    res.writeHead(404).end('Arquivo não encontrado.');
  }
}).listen(port,'127.0.0.1',()=>console.log('http://127.0.0.1:'+port+'/'));

