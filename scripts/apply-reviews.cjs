const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const reviews = [["Rosângela","Fiz alongamento durante 1 semana e já melhorou muito a dor nas minhas costas, mto obgda!","14116075-c95f-4c29-ad6b-b57ae8f0c906"],["Fabi Santos","Eu sempre ficava com dores depois do trabalho, agora que comecei a fazer esses alongamentos minhas dores sumiram.","b72e307f-29cb-4832-b566-69546dba5427"],["Ítalo M.","Chegava do trampo todo dolorido mas após os alongamentos tô bem mais leve, show!","107a0177-3e2c-40de-9891-9e07ba595dd4"],["Maria Pereira","Eu morria de dor nas pernas toda vez que ficava mto tempo sentada, agora me livrei dessa dor depois de começar a fazer os alongamentos.","6eb1990f-8aca-4202-9996-0a978d6dc001"],["Alexandre Souza","Comprei pro meu pai que sentia muita dor nas costas e tá ajudando bastante, top.","6ef07aa9-f6dc-4394-b7d5-5a175da28344"],["Ruthiely","Sou mãe e fico o tempo todo com as crianças, esses alongamentos tão me ajudando bastante e também pq consigo fazer em poucos minutos no dia, grata!","66fa5b26-4f72-4f84-8754-98dc167e1340"]];
const root = path.resolve(__dirname, '..');
(async () => {
  const dir = path.join(root, 'assets/images/depoimentos');
  fs.mkdirSync(dir, {recursive: true});
  for (let i = 0; i < reviews.length; i++) {
    await sharp(`C:/Users/bruno/AppData/Local/Temp/codex-clipboard-${reviews[i][2]}.png`).resize(240, 320, {fit:'inside'}).webp({quality:85}).toFile(path.join(dir, `cliente-${i+1}.webp`));
  }
  const file = path.join(root, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const cards = reviews.map(([name, text], i) => `<article class="card review-customer"><div class="review-person"><img class="review-avatar" src="assets/images/depoimentos/cliente-${i+1}.webp" alt="${name}" width="48" height="48" loading="lazy"><h3>${name}</h3></div><p>${text}</p></article>`).join('');
  html = html.replace(/(<div class="list-grid" id="reviews">)[\s\S]*?(<\/div><\/div><\/section>)/, '$1' + cards + '$2');
  fs.writeFileSync(file, html);
  if ((html.match(/class="card review-customer"/g) || []).length !== 6) throw new Error('Expected 6 reviews');
  console.log('6 depoimentos e fotos aplicados.');
})();
