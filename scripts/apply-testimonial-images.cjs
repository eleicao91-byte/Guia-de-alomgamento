const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const sources = ['file_00000000a694820ea10034bfee45ab68.png', 'file_00000000514c820eb3a5b5ecf5578def.png', 'file_000000005788820e97f299947e6dea74.png'];
const names = ['Patrícia Mendes', 'Renata Carvalho', 'Mariana Alves'];
(async () => {
  const cards = [];
  for (let i = 0; i < sources.length; i++) {
    const file = `assets/images/depoimentos/conversa-${i+1}.webp`;
    await sharp(path.join('C:/Users/bruno/Downloads', sources[i])).webp({quality:92}).toFile(path.join(root, file));
    const {width, height} = await sharp(path.join(root, file)).metadata();
    cards.push(`<article class="card testimonial-image"><img src="${file}" width="${width}" height="${height}" alt="Depoimento enviado de ${names[i]} sobre os alongamentos" loading="lazy" draggable="false"></article>`);
  }
  const file = path.join(root, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<!-- Preencha DEPOIMENTOS em config.js com relatos reais\. -->/, '');
  html = html.replace(/(<section id="depoimentos">[\s\S]*?<div class="rail"[^>]*>)[\s\S]*?(<\/div><\/div><\/section>)/, '$1' + cards.join('') + '$2');
  if ((html.match(/class="card testimonial-image"/g) || []).length !== 3) throw new Error('Expected three testimonial images');
  fs.writeFileSync(file, html);
  console.log('Três imagens inseridas sem corte.');
})();
