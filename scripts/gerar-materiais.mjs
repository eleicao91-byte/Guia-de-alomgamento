import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { bonuses, routines, escape } from './bonus-data.mjs';

const disclaimer = 'Material educativo e de bem-estar. Não substitui avaliação, diagnóstico ou tratamento por profissional de saúde. Pare se sentir dor e procure orientação.';
function sheet(number, title, sub, body, style = '') {
  return `<article class="sheet ${style}"><header><p class="kicker">BÔNUS ${number} · GUIA DE ALONGAMENTO</p><h1>${title}</h1><p>${sub}</p></header>${body}<footer>${disclaimer}</footer></article>`;
}
function document(title, content) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><link rel="stylesheet" href="../print.css"></head><body><main>${content}</main></body></html>`;
}
const weeks = [
  ['Escolha um momento que caiba no seu dia.',[0,1,5,3,2,6,null]],
  ['Experimente variar o momento da pausa.',[4,0,3,1,5,7,null]],
  ['Deixe o calendário em um lugar visível.',[6,2,5,4,0,1,null]],
  ['Escolha as pausas que combinam com sua rotina.',[3,7,1,2,4,5,null]],
  ['Use suas anotações para planejar a próxima semana.',[6,0]],
];
let day = 0;
const calendar = weeks.map(([message, slots], week) => `<section class="week"><h2>Semana ${week+1} <span>· ${message}</span></h2><ol class="days" style="list-style:none;margin:0;padding:0">${slots.map((i) => {
  const [name, duration] = i === null ? ['Dia livre', null] : routines[i];
  return `<li class="day"><b>Dia ${++day}<span class="box" aria-label="Espaço para marcar"></span></b>${name}<small>${duration === null ? 'Sem pausa prevista' : duration+' min'}</small></li>`;
}).join('')}</ol><p class="note">Como me senti?</p></section>`).join('');

const common = ['Os objetos de uso frequente estão ao alcance.', 'A iluminação permite ver a tarefa com conforto e sem reflexos incômodos.', 'As pausas estão combinadas com a rotina de trabalho.', 'Consigo variar a posição ou alternar tarefas quando possível.'];
const seated = ['A cadeira oferece apoio confortável para as costas.', 'Os pés ficam apoiados no chão ou em um apoio estável.', 'Se uso monitor, ele fica à frente, com a parte superior na altura dos olhos ou um pouco abaixo.', 'Teclado e mouse ficam próximos e os cotovelos permanecem confortáveis.', 'Há espaço livre para movimentar as pernas.'];
const standing = ['Uso calçado confortável e adequado à atividade.', 'O piso da área de trabalho está firme, seco e livre de obstáculos.', 'A altura da superfície permite trabalhar com os ombros relaxados.', 'Consigo alcançar os materiais sem precisar me inclinar repetidamente.', 'Há um lugar adequado para sentar durante as pausas, quando possível.'];
const checklist = [['sentado',seated],['em pé',standing]].map(([mode,items]) => sheet(2, 'Checklist de ergonomia', 'Para quem trabalha ' + mode, `<p>Confira o posto de trabalho e marque os itens que se aplicam à sua rotina.</p><p class="notice">Este checklist é um guia geral. Para ajustes personalizados, procure um profissional.</p><ul>${[...items,...common].map((item)=>`<li class="check-item"><span class="box" aria-hidden="true"></span>${item}</li>`).join('')}</ul><h2>O que quero revisar?</h2><div class="note"></div><div class="note"></div>`)).join('');

const office = [
  ['Pausa na cadeira',2,'M35 40h21v-16m0 16v16m-19-16v16 M40 37l-11 5-3 13','M40 25 26 22 19 13'],
  ['Ombros em movimento',2,'M38 37l-11 7v10m12-17 12 7v10','M39 23 22 23 17 35m22-12 17 0 5 12'],
  ['Mãos e punhos',2,'M38 37l-11 7v10m12-17 12 7v10','M38 24 25 30 13 27m25-3 11 8 12-3'],
  ['Pausa para levantar',3,'M40 37 34 47 29 57m11-20 7 11 4 9','M38 24 27 32 23 40m16-16 11 8 4 8'],
  ['Caminhada curta',3,'M40 37 30 46 24 55m16-18 10 8 7 10','M39 24 30 31 23 32m16-8 10 5 6-2'],
];
const onFeet = [
  ['Braços para cima',2,office[3][2],'M39 24 27 15 24 5m15 19 11-9 3-10'],
  ['Caminhada curta',3,office[4][2],office[4][3]],
  ['Pausa para pernas e pés',3,'M40 37 33 46 25 56m15-19 10 9 4 7','M39 24 28 33 25 39m14-15 12 7 9 0'],
  ['Pausa para mãos e punhos',2,office[3][2],office[2][3]],
  ['Pausa sentada',3,office[0][2],'M39 24 26 32 22 39m17-15 11 10 5 6'],
];
function pictogram(legs, arms) {
  return `<svg viewBox="0 0 76 62" aria-hidden="true"><circle cx="39" cy="13" r="6" fill="currentColor"/><path d="M39 22v15" stroke="var(--coral)" stroke-width="7" stroke-linecap="round"/><path d="${legs} ${arms}" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
const posters = [['Escritório',office],['Para quem trabalha em pé',onFeet]].flatMap(([mode,items]) => ['Colorido','Preto e branco'].map((variant) => sheet(3, 'Pausas ativas', mode+' · '+variant, `<ul class="poster-list">${items.map(([name,min,legs,arms])=>`<li>${pictogram(legs,arms)}<h3>${escape(name)}</h3><strong>${min} min</strong></li>`).join('')}</ul><p class="notice">Escolha uma pausa que caiba no momento e faça os movimentos sem pressa.</p><div class="poster-bottom"><div class="reserve">Área da logo</div><div class="reserve">Área do QR code</div></div>`,variant==='Colorido'?'':'mono'))).join('');

const contents = [sheet(1,'Calendário de 30 dias de pausas','Marque as pausas que fizer e use as linhas para suas anotações.',calendar), checklist, posters];
for (const [index, item] of bonuses.entries()) {
  const dir = new URL('../bonus/'+item.id+'/',import.meta.url);
  await mkdir(dir,{recursive:true});
  await writeFile(fileURLToPath(new URL('index.html',dir)),document(item.title,contents[index]));
}
