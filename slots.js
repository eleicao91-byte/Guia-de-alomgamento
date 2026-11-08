(() => {
  const assetRoot = new URL('assets/images/', document.currentScript.src);
  const manifestURL = new URL('manifest.json', assetRoot);
  const svgNS = 'http://www.w3.org/2000/svg';
  const path = (file) => new URL(file, assetRoot).href;

  function placeholder(item) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox','0 0 160 100');
    if (item.alt) {
      svg.setAttribute('role','img');
      svg.setAttribute('aria-label',item.alt);
    } else {
      svg.setAttribute('aria-hidden','true');
    }
    svg.innerHTML = '<rect width="160" height="100" rx="12" fill="var(--mint)"/><circle cx="108" cy="32" r="9" fill="var(--coral)"/><path d="M24 77 61 42l21 20 11-10 42 25Z" fill="var(--teal)"/>';
    return svg;
  }

  function render(slot, item) {
    slot.classList.add('img-slot');
    slot.style.setProperty('--slot-desktop',item.desktop.join(' / '));
    slot.style.setProperty('--slot-mobile',item.mobile.join(' / '));
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.alt = slot.dataset.decorative !== undefined ? '' : item.alt;
    img.width = item.desktop[0];
    img.height = item.desktop[1];
    img.loading = slot.dataset.eager !== undefined ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (item.variants?.length && !item.fallback) {
      img.srcset = [...item.variants.map(variant => `${path(variant.file)} ${variant.width}w`), `${path(item.file)} ${item.desktop[0]}w`].join(', ');
      img.sizes = item.id === 'hero' ? '(max-width: 552px) calc(100vw - 32px), 520px'
        : slot.closest('.download-grid') ? '(max-width: 639px) min(300px, calc(100vw - 64px)), 350px'
        : item.id.startsWith('bonus-') ? '(max-width: 767px) 104px, 144px' : '230px';
    }
    if (slot.dataset.eager !== undefined) img.fetchPriority = 'high';
    function addSource(file,media) {
      const source = document.createElement('source');
      source.srcset = path(file);
      source.type = 'image/webp';
      if (media) source.media = media;
      picture.append(source);
    }
    if (item.mobileFile && slot.dataset.desktopSource === undefined) addSource(item.mobileFile,'(max-width: 767px)');
    if (item.format === 'WebP' && item.fallback) addSource(item.file);
    img.addEventListener('error', () => {
      img.removeAttribute('srcset');
      picture.querySelectorAll('source').forEach((source)=>source.remove());
      if (item.fallback && img.src !== path(item.fallback)) {
        img.src = path(item.fallback);
      } else {
        slot.replaceChildren(placeholder({...item,alt:img.alt}));
      }
    });
    img.src = path(item.fallback || item.file);
    picture.append(img);
    slot.replaceChildren(picture);
  }

  function renderGallery(items) {
    const gallery = document.querySelector('#slot-gallery');
    if (!gallery) return;
    for (const item of items) {
      const card = document.createElement('article');
      card.className = 'card slot-demo';
      const slot = document.createElement('div');
      slot.dataset.img = item.id;
      const title = document.createElement('h2');
      title.textContent = item.id;
      const info = document.createElement('p');
      info.textContent = item.section+' · Desktop '+item.desktop.join(' × ')+' · Mobile '+item.mobile.join(' × ');
      const code = document.createElement('code');
      code.textContent = 'assets/images/'+item.file+(item.mobileFile?' | assets/images/'+item.mobileFile:'');
      card.append(slot,title,info,code);
      gallery.append(card);
    }
  }
  fetch(manifestURL).then((response)=>{
    if (!response.ok) throw new Error('Manifesto indisponível');
    return response.json();
  }).then((items)=>{
    renderGallery(items);
    const byId = new Map(items.map(item=>[item.id,item]));
    document.querySelectorAll('[data-img]').forEach(slot=>{
      const item = byId.get(slot.dataset.img);
      if (item) render(slot,item);
    });
  }).catch(()=>{
    const gallery = document.querySelector('#slot-gallery');
    if (gallery) gallery.textContent = 'Abra esta página por um servidor HTTP local para carregar o manifesto.';
  });
})();


