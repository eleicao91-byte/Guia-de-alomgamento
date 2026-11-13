(() => {
  'use strict';

  const config = window.SITE_CONFIG || {};
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  const formatPrice = (value, fallback) =>
    Number.isFinite(value) && value > 0 ? money.format(value) : fallback;

  const originalPrices = {
    basico: config.PRECO_BASICO,
    completo: config.PRECO_COMPLETO,
  };
  const offerPrices = {
    basico: config.PRECO_BACKREDIRECT_BASICO,
    completo: config.PRECO_BACKREDIRECT_COMPLETO,
  };

  document.querySelectorAll('[data-original-price]').forEach((node) => {
    const plan = node.dataset.originalPrice;
    const price = formatPrice(originalPrices[plan], node.textContent.trim());
    node.textContent = price;
  });

  document.querySelectorAll('[data-back-price]').forEach((node) => {
    const plan = node.dataset.backPrice;
    node.textContent = formatPrice(offerPrices[plan], node.textContent.trim());
  });

  document.querySelectorAll('[data-full-price]').forEach((node) => {
    const plan = node.dataset.fullPrice;
    node.textContent = formatPrice(originalPrices[plan], node.textContent.trim());
  });

  function getAttribution() {
    const attribution = new URLSearchParams();
    try {
      const saved = new URLSearchParams(sessionStorage.getItem('guia-utm') || '');
      saved.forEach((value, key) => {
        if (utmKeys.includes(key)) attribution.set(key, value);
      });
    } catch { /* sessionStorage may be unavailable */ }

    const incoming = new URLSearchParams(window.location.search);
    utmKeys.forEach((key) => {
      if (incoming.has(key)) attribution.set(key, incoming.get(key));
    });
    return attribution;
  }

  function safeCheckoutUrl(rawUrl) {
    if (typeof rawUrl !== 'string' || !rawUrl.trim()) return null;
    try {
      const url = new URL(rawUrl);
      if (url.protocol !== 'https:' || url.username || url.password) return null;
      getAttribution().forEach((value, key) => url.searchParams.set(key, value));
      return url.href;
    } catch {
      return null;
    }
  }

  function trackCheckout(plan) {
    if (typeof window.fbq !== 'function') return;
    const isOriginalComplete = plan === 'completo-original';
    const amount = isOriginalComplete ? originalPrices.completo : offerPrices[plan];
    window.fbq('track', 'InitiateCheckout', {
      content_name: plan === 'basico'
        ? 'Guia de alongamento - Backredirect'
        : isOriginalComplete
          ? 'Treino de alongamento Premium - Preço normal'
          : 'Treino de alongamento Premium - Backredirect',
      content_category: 'Guia de Alongamento',
      currency: 'BRL',
      value: amount,
    });
  }

  const checkoutUrls = {
    basico: safeCheckoutUrl(config.CHECKOUT_URL_BACKREDIRECT_BASICO),
    // Checkout cadastrado para a oferta promocional de R$ 13,90.
    completo: safeCheckoutUrl(config.CHECKOUT_URL_PROMO),
    // Usa o checkout normal do pacote completo, configurado na página principal.
    'completo-original': safeCheckoutUrl(config.CHECKOUT_URL_COMPLETO),
  };

  const checkoutDialog = document.getElementById('checkout-dialog');
  const checkoutDialogTitle = document.getElementById('checkout-dialog-title');
  const checkoutDialogMessage = document.getElementById('checkout-dialog-message');
  const unavailableMessages = {
    basico: {
      title: 'Checkout do plano básico',
      message: 'O link de pagamento específico de R$ 6,90 ainda não foi configurado. Para não encaminhar você a uma cobrança com valor diferente, esta compra está temporariamente indisponível.',
    },
    'completo-original': {
      title: 'Checkout do pacote completo',
      message: 'O link de pagamento do pacote completo por R$ 19,90 ainda não foi configurado. Para não encaminhar você a uma cobrança com valor diferente, esta opção está temporariamente indisponível.',
    },
  };

  document.querySelectorAll('[data-back-checkout]').forEach((link) => {
    const plan = link.dataset.backCheckout;
    const checkout = checkoutUrls[plan];

    if (checkout) {
      link.href = checkout;
      link.addEventListener('click', () => trackCheckout(plan));
      if (plan === 'basico') {
        const note = document.querySelector('[data-basic-checkout-note]');
        if (note) note.hidden = true;
      }
      return;
    }

    link.href = '#checkout-dialog';
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const unavailable = unavailableMessages[plan];
      if (unavailable && checkoutDialogTitle && checkoutDialogMessage) {
        checkoutDialogTitle.textContent = unavailable.title;
        checkoutDialogMessage.textContent = unavailable.message;
      }
      if (checkoutDialog && typeof checkoutDialog.showModal === 'function') checkoutDialog.showModal();
    });
  });
})();
