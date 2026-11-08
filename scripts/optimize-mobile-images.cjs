const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
(async () => {
  const manifestPath = path.join(root, 'assets/images/manifest.json');
  const entries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let count = 0;
  for (const entry of entries.filter(x => x.file.endsWith('.webp') && /^(hero|rotina-|outras-rotinas|bonus-)/.test(x.id))) {
    const source = path.join(root, 'assets/images', entry.file);
    const meta = await sharp(source).metadata();
    const widths = entry.id.startsWith('bonus-') ? [320] : entry.id === 'hero' ? [640, 1040] : [320, 640];
    entry.variants = [];
    for (const width of widths.filter(w => w < meta.width)) {
      const file = entry.file.replace(/\.webp$/, `-${width}w.webp`);
      await sharp(source).resize({width}).webp({quality:88}).toFile(path.join(root, 'assets/images', file));
      entry.variants.push({file, width});
      count++;
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2) + '\n');
  const htmlPath = path.join(root, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  for (let i=1;i<=3;i++) {
    const file = `assets/images/depoimentos/conversa-${i}.webp`;
    await sharp(path.join(root,file)).resize({width:640}).webp({quality:92}).toFile(path.join(root,file.replace('.webp','-640w.webp')));
    html = html.replace(`src="${file}" width=`, `src="${file}" srcset="${file.replace('.webp','-640w.webp')} 640w, ${file} 1024w" sizes="(max-width: 767px) calc(100vw - 76px), 300px" width=`);
  }
  html = html.replace('src="assets/images/hero-expert-foto.webp" width=', 'src="assets/images/hero-expert-foto.webp" srcset="assets/images/hero-expert-foto-640w.webp 640w, assets/images/hero-expert-foto-1040w.webp 1040w, assets/images/hero-expert-foto.webp 1448w" sizes="(max-width: 552px) calc(100vw - 32px), 520px" fetchpriority="high" decoding="async" width=');
  fs.writeFileSync(htmlPath, html);
  console.log(`${count + 3} imagens responsivas criadas.`);
})();
