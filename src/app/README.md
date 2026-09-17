# Organização de `src/app`

- `app.routes.ts`: rotas públicas e áreas protegidas por perfil.
- `components/`: elementos compartilhados, como cabeçalho, rodapé e estrutura do painel do usuário.
- `feats/`: páginas agrupadas por área (acesso, usuário, ONG, administração, páginas públicas e legais).
- `shared/`: estado de autenticação, registros de atividades, recuperação de senha e dados usados por páginas genéricas.

## Convenções

- Cada página mantém template (`.html`), estilos (`.css`), lógica (`.ts`) e, quando houver, testes (`.spec.ts`) na mesma pasta.
- Comentários no código explicam decisões e efeitos que não ficam claros pela leitura da implementação. Evite repetir o nome de métodos ou descrever linha por linha.
- Dados de demonstração e sessões são guardados no `localStorage` pelo protótipo. A autenticação e a recuperação de senha precisam de serviços no servidor antes de uso em produção.

## Verificação

```sh
npx prettier --check src/app
npx ngc -p tsconfig.app.json --noEmit
npx ng test --watch=false
```
