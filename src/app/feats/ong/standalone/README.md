# Painel da ONG em HTML, CSS e JavaScript

As nove telas do briefing também estão disponíveis sem o runtime Angular.
Com `npm start`, abra `/ong/cadastrar-projeto-ong/index.html`.
Os links do menu conectam as versões independentes das telas entregues.

| Tela | URL |
| --- | --- |
| Cadastrar projeto | `/ong/cadastrar-projeto-ong/index.html` |
| Projetos cadastrados | `/ong/projetos/index.html` |
| Vagas | `/ong/gerenciar-vaga-ong/index.html` |
| Voluntários | `/ong/gerenciar-voluntario-ong/index.html` |
| Eventos | `/ong/gerenciar-eventos-ong/index.html` |
| Doações | `/ong/gerencia-doacao-ong/index.html` |
| Prestação de contas | `/ong/prestacao-conta-ong/index.html` |
| Relatórios | `/ong/relatorio-ong/index.html` |
| Documentos | `/ong/documento-ong/index.html` |
| Configurações | `/ong/configuracao-ong/index.html` |

Os arquivos ficam em `src/app/feats/ong/standalone`, junto à funcionalidade ONG.
O `angular.json` publica essa pasta em `/ong`, mantendo as URLs existentes.
Após `npm run build`, também é possível servir `dist/movune/browser/` em um servidor HTTP estático. Nesse caso,
Painel, Editar Perfil e Login continuam sendo links para a aplicação principal.
Use HTTP, pois os módulos JavaScript não devem ser abertos por `file://`.

Os dados são locais ao navegador, com as mesmas chaves utilizadas pelo protótipo
Angular. Sem sessão de ONG, as telas usam o espaço de demonstração `demo`.
Alterar senha exige uma conta de ONG conectada. Mensagens são registradas
localmente, sem envio externo. PDF usa a impressão do navegador; CSV e Excel
produzem downloads. Documentos de exemplo não têm arquivo para baixar; arquivos
enviados pelo usuário podem ser baixados depois.

`npm run build:ong-static` regenera HTML, CSS e controladores JavaScript a partir
das telas existentes em `src/app/feats/ong`. O adaptador `shared/standalone.js` é
mantido manualmente. A geração usa TypeScript somente como ferramenta de
desenvolvimento; os arquivos publicados não importam Angular nem frameworks.

`npm run test:ong-static` verifica a inicialização das telas, navegação, filtros,
persistência, validações, upload e configurações com DOM simulado.
