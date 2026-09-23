import { initializeOngPage } from './ong-pages.js';
import { initializeProject } from './project.js';
import { activityRows, escapeHtml, money } from './ong-data.js';

const routes = {
  projetos: 'projetos', vagas: 'gerenciar-vaga-ong', voluntarios: 'gerenciar-voluntario-ong',
  eventos: 'gerenciar-eventos-ong', doacoes: 'gerencia-doacao-ong',
  'prestacao-contas': 'prestacao-conta-ong', relatorios: 'relatorio-ong',
  documentos: 'documento-ong', configuracoes: 'configuracao-ong',
};
export function staticRoute(path) {
  const volunteer = path.match(/^\/voluntario\/([^/]+)\/perfil$/);
  if (volunteer) return `/ong/gerenciar-voluntario-ong/index.html?route=${encodeURIComponent(path)}`;
  if (path === '/ong/projetos/novo') return '/ong/cadastrar-projeto-ong/index.html';
  const [, page, rest] = path.match(/^\/ong\/([^/?#]+)(.*)$/) || [];
  return routes[page] ? `/ong/${routes[page]}/index.html${rest ? '?route=' + encodeURIComponent(path) : ''}` : path;
}

export function initializeStandalone(root = document.body) {
  const disposers = [];
  const lifetime = new AbortController();
  const options = { signal: lifetime.signal };
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
    catch { return fallback; }
  };
  const readArray = key => { const value = read(key, []); return Array.isArray(value) ? value : []; };
  const storedSession = read('movune:sessao', null);
  const session = storedSession?.perfil === 'ong' ? storedSession : null;
  const owner = session?.id || 'demo';
  const account = readArray('movune:ongs').find(item => item.id === owner);
  const navigate = path => window.location.assign(staticRoute(path));
  const kind = root.dataset.kind;
  const active = kind === 'projeto' ? 'projetos' : kind === 'prestacao' ? 'prestacao-contas' : kind;
  root.querySelectorAll('a[data-route]').forEach(link => {
    const path = link.getAttribute('href');
    if (link.classList.contains('nav-item') && path === `/ong/${active}`) {
      link.classList.add('active'); link.setAttribute('aria-current', 'page');
    }
    link.href = staticRoute(path);
  });
  const updateLogo = () => {
    const activeSession = read('movune:sessao', null);
    root.querySelectorAll('.logo-group a, a.avatar').forEach(link => {
      link.href = activeSession?.perfil === 'ong' && activeSession.id ? '/ong/painel' : '/';
    });
  };
  updateLogo();
  root.querySelectorAll('.logo-group a, a.avatar').forEach(link => {
    for (const event of ['pointerdown', 'focus', 'click']) link.addEventListener(event, updateLogo, options);
  });
  window.addEventListener('storage', updateLogo, options);
  const name = root.querySelector('.user-info strong');
  const email = root.querySelector('.user-info span');
  if (name) name.textContent = account?.nomeFantasia || session?.nome || 'Rede Cuidar';
  if (email) email.textContent = account?.contatoEmail || session?.email || 'contato@redecuidar.org';
  const drawer = root.querySelector('.mobile-drawer');
  root.querySelector('[data-mobile-menu]').innerHTML = root.querySelector('#desktop-menu').innerHTML;
  const drawerButton = root.querySelector('[data-drawer]');
  drawerButton.setAttribute('aria-expanded', 'false');
  drawerButton.addEventListener('click', () => { drawer.showModal(); drawerButton.setAttribute('aria-expanded', 'true'); }, options);
  root.querySelector('[data-close-drawer]').addEventListener('click', () => drawer.close(), options);
  drawer.addEventListener('close', () => { drawerButton.setAttribute('aria-expanded', 'false'); drawerButton.focus(); }, options);
  const closePopovers = () => root.querySelectorAll('[data-toggle]').forEach(button => {
    root.querySelector(`#${button.dataset.toggle}`).hidden = true;
    button.setAttribute('aria-expanded', 'false');
  });
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-toggle]');
    if (button) {
      if (button.dataset.toggle === 'profile-menu' && !read('movune:sessao', null)) {
        navigate('/');
        return;
      }
      const panel = root.querySelector(`#${button.dataset.toggle}`);
      const open = panel.hidden;
      closePopovers(); panel.hidden = !open; button.setAttribute('aria-expanded', String(open));
    } else if (!event.target.closest('[data-popover]')) closePopovers();
  }, options);
  root.addEventListener('keydown', event => { if (event.key === 'Escape') closePopovers(); }, options);
  const logout = root.querySelector('.logout-dialog');
  root.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => { drawer.close(); logout.showModal(); }, options));
  root.querySelector('[data-cancel-logout]').addEventListener('click', () => logout.close(), options);
  root.querySelector('[data-confirm-logout]').addEventListener('click', () => { localStorage.removeItem('movune:sessao'); navigate('/login'); }, options);
  for (const dialog of [drawer, logout]) dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  }, options);

  const records = () => readArray('movune:atividades');
  // The controller rolls back its in-memory store on a storage failure. This
  // adapter reads directly from storage, so there is no cached state to restore.
  records.set = () => {};
  const context = {
    owner, email: session?.email || 'contato@redecuidar.org', session,
    path: new URLSearchParams(location.search).get('route') || `/ong/${active}`,
    navigate, onDestroy: dispose => disposers.push(dispose),
    activity: {
      records,
      save(input) {
        const record = {
          id: 'activity-' + crypto.randomUUID(), type: input.type,
          pageTitle: input.pageTitle, pageEyebrow: input.pageEyebrow,
          fields: input.fields, status: input.status, createdAt: new Date().toISOString(),
          ownerId: owner, ownerName: session?.nome || 'Rede Cuidar', ownerProfile: 'ong',
        };
        localStorage.setItem('movune:atividades', JSON.stringify([record, ...records()]));
        return record;
      },
    },
    changePassword(current, next) {
      const accounts = readArray('movune:ongs');
      const currentAccount = accounts.find(item => item.id === owner);
      if (!session || !currentAccount) return 'Entre com uma conta de ONG para alterar a senha.';
      if (currentAccount.senha !== current) return 'Senha atual incorreta.';
      try {
        localStorage.setItem('movune:ongs', JSON.stringify(accounts.map(item => item.id === owner ? { ...item, senha: next } : item)));
        return '';
      } catch { return 'Não foi possível salvar a senha. Verifique o armazenamento do navegador.'; }
    },
    deactivate() {
      if (session) {
        localStorage.setItem('movune:ongs', JSON.stringify(readArray('movune:ongs').filter(item => item.id !== owner)));
        localStorage.removeItem('movune:sessao');
      }
      navigate('/login');
    },
  };
  if (kind === 'projeto') initializeProject(root, context);
  else if (kind === 'projetos') {
    const projects = records().filter(item => item.type === 'projeto' && item.ownerId === owner);
    root.querySelector('[data-projects]').innerHTML = projects.map(item => `<tr><th scope="row">${escapeHtml(item.pageTitle)}</th><td>${escapeHtml(item.fields?.['Categoria'] || '—')}</td><td>${money(Number(item.fields?.['Meta financeira']) || 0)}</td><td><span class="badge ${item.status === 'Rascunho' ? '' : 'green'}">${escapeHtml(item.status)}</span></td></tr>`).join('');
    root.querySelector('.empty').hidden = projects.length > 0;
  } else {
    if (kind === 'prestacao') context.importedRows = activityRows(records().filter(item => item.type === 'prestacao' && item.ownerId === owner));
    disposers.push(initializeOngPage(root, kind, context));
  }
  const onPageHide = event => { if (!event.persisted) dispose(); };
  const dispose = () => {
    window.removeEventListener('pagehide', onPageHide);
    lifetime.abort(); disposers.forEach(fn => fn());
  };
  window.addEventListener('pagehide', onPageHide);
  return dispose;
}

if (document.body?.dataset.kind) initializeStandalone();
