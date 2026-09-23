// Reuses the existing DOM controllers; the delivered pages need no Angular runtime.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import ts from 'typescript';

const source = 'src/app/feats/ong/';
const output = 'src/app/feats/ong/standalone/';
const read = path => readFileSync(path, 'utf8');
const write = (path, text) => { mkdirSync(path.substring(0, path.lastIndexOf('/')), { recursive: true }); writeFileSync(path, text); };
const compile = text => ts.transpileModule(text, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const pages = {
  'cadastrar-projeto-ong': 'projeto',
  'gerenciar-vaga-ong': 'vagas',
  'gerenciar-voluntario-ong': 'voluntarios',
  'gerenciar-eventos-ong': 'eventos',
  'gerencia-doacao-ong': 'doacoes',
  'prestacao-conta-ong': 'prestacao',
  'relatorio-ong': 'relatorios',
  'documento-ong': 'documentos',
  'configuracao-ong': 'configuracoes',
};
for (const file of ['ong-pages', 'ong-data']) write(`${output}shared/${file}.js`, compile(read(`${source}shared/${file}.ts`)).replace("from './ong-data'", "from './ong-data.js'"));
for (const file of ['ong-pages', 'ong-widgets', 'ong-responsive']) write(`${output}shared/${file}.css`, read(`${source}shared/${file}.css`).replaceAll('app-ong-shell', '.ong-shell'));
write(`${output}shared/shell.css`, read('src/app/components/ong-shell/ong-shell.css').replace(':host', '.ong-shell'));
let shell = read('src/app/components/ong-shell/ong-shell.html')
  .replaceAll(' [attr.href]="homeRoute()"', '')
  .replace(/{{ organization\(\)\?\.nomeFantasia[^}]+}}/, 'Rede Cuidar')
  .replace(/{{ organization\(\)\?\.contatoEmail[^}]+}}/, 'contato@redecuidar.org')
  .replace(/\[src\]="[^"]+"/, 'src="/ong-avatar.svg"')
  .replace('class="nav-item active" aria-current="page"', 'class="nav-item"');
function documentPage(slug, kind, content, title) {
  const inner = shell.replace('<ng-content />', content);
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Movune</title><link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/shell.css"><link rel="stylesheet" href="../shared/ong-pages.css"><link rel="stylesheet" href="../shared/ong-widgets.css"><link rel="stylesheet" href="../shared/ong-responsive.css">
${kind !== 'projetos' ? '<link rel="stylesheet" href="./page.css">' : ''}
<style>body{margin:0}.dashboard{min-height:max(100vh,var(--ong-page-height))}</style>
<script type="module" src="../shared/standalone.js"></script></head>
<body class="ong-workspace ${kind === 'projeto' ? 'standalone-project' : ''}" data-kind="${kind}"><div class="ong-shell">${inner}</div></body></html>`;
}
for (const [slug, kind] of Object.entries(pages)) {
  const content = read(`${source}${slug}/${slug}.html`).replaceAll(/<\/?app-ong-shell>/g, '');
  const title = content.match(/<h1[^>]*>(.*?)<\/h1>/)[1];
  write(`${output}${slug}/index.html`, documentPage(slug, kind, content, title));
  write(`${output}${slug}/page.css`, read(`${source}${slug}/${slug}.css`).replaceAll('app-cadastrar-projeto-ong', '.standalone-project'));
}
const projectSource = read(`${source}cadastrar-projeto-ong/cadastrar-projeto-ong.ts`);
const method = projectSource.slice(projectSource.indexOf('    const root = this.host.nativeElement;'), projectSource.lastIndexOf('\n  }'));
write(`${output}shared/project.js`, compile(`export function initializeProject(root: HTMLElement, context: any) {\n${method
  .replace('    const root = this.host.nativeElement;', '')
  .replaceAll('this.auth.session()', 'context.session')
  .replaceAll('this.activity', 'context.activity')
  .replaceAll('this.router.navigateByUrl', 'context.navigate')
  .replaceAll('this.destroy.onDestroy', 'context.onDestroy')}\n}`));
const projects = `<header class="management-heading"><div><h1>Projetos</h1><p>Gerencie as iniciativas sociais da sua organização.</p></div><a class="primary" href="../cadastrar-projeto-ong/index.html">+ Novo Projeto</a></header><section class="table-card"><div class="table-scroll"><table class="management-table"><thead><tr><th>Projeto</th><th>Categoria</th><th>Meta financeira</th><th>Status</th></tr></thead><tbody data-projects></tbody></table></div><p class="empty" hidden>Nenhum projeto cadastrado. Crie sua primeira iniciativa.</p></section><p class="page-feedback" role="status" hidden></p>`;
write(`${output}projetos/index.html`, documentPage('projetos', 'projetos', `<section class="management-page">${projects.replace('class="primary"', 'class="primary action"')}</section>`, 'Projetos'));
console.log('Generated 9 standalone ONG pages and the project listing.');
