const root = new URL('../', document.currentScript.src);
let unavailable = false;
for (const link of document.querySelectorAll('[data-bonus-url]')) {
  const value = window.SITE_CONFIG['BONUS_'+link.dataset.bonusUrl+'_URL'];
  try {
    if (!value?.trim()) throw new Error();
    const url = new URL(value,root);
    if (url.origin !== root.origin && url.protocol !== 'https:') throw new Error();
    link.href = url.href;
    if (url.origin === root.origin) link.download = '';
    link.removeAttribute('aria-disabled');
  } catch {
    unavailable = true;
  }
}
if (unavailable) document.querySelector('#download-status').textContent = 'Se um arquivo estiver indisponível, consulte a confirmação de compra.';
