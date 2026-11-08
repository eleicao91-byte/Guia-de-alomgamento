export const bonuses = [
  { id:'calendario-30-dias', asset:'bonus-1-calendario', title:'Calendário de 30 dias de pausas', lines:['Calendário de','30 dias de pausas'], desc:'Uma pausa sugerida por dia, com espaço para anotar.' },
  { id:'checklist-ergonomia', asset:'bonus-2-checklist', title:'Checklist de ergonomia do posto de trabalho', lines:['Checklist de ergonomia','do posto de trabalho'], desc:'Listas para revisar o posto sentado ou em pé.' },
  { id:'cartaz-pausas', asset:'bonus-3-cartaz', title:'Cartaz imprimível de pausas ativas', lines:['Cartaz imprimível','de pausas ativas'], desc:'Cinco pausas ilustradas em cada versão para imprimir.' },
];
export const routines = [
 ['Pausa de 2 minutos na cadeira',2], ['Rotina para quem trabalha em pé',4], ['Soltar a lombar e o quadril',5], ['Pescoço e ombros do escritório',3], ['Pernas e pés depois de um dia em pé',6], ['Mãos e punhos do teclado',2], ['Alongamento ao acordar',5], ['Rotina antes de dormir',4],
];
export const escape = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
