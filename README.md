# Guia de alongamento

Landing estática em HTML, CSS e JavaScript. A oferta **Acesso completo** reúne o guia e os três bônus.

## Prévia e configuração

1. Rode `node scripts/preview.mjs` e abra [a landing local](http://127.0.0.1:8787/). Use `PORT` para trocar a porta se ela já estiver ocupada.
2. Em `config.js`, confirme nome do produto, `PRECO_BASICO`, `CHECKOUT_URL_BASICO`, garantia e quantidades. O preço de referência vem nulo. Configure Pixel, Utmify e a oferta alternativa somente se forem usados.
3. Em `BONUS_1_URL`, `BONUS_2_URL` e `BONUS_3_URL`, use os PDFs locais ou URLs HTTPS da sua plataforma. Configure o redirecionamento de compra para `/obrigado/` quando apropriado.
4. Arquivos publicados em um site estático ficam acessíveis a quem souber a URL, inclusive PDFs e HTMLs imprimíveis. Faça a entrega segura pelo checkout ou pela área de membros. Em produção, prefira URLs protegidas pela plataforma e exclua do diretório publicado as pastas `bonus-entrega/` e `bonus/` se o acesso público aos originais for indesejado.
5. Os bônus são materiais gerais. Solicite revisão de um profissional de saúde antes da venda. Complete termos, privacidade e canal de atendimento. O cartaz inclui espaços para inserir a logo e o QR code reais.

## Gerar PDFs e banners

Execute na raiz do projeto. As dependências servem apenas para gerar arquivos localmente.

```sh
npm install --no-save --no-package-lock playwright sharp
npx playwright install chromium
node scripts/gerar-materiais.mjs
node scripts/gerar-pdfs.mjs
node scripts/gerar-banners.mjs
node scripts/gerar-slots.mjs
```

Se já tiver um Chromium compatível, defina `BROWSER_PATH` com o caminho para o executável e pule a instalação do navegador. Os PDFs ficam em `bonus-entrega/`. Os banners ficam em `assets/images/bonus/` em SVG, PNG e WebP. O gerador de banners recria os arquivos de bônus e Open Graph. O gerador de slots preserva as imagens já existentes e atualiza o manifesto e seus prompts. Os HTMLs também podem ser impressos pelo navegador em A4, com gráficos de fundo.

## Substituir imagens

Abra [a galeria de slots](http://127.0.0.1:8787/preview-imagens.html). Substitua o arquivo indicado em `assets/images/` com o mesmo nome e formato. O hero tem arquivos para desktop e celular. Para os banners e o hero, atualize também o PNG de fallback se precisar manter as versões iguais em navegadores antigos. O manifesto registra tamanhos, alt e prompts. Atualize o alt ali se mudar o conteúdo visual. Antes de publicar, ajuste o `og:image` de `index.html` para a URL HTTPS absoluta da imagem no domínio final e revise o Open Graph.

## Vercel

Importe o repositório e selecione a pasta que contém `index.html` como **Root Directory**. Escolha o preset **Other**, deixe o comando de build vazio e sirva a raiz. Use `/obrigado/` como rota pós-compra. [Configuração de build na Vercel](https://vercel.com/docs/builds/configure-a-build#skip-build-step).

Referências usadas na redação do checklist geral. [NR-17, Ministério do Trabalho e Emprego](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras/normas-regulamentadoras-vigentes/norma-regulamentadora-no-17-nr-17/) e [checklist de estações de trabalho, OSHA](https://www.osha.gov/etools/computer-workstations/checklists/evaluation).


## Atualização dos bônus

A oferta passou a usar Rotina mensal de alongamento, Alongamentos para fazer enquanto está sentado e Guia alimentar para auxiliar na evolução corporal. Os preços de referência fornecidos ficam em BONUS_PRECOS_REFERENCIA. As três URLs de entrega aguardam os PDFs correspondentes. Os PDFs e geradores de materiais anteriores permanecem como versões anteriores e não são os arquivos dos novos produtos. Configure BONUS_1_URL, BONUS_2_URL e BONUS_3_URL após finalizar os novos materiais.

## Ofertas atuais

A seção de compra tem Básico com o guia e Completo com o guia mais os três bônus. PRECO_BASICO e PRECO_COMPLETO controlam os valores. Configure CHECKOUT_URL_BASICO e CHECKOUT_URL_COMPLETO separadamente. Os parâmetros UTM são mantidos para ambos.
