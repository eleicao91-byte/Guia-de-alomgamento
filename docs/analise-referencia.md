# Análise da referência

[Referência inspecionada](https://365receitassemgluten.confiavel.online/). Viewports configurados em 390 e 1280 px. A barra de rolagem ocupa 15 px.

## Ordem observada

1. Faixa fixa de urgência.
2. Hero centralizado em fundo branco, com título, subtítulo, imagem, texto curto, CTA e três selos.
3. Benefícios em duas colunas no desktop, CTA, galeria de imagens com indicadores circulares e carrossel de depoimentos com instrução de arraste.
4. Oito cards de demonstração em grade. Quatro colunas de cerca de 270 px e gap de 24 px no desktop.
5. Painel verde escuro arredondado com mosaico, categorias em pílulas e CTA.
6. Público do produto. Seis linhas com check coral, em duas colunas de aproximadamente 443 px e gap de 10 px no desktop.
7. Bônus em fundo areia, com pílula de destaque e três cards ilustrados.
8. Planos sobre fundo verde escuro. Dois cards brancos de 560 px, gap de 32 px no desktop. Empilhados no mobile.
9. Avaliações. Resumo com estrelas e barras seguido por cards de comentários, duas colunas no desktop.
10. Garantia. Card branco até 768 px, com selo e CTA.
11. Recebimento. Quatro cards com ícones, gap de 12 px. Duas colunas no mobile.
12. FAQ. Painel branco até 672 px com divisórias e chevrons. A primeira resposta inicia aberta.
13. CTA final e rodapé.
14. Modal. Abre pelo CTA do plano básico na sessão observada. Tem fundo escurecido a 55%, largura de 460 px no desktop, raio de 20 px e sombra 0 25px 80px preta a 33%. Exibe ícone, título, texto, preço, CTA, ação secundária e botão de fechar. O gatilho por saída não foi confirmado.

## Sistema visual

- Poppins com fallback system-ui e sans-serif. Títulos 900. H1 medido em 24 px no mobile e 66 px no desktop. H2 em 20–30 px no mobile e 30–48 px no desktop. Títulos de cards em 16–20 px. Botões principais 800, aproximadamente 20–26 px no desktop.
- Fundo branco, off-white #FAFAF9, areia #FFF7ED, verde-claro #D9E8DC, verde profundo #064E3B a 85%, texto #1C1917, CTA #16A34A e acento #EA580C.
- Containers centralizados até 672, 768, 896, 1024 e 1152 px conforme seção. Margens laterais de 12–16 px. Hero com padding vertical 64/40 px no mobile e 80/56 px no desktop. A maioria das seções usa 24–40 px no eixo vertical.
- CTA principal em bloco verde, raio de 16 px, sombra verde variável em torno de 0 13px 31px -5px a 52%, com pulso. Indicadores e etiquetas têm raio de pílula. Garantia tem raio de 24 px e sombra ampla. Cards menores usam sombras difusas.
- Selos de acesso, segurança e garantia com emoji. Cards de prática com imagem dominante, título pesado e uma linha curta. Galeria de benefícios com pontos e prova social arrastável. Entradas ao rolar e transições suaves de CTA e FAQ.

## Diferenças da implementação

O topo usa uma faixa informativa sem prazo. Ilustrações originais em SVG substituem o mockup e as fotos. Os exemplos ficam em carrossel conforme o briefing, e o painel de categorias combina ilustração e pílulas. Os planos permanecem lado a lado também em telas pequenas. Coral é usado nos CTAs com texto escuro, e verde-petróleo substitui o verde escuro da referência. Depoimentos e avaliações ficam ocultos até receberem conteúdo real. A oferta alternativa usa um produto menor e só pode aparecer após a configuração de preço e checkout. O CTA fixo aparece no celular depois do hero. A copy e os selos foram adaptados ao guia de alongamento.

## Verificações locais

- Sem rolagem horizontal em 360, 390, 768 e 1280 px. Os planos ocuparam a mesma linha nas quatro larguras.
- Foco visível, setas do teclado no carrossel e abertura exclusiva do FAQ com Enter verificados no navegador.
- Contraste calculado de 5,72:1 no CTA coral, 8,77:1 nos selos menta e 11,75:1 no rodapé escuro.
- Os cinco parâmetros UTM foram conferidos nos três links com URLs de teste. Console sem avisos ou erros na verificação.
- Gatilhos do popup verificados por simulação de eventos e temporizador. Checkouts de produção, Pixel e Utmify dependem da configuração final.
