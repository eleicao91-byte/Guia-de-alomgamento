import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { bonuses, escape } from './bonus-data.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const out = new URL('../assets/images/bonus/',import.meta.url);
await mkdir(out,{recursive:true});
const css = await readFile(new URL('../styles.css',import.meta.url),'utf8');
const palette = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8})(?=;|\s)/gi)].map(([,name,color])=>[name,color]));
const { cream, mint, teal, coral, aqua, peach, white, ink } = palette;
const formats = [[1200,630],[1080,1080],[1080,1920],[1000,1400]];

function illustration(index) {
  const paper = '<rect x="83" y="30" width="254" height="312" rx="22" fill="'+teal+'" opacity=".12"/><rect x="72" y="18" width="254" height="312" rx="22" fill="'+white+'"/>';
  if (index === 0) {
    const grid = Array.from({length:30},(_,i)=>`<rect x="${101+i%6*34}" y="${121+Math.floor(i/6)*33}" width="25" height="24" rx="6" fill="${i%8===0?coral:mint}"/>`).join('');
    return paper+`<rect x="94" y="51" width="210" height="48" rx="13" fill="${aqua}"/><path d="M128 34v28m140-28v28" stroke="${teal}" stroke-width="9" stroke-linecap="round"/>${grid}<path d="m108 132 5 5 8-10m56 39 5 5 8-10m123 134 12 13 25-30" fill="none" stroke="${teal}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (index === 1) {
    return paper+`<rect x="135" y="5" width="122" height="45" rx="14" fill="${teal}"/>${[87,140,193,246].map(y=>`<rect x="103" y="${y}" width="35" height="34" rx="9" fill="${mint}"/><path d="m112 ${y+16} 6 6 12-14" fill="none" stroke="${teal}" stroke-width="4" stroke-linecap="round"/><rect x="154" y="${y+10}" width="134" height="11" rx="6" fill="${aqua}"/>`).join('')}<path d="m313 303 53-111 16 8-53 112-18 14z" fill="${coral}"/>`;
  }
  return paper+`<rect x="95" y="42" width="208" height="30" rx="8" fill="${aqua}"/>${[100,138,176,214,252].map((y,i)=>`<rect x="95" y="${y}" width="208" height="29" rx="7" fill="${mint}"/><circle cx="118" cy="${y+7}" r="4" fill="${teal}"/><path d="M118 ${y+13}v6m0-6 ${i%2?8:-8}-5m-4 18 4-7 5 7" fill="none" stroke="${teal}" stroke-width="2" stroke-linecap="round"/><rect x="145" y="${y+11}" width="${103+i*7}" height="6" rx="3" fill="${teal}" opacity=".42"/>`).join('')}<rect x="274" y="290" width="24" height="24" rx="4" fill="${peach}"/>`;
}
function banner(item,index,width,height) {
  const wide=width>height, story=height/width>1.6;
  const x=wide?66:width/2, anchor=wide?'start':'middle';
  const top=wide?163:story?330:height===1080?135:190;
  const titleSize=wide?47:66;
  const description=width===1200 ? [item.desc] : item.desc.split(/ (?=com espaço|ou em pé|para imprimir)/);
  const pillW=wide?225:315;
  const art=wide?{x:690,y:126,s:1.18}:{x:width/2-305,y:story?835:height===1080?490:620,s:1.5};
  const inclusionY=wide?482:height-(story?335:62);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>${escape(item.title)}</title><desc>${escape(item.desc)} Incluso no seu acesso.</desc>
  <rect width="100%" height="100%" fill="${cream}"/><path d="M0 ${height*.8} Q ${width*.37} ${height*.57} ${width*.63} ${height*.73} T ${width} ${height*.53} V${height}H0Z" fill="${mint}"/><circle cx="${wide?920:width/2}" cy="${wide?328:art.y+245}" r="${wide?240:290}" fill="${aqua}" opacity=".7"/>
  <g font-family="Poppins, Arial, sans-serif" text-anchor="${anchor}"><rect x="${wide?x:x-105}" y="${top-65}" width="${wide?130:210}" height="${wide?41:52}" rx="24" fill="${teal}"/><text x="${wide?x+65:x}" y="${top-(wide?38:29)}" text-anchor="middle" fill="${white}" font-size="${wide?19:26}" font-weight="700">BÔNUS ${index+1}</text>
  <text x="${x}" y="${top+57}" fill="${teal}" font-size="${titleSize}" font-weight="900">${item.lines.map((line,i)=>`<tspan x="${x}" dy="${i?titleSize*1.13:0}">${escape(line)}</tspan>`).join('')}</text>
  <text x="${x}" y="${top+(wide?169:218)}" fill="${ink}" font-size="${wide?21:27}">${description.map((line,i)=>`<tspan x="${x}" dy="${i?35:0}">${escape(line)}</tspan>`).join('')}</text></g>
  <g transform="translate(${art.x} ${art.y}) scale(${art.s})">${illustration(index)}</g>
  <rect x="${wide?x:x-pillW/2}" y="${inclusionY-33}" width="${pillW}" height="${wide?48:59}" rx="28" fill="${coral}"/><text x="${wide?x+pillW/2:x}" y="${inclusionY+(wide?0:6)}" font-family="Poppins, Arial, sans-serif" text-anchor="middle" fill="${ink}" font-size="${wide?18:25}" font-weight="700">Incluso no seu acesso</text></svg>`;
}
for (const [index,item] of bonuses.entries()) {
  for (const [width,height] of formats) {
    const name = item.asset+'-'+width+'x'+height;
    const svg = banner(item,index,width,height);
    await writeFile(new URL(name+'.svg',out),svg);
    const image = sharp(Buffer.from(svg));
    await Promise.all([
      image.clone().png().toFile(fileURLToPath(new URL(name+'.png',out))),
      image.clone().webp({quality:88}).toFile(fileURLToPath(new URL(name+'.webp',out))),
    ]);
  }
}
const root = new URL('../assets/images/',import.meta.url);
await sharp(fileURLToPath(new URL('../assets/banner-guia.png',import.meta.url))).resize(1200,630,{fit:'contain',background:cream}).webp({quality:88}).toFile(fileURLToPath(new URL('open-graph.webp',root)));

