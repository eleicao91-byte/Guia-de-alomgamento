# Otimização mobile — 07/11/2026

## Alterações

- CSS mobile para títulos dos planos lado a lado, sem cortes; ajuste específico até 360 px.
- Correção do excesso de largura das frases de confiança em 320 px, preservando a linha única.
- Áreas de toque de pelo menos 44 px nos controles e links de navegação; botões de compra com 48 px no mobile.
- Imagens dos depoimentos usando a largura disponível do carrossel no celular, sem cortes.
- Espaço reservado para imagens antes do manifesto carregar, reduzindo mudanças de layout.
- 26 arquivos WebP responsivos; `srcset` e `sizes` na imagem principal, nas práticas, nos livros e nas conversas.
- Imagem principal prioritária; demais imagens continuam com carregamento sob demanda.
- Tratamento do `srcset` em erro de imagem para permitir o fallback existente.
- Áreas seguras, deslocamento das âncoras sob a tarja sticky, links de rodapé e foco do atalho de navegação.
- Animação mobile dos CTAs restrita a transformação, sem animar sombras; suporte a movimento reduzido preservado.
- Leitura dos materiais de impressão adaptada em tela: calendário em duas colunas, tipografia e espaçamento maiores. Regras de impressão mantidas.
- Tratamento mobile dos estilos de diálogo; fluxo comercial e configuração do pop-up mantidos.

## Páginas conferidas no navegador

Larguras: **320, 360, 375, 390, 414 e 430 px**, altura de 800 px. Verificação por dimensões reais do DOM em cada rota, incluindo largura do documento, textos cortados e imagens quebradas. Inspeções por screenshot em pontos da landing page e materiais.

1. `/` — landing page e âncora `#planos`
2. `/termos.html`
3. `/privacidade.html`
4. `/obrigado/`
5. `/preview-imagens.html`
6. `/bonus/calendario-30-dias/`
7. `/bonus/checklist-ergonomia/`
8. `/bonus/cartaz-pausas/`

Sem conteúdo cortado ou imagem quebrada nos testes. O excesso de 1 px detectado inicialmente na landing page de 320 px foi corrigido e conferido novamente.

As oito rotas também foram conferidas em **1280 × 900 px**, sem overflow, textos cortados ou imagens quebradas. A prévia foi restaurada ao tamanho padrão ao terminar.

## Funcionalidades verificadas

- Setas dos dois carrosséis: deslocamento confirmado no DOM.
- Botão principal: navegação para `#planos` confirmada.
- FAQ: abertura e mudança do item expandido confirmadas.
- Tarja sticky: posição no topo confirmada após rolagem.
- Seleção de imagem responsiva: variante de 640 px da imagem principal confirmada.
- Sintaxe dos scripts de configuração, landing page, imagens e downloads: `node --check`.
- Teste existente `work/test-offer.cjs`: passou, simulando saída desktop, inatividade mobile, reinício do temporizador e limite por sessão.

## Limites

- Projeto estático, sem comandos de build ou lint configurados.
- Checkout e PDFs dos bônus estão sem URLs em `config.js`; estados indisponíveis preservados. Pagamento e download reais dependem dessas URLs.
- Pop-up desativado na configuração: lógica coberta pelo teste existente; abertura real não foi habilitada para a auditoria.
- Não foram realizados testes em aparelhos físicos, Safari/iOS ou leitor de tela, nem medição Lighthouse/Core Web Vitals em produção.
- Termos e privacidade continuam com conteúdo provisório existente, sem mudanças editoriais.

## Arquivos

`styles.css`, `slots.js`, `assets/images/manifest.json`, `bonus/print.css`, os oito HTML listados acima, `scripts/optimize-mobile-images.cjs` e 26 novas variantes WebP em `assets/images/`.

Textos, cores, fontes, preços, ofertas, pixels, tracking e integrações comerciais preservados.
