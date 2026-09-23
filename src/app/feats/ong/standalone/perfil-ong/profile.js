/**
 * Browser-only behavior shared by the standalone HTML and the application route.
 * No framework or third-party dependencies.
 */
export function initializePublicProfile(root) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const win = root.ownerDocument.defaultView;
  const reducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const header = root.querySelector('.global-header');
  const homeLinks = header.querySelectorAll('.brand, .header-organization');
  const updateHomeLinks = () => {
    let ongSession = false;
    try {
      const session = JSON.parse(win.localStorage.getItem('movune:sessao') || 'null');
      ongSession = session?.perfil === 'ong' && typeof session.id === 'string' && !!session.id;
    } catch { /* Public home remains available without a readable session. */ }
    const editProfile = root.querySelector('.edit-profile-button');
    if (editProfile) editProfile.hidden = !ongSession;
    homeLinks.forEach(link => {
      link.setAttribute('href', ongSession ? '/ong/painel' : '/');
      link.setAttribute('aria-label', ongSession ? 'Ir para a página inicial da ONG' : 'Ir para a página inicial');
    });
  };
  updateHomeLinks();
  homeLinks.forEach(link => {
    for (const event of ['pointerdown', 'focus', 'click']) link.addEventListener(event, updateHomeLinks, options);
  });
  win.addEventListener('storage', event => {
    if (event.key === 'movune:sessao' || event.key === null) updateHomeLinks();
  }, options);
  const menu = root.querySelector('.public-nav');
  const menuButton = root.querySelector('.menu-toggle');
  const notificationsButton = root.querySelector('.profile-notifications');
  const notificationsPanel = root.querySelector('.profile-notifications-panel');
  const closeNotifications = () => {
    if (notificationsPanel) notificationsPanel.hidden = true;
    notificationsButton?.setAttribute('aria-expanded', 'false');
  };
  notificationsButton?.addEventListener('click', () => {
    const open = notificationsPanel.hidden;
    notificationsPanel.hidden = !open;
    notificationsButton.setAttribute('aria-expanded', String(open));
  }, options);
  const followButton = root.querySelector('.follow-button');
  const feedback = root.querySelector('.follow-feedback');
  const tabs = [...root.querySelectorAll('.profile-tab')];
  const followKey = 'movune:following:rede-cuidar';
  const frames = new Set();
  let following = false;
  let observer;
  const paintFollowing = () => {
    followButton.textContent = following ? 'Seguindo' : 'Seguir';
    followButton.setAttribute('aria-pressed', String(following));
  };
  try { following = win.localStorage.getItem(followKey) === 'true'; } catch { /* Browsing can continue without storage. */ }
  paintFollowing();

  const closeMenu = (restoreFocus = false) => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    closeNotifications();
    const opened = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  }, options);
  root.ownerDocument.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
    if (!event.target.closest('.profile-notifications, .profile-notifications-panel')) closeNotifications();
  }, options);
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
    if (event.key === 'Escape' && notificationsPanel && !notificationsPanel.hidden) {
      closeNotifications();
      notificationsButton?.focus();
    }
  }, options);
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); }, options);
  const breakpoint = win.matchMedia?.('(min-width: 1121px)');
  breakpoint?.addEventListener('change', event => { if (event.matches) closeMenu(); }, options);

  followButton.addEventListener('click', () => {
    following = !following;
    paintFollowing();
    try {
      win.localStorage.setItem(followKey, String(following));
      feedback.textContent = following ? 'Você está seguindo a Rede Cuidar.' : 'Você deixou de seguir a Rede Cuidar.';
    } catch {
      feedback.textContent = 'Preferência alterada nesta visita. Não foi possível salvar no navegador.';
    }
  }, options);
  win.addEventListener('storage', event => {
    if (event.key === followKey || event.key === null) {
      following = event.key === followKey && event.newValue === 'true';
      paintFollowing();
    }
  }, options);

  const activate = (id, scroll = true) => {
    const target = root.querySelector('#' + id);
    const tab = tabs.find(item => item.hash === '#' + id);
    if (!target || !tab) return;
    root.querySelectorAll('.extra-panel').forEach(panel => { panel.hidden = panel.id !== id; });
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
    if (scroll) {
      target.scrollIntoView?.({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    }
  };
  tabs.forEach(tab => tab.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const id = tab.hash.slice(1);
    activate(id);
    // Preserve Angular's history state when used inside the application.
    win.history.replaceState(win.history.state, '', tab.hash);
  }, options));
  win.addEventListener('hashchange', () => activate(win.location.hash.slice(1)), options);
  if (win.location.hash) activate(win.location.hash.slice(1), false);

  const updateHeader = () => header.classList.toggle('scrolled', win.scrollY > 8);
  win.addEventListener('scroll', updateHeader, { ...options, passive: true });
  updateHeader();

  const countUp = card => {
    const counter = card.querySelector('[data-count]');
    if (!counter) return;
    const target = Number(counter.dataset.count);
    const start = win.performance.now();
    const render = now => {
      const progress = Math.min((now - start) / 1000, 1);
      counter.textContent = counter.dataset.prefix +
        Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString('pt-BR') +
        counter.dataset.suffix;
      if (progress < 1) schedule(render);
    };
    schedule(render);
  };
  const schedule = callback => {
    const id = win.requestAnimationFrame(now => { frames.delete(id); callback(now); });
    frames.add(id);
  };
  if (!reducedMotion && typeof win.IntersectionObserver === 'function') {
    const animated = root.querySelectorAll('.stat-card, .progress-track');
    observer = new win.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('will-animate');
        if (entry.target.classList.contains('stat-card')) countUp(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .15 });
    animated.forEach(element => { element.classList.add('will-animate'); observer.observe(element); });
  }
  return () => {
    controller.abort();
    observer?.disconnect();
    frames.forEach(id => win.cancelAnimationFrame(id));
    root.querySelectorAll('.will-animate').forEach(element => element.classList.remove('will-animate'));
  };
}
