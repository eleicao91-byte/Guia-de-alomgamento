import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { bonuses } from './bonus-data.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = new URL('../assets/images/',import.meta.url);
await mkdir(root,{recursive:true});
const script = await readFile(new URL('../script.js',import.meta.url),'utf8');
const css = await readFile(new URL('../styles.css',import.meta.url),'utf8');
const palette = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8})(?=;|\s)/gi)].map(([,key,color])=>[key,color]));
const routinesCode = script.slice(script.indexOf('const routines ='),script.indexOf('function tile('));
const { routines, scene, icon } = new Function(routinesCode+'\nreturn {routines,scene,icon};')();
const existingManifest = JSON.parse(await readFile(new URL('manifest.json',root),'utf8').catch(()=>'[]'));
const slots = [];
const refresh = process.argv.includes('--refresh-defaults');
function slot(id, section, desktop, alt, artPrompt, { mobile=desktop, file=id+'.webp', mobileFile, fallback, art }={}) {
  const current = existingManifest.find(item=>item.id===id && (item.file.includes('-foto.') || item.file.includes('-livro')));
  if (current) { slots.push(current); return; }
  slots.push({id,section,desktop,mobile,file,mobileFile,format:file.endsWith('.svg')?'SVG':'WebP',fallback,alt,prompt:'Ilustração plana em traço arredondado, azul claro, azul-marinho, creme e amarelo dourado, sem marcas ou fotos. '+artPrompt,art});
}
slot('hero','Topo',[1600,900],'Mockup do guia digital e cenas de alongamento sentado e em pé.','Mostre o guia em PDF, celular e pessoas fazendo pausas no trabalho. No recorte móvel, concentre os elementos no centro.',{mobile:[1080,1350],mobileFile:'hero-mobile.webp',fallback:'../banner-guia.png'});
routines.forEach(([title,,alt],i)=>slot('rotina-'+(i+1),'Carrossel',[800,600],alt,'Represente esta rotina em cena simples: '+title+'.',{art:scene(routines[i],i)}));
const categoryIcons = [['chair','Cadeira de escritório'],['shoe','Tênis'],['back','Lombar estilizada'],['neck','Pescoço e ombros'],['clock','Relógio'],['moon','Lua'],['bus','Ônibus']];
const deliveryIcons = [['phone','Celular'],['laptop','Notebook'],['printer','Impressora'],['bolt','Raio de envio imediato']];
const iconArt = (key) => icon(key).replace('<svg class="icon"','<svg fill="none" stroke="'+palette.teal+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"');
categoryIcons.forEach(([key,alt],i)=>slot('categoria-'+(i+1),'Categorias',[256,256],alt,'Ícone simples de '+alt.toLowerCase()+' sobre fundo azul claro.',{art:iconArt(key)}));
slot('plano','Acesso completo',[1000,700],'Guia digital de alongamento com materiais para o dia a dia.','Mockup ilustrado do guia, calendário, checklist e cartaz, sem preço.',{fallback:'../banner-guia.png'});
slot('garantia','Garantia',[512,512],'Escudo com marca de confirmação.','Escudo azul-marinho com marca branca em fundo azul claro.',{art:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="var(--mint)"/><path d="M50 20 75 31v19c0 13-11 26-25 32-14-6-25-19-25-32V31Z" fill="var(--teal)"/><path d="m38 51 8 8 16-17" fill="none" stroke="white" stroke-width="5"/></svg>'});
deliveryIcons.forEach(([key,alt],i)=>slot('recebimento-'+(i+1),'Recebimento',[256,256],alt,'Ícone central de '+alt.toLowerCase()+' sobre fundo areia.',{art:iconArt(key)}));
slot('popup','Oferta de saída',[800,600],'Relógio representando uma pausa de cinco minutos.','Relógio simples com indicação de cinco minutos em fundo azul claro.',{art:iconArt('clock')});
bonuses.forEach((item,i)=>slot('bonus-'+(i+1),'Bônus e página de obrigado',[1200,630],item.title+'. '+item.desc,'Banner com o título do bônus, ilustração do material e a frase “Incluso no seu acesso”. '+item.desc,{file:'bonus/'+item.asset+'-1200x630.webp',fallback:'bonus/'+item.asset+'-1200x630.png'}));
slot('open-graph','Compartilhamento',[1200,630],'Guia digital de alongamento para quem trabalha em pé ou sentado.','Composição horizontal com capa do guia e cenas de pausa, com texto central legível.');
slot('favicon','Aba do navegador',[64,64],'Ícone de folha.','Folha simples sobre fundo azul-marinho, legível em tamanho pequeno.',{file:'favicon.svg'});
slot('logo','Cabeçalho',[320,96],'Marca do guia de alongamento.','Wordmark compacto da marca do guia, com fundo transparente.',{mobile:[256,80],file:'logo.svg'});

const leaf = '<path d="M14 43c1-17 12-26 32-25-1 19-13 29-30 27m0 4 21-21" fill="none" stroke="#dceaff" stroke-width="4" stroke-linecap="round"/>';
const svgFile = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17447c"/>'+leaf+'</svg>';
const logo = svgFile;
async function missing(url) { try { await access(url); return false; } catch { return true; } }
for (const item of slots) {
  const target = new URL(item.file,root);
  if ((refresh && !item.file.includes('-foto.') && !item.file.includes('-livro') && !item.file.startsWith('bonus/') && item.id !== 'open-graph') || await missing(target)) {
    if (item.format === 'SVG') {
      await writeFile(target,item.id==='logo'?logo:svgFile);
    } else if (item.art) {
      const [w,h] = item.desktop;
      const art = item.art.replace(/var\(--([\w-]+)\)/g,(_,key)=>palette[key]||'#17447c')
        .replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"')
        .replace('viewBox=',`width="${w}" height="${h}" viewBox=`);
      await sharp(Buffer.from(art)).webp({quality:90}).toFile(fileURLToPath(target));
    } else {
      await sharp(fileURLToPath(new URL('../banner-guia.png',root))).resize(...item.desktop,{fit:'contain',background:palette.cream}).webp({quality:88}).toFile(fileURLToPath(target));
    }
  }
  if (item.mobileFile) {
    const mobile = new URL(item.mobileFile,root);
    if (refresh || await missing(mobile)) await sharp(fileURLToPath(new URL('../banner-guia.png',root))).resize(...item.mobile,{fit:'contain',background:palette.cream}).webp({quality:88}).toFile(fileURLToPath(mobile));
  }
}
await writeFile(new URL('manifest.json',root),JSON.stringify(slots.map(({art,...item})=>item),null,2)+'\n');
const prompts = slots.map((item)=>`## ${item.id}\n\n- Arquivo: \`assets/images/${item.file}\`${item.mobileFile?' e \`assets/images/'+item.mobileFile+'\`':''}\n- Desktop: ${item.desktop.join(' × ')}. Mobile: ${item.mobile.join(' × ')}.\n- Alt: ${item.alt}\n\n${item.prompt}`).join('\n\n');
await writeFile(new URL('../prompts-imagens.md',root),'# Prompts dos slots de imagem\n\n'+prompts+'\n');



