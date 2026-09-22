import {
  PageKind,
  Row,
  initialRows,
  columns,
  documentStatus,
  money,
  parseMoney,
  escapeHtml as esc,
  csvCell,
  months,
  revenue,
} from './ong-data';

interface Context {
  importedRows?: Row[];
  owner: string;
  email: string;
  path: string;
  navigate: (path: string) => void;
  changePassword: (current: string, next: string) => string;
  deactivate: () => void;
}
const icon = (path: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const fileIcon = icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6');
const tone = (status: string) =>
  ['Aberta', 'Aberto', 'Ativo', 'Confirmada', 'Recebida', 'Aprovado', 'Válido'].includes(status)
    ? 'green'
    : ['Pendente', 'Vencendo'].includes(status)
      ? 'amber'
      : ['Cancelado', 'Rejeitado', 'Vencido'].includes(status)
        ? 'red'
        : status === 'Em análise'
          ? 'blue'
          : '';
const badge = (status: string) => `<span class="badge ${tone(status)}">${esc(status)}</span>`;
const dateLabel = (value: string, year = false) => {
  if (!value) return '—';
  const [y, m, d] = value.split('-');
  return `${d}/${['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][Number(m) - 1]}${year ? '/' + y : ''}`;
};
const inputField = (name: string, label: string, value = '', type = 'text', extra = '') =>
  `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}><span class="validation-error" hidden></span></label>`;
const selectField = (name: string, label: string, choices: string[], selected = '') =>
  `<label class="field">${label}<select name="${name}">${choices.map((value) => `<option ${value === selected ? 'selected' : ''}>${esc(value)}</option>`).join('')}</select></label>`;
const projects = [
  'Biblioteca de Bairro',
  'Cozinha Solidária',
  'Saúde na Comunidade',
  'Horta na Escola',
];
const uploadMarkup = `<div class="file-drop"><button type="button" data-pick>↑ Clique para fazer upload</button><span class="file-name">ou arraste o arquivo aqui (PDF, PNG, JPG)</span><button type="button" data-remove-file hidden aria-label="Remover arquivo">×</button><input type="file" accept=".pdf,.png,.jpg,.jpeg" hidden><span class="validation-error" role="alert" hidden></span></div>`;

export function initializeOngPage(root: HTMLElement, kind: PageKind, context: Context): () => void {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const query = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const body = query<HTMLElement>('.page-body');
  const dialog = query<HTMLDialogElement>('.management-dialog');
  const modalForm = query<HTMLFormElement>('.modal-form');
  const feedback = query<HTMLElement>('.page-feedback');
  const storageKey = `movune:ong:${context.owner}:${kind}`;
  let rows = structuredClone(initialRows[kind] || []);
  let selected = new Set<string>();
  let sortKey = '',
    direction = 1;
  let modalSave: ((form: HTMLFormElement) => boolean | Promise<boolean>) | undefined;
  let returnFocus: HTMLElement | null = null;
  let disposeUpload: (() => void) | undefined;
  let observer: IntersectionObserver | undefined;
  const frames = new Set<number>();
  const announce = (message: string, error = false) => {
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.classList.toggle('error', error);
  };
  const write = (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      announce(
        'Não foi possível salvar no navegador. Verifique o espaço disponível e tente novamente.',
        true,
      );
      return false;
    }
  };
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (
      Array.isArray(saved) &&
      saved.every(
        (row) =>
          row &&
          typeof row.id === 'string' &&
          typeof row.name === 'string' &&
          typeof row.status === 'string',
      )
    )
      rows = saved;
  } catch {
    announce('Não foi possível recuperar os dados salvos. Exibindo os exemplos.', true);
  }
  if (context.importedRows)
    rows = [
      ...context.importedRows.filter((record) => !rows.some((row) => row.id === record.id)),
      ...rows,
    ];
  const persistRows = (next: Row[]) => {
    if (!write(storageKey, next)) return false;
    rows = next;
    renderRows();
    return true;
  };
  const update = (row: Row, changes: Partial<Row>) =>
    persistRows(rows.map((item) => (item.id === row.id ? ({ ...item, ...changes } as Row) : item)));
  const modalError = (message: string) => {
    const el = query<HTMLElement>('.modal-error');
    el.textContent = message;
    el.hidden = !message;
  };
  const openModal = (
    title: string,
    html: string,
    label: string,
    save?: typeof modalSave,
    danger = false,
  ) => {
    disposeUpload?.();
    disposeUpload = undefined;
    returnFocus = document.activeElement as HTMLElement;
    query('#modal-title').textContent = title;
    query('.modal-content').innerHTML = html;
    const confirm = query<HTMLButtonElement>('[data-confirm]');
    confirm.textContent = label;
    confirm.hidden = !save;
    confirm.disabled = false;
    confirm.classList.toggle('danger-confirm', danger);
    modalSave = save;
    modalError('');
    dialog.showModal();
  };
  const validate = (form: HTMLFormElement): boolean => {
    let first: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined;
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input:not([type=file]),textarea,select',
      )
      .forEach((input) => {
        const invalid = !input.validity.valid || (input.required && !input.value.trim());
        input.setAttribute('aria-invalid', String(invalid));
        const error = input.closest('.field')?.querySelector<HTMLElement>('.validation-error');
        if (error) {
          error.hidden = !invalid;
          error.textContent = invalid
            ? input.validity.valueMissing || !input.value.trim()
              ? 'Preencha este campo.'
              : 'Informe um valor válido.'
            : '';
        }
        if (invalid && !first) first = input;
      });
    first?.focus();
    return !first;
  };
  modalForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();
      if (!modalSave || !validate(modalForm)) return;
      const confirm = query<HTMLButtonElement>('[data-confirm]');
      confirm.disabled = true;
      try {
        if (await modalSave(modalForm)) dialog.close();
      } catch {
        modalError('Não foi possível concluir a ação. Tente novamente.');
      } finally {
        confirm.disabled = false;
      }
    },
    options,
  );
  query('[data-close]').addEventListener('click', () => dialog.close(), options);
  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dialog.close();
      }
    },
    options,
  );
  dialog.addEventListener(
    'close',
    () => {
      disposeUpload?.();
      disposeUpload = undefined;
      returnFocus?.focus();
    },
    options,
  );
  root.addEventListener(
    'focusout',
    (event) => {
      const input = event.target as HTMLInputElement;
      if (input.matches('.field input[required],.field textarea[required]')) {
        const valid = input.validity.valid && !!input.value.trim();
        input.setAttribute('aria-invalid', String(!valid));
        const error = input.closest('.field')?.querySelector<HTMLElement>('.validation-error');
        if (error) {
          error.hidden = valid;
          error.textContent = valid ? '' : 'Preencha este campo com um valor válido.';
        }
      }
    },
    options,
  );
  function setupUpload(container: HTMLElement): {
    get: () => { name: string; data: string } | null;
    pending: () => boolean;
    clear: () => void;
    dispose: () => void;
  } {
    const zone = container.querySelector<HTMLElement>('.file-drop')!;
    const picker = zone.querySelector<HTMLInputElement>('input')!;
    const name = zone.querySelector<HTMLElement>('.file-name')!;
    const remove = zone.querySelector<HTMLButtonElement>('[data-remove-file]')!;
    const error = zone.querySelector<HTMLElement>('.validation-error')!;
    const life = new AbortController();
    const opts = { signal: life.signal };
    let file: { name: string; data: string } | null = null;
    let reader: FileReader | null = null;
    let loading = false;
    const clear = () => {
      reader?.abort();
      loading = false;
      file = null;
      picker.value = '';
      name.textContent = 'ou arraste o arquivo aqui (PDF, PNG, JPG)';
      remove.hidden = true;
      error.hidden = true;
    };
    const load = (candidate?: File) => {
      if (!candidate) return;
      const message = !['application/pdf', 'image/png', 'image/jpeg'].includes(candidate.type)
        ? 'Use PDF, PNG ou JPG.'
        : candidate.size > 5 * 1024 * 1024
          ? 'O arquivo deve ter no máximo 5MB.'
          : '';
      error.textContent = message;
      error.hidden = !message;
      picker.value = '';
      if (message) return;
      reader?.abort();
      reader = new FileReader();
      loading = true;
      reader.onload = () => {
        loading = false;
        file = { name: candidate.name, data: String(reader!.result) };
        name.textContent = candidate.name;
        remove.hidden = false;
      };
      reader.onerror = () => {
        loading = false;
        error.textContent = 'Não foi possível ler o arquivo.';
        error.hidden = false;
      };
      reader.readAsDataURL(candidate);
    };
    zone.querySelector('[data-pick]')!.addEventListener('click', () => picker.click(), opts);
    picker.addEventListener('change', () => load(picker.files?.[0]), opts);
    remove.addEventListener('click', clear, opts);
    for (const event of ['dragenter', 'dragover'])
      zone.addEventListener(
        event,
        (e) => {
          e.preventDefault();
          zone.classList.add('dragging');
        },
        opts,
      );
    zone.addEventListener('dragleave', () => zone.classList.remove('dragging'), opts);
    zone.addEventListener(
      'drop',
      (e) => {
        e.preventDefault();
        zone.classList.remove('dragging');
        load(e.dataTransfer?.files[0]);
      },
      opts,
    );
    return {
      get: () => file,
      pending: () => loading,
      clear,
      dispose: () => {
        life.abort();
        reader?.abort();
      },
    };
  }
  const action = (label: string, name: string, row: Row, css = '') =>
    `<button type="button" class="${css}" data-row-action="${name}" data-id="${esc(row.id)}">${label}</button>`;
  function rowActions(row: Row): string {
    if (kind === 'vagas')
      return row.status === 'Aberta'
        ? action('Editar', 'edit', row, 'blue') + action('Fechar', 'close', row)
        : action('Reabrir', 'reopen', row, 'blue');
    if (kind === 'voluntarios')
      return row.status === 'Ativo'
        ? action('Ver perfil', 'profile', row) + action('Mensagem', 'message', row, 'blue')
        : row.status === 'Pendente'
          ? action('Aprovar', 'approve', row, 'green') + action('Rejeitar', 'reject', row, 'red')
          : action('Reativar', 'reactivate', row, 'blue');
    if (kind === 'eventos')
      return row.status === 'Aberto'
        ? action('Editar', 'edit', row, 'blue') + action('Cancelar', 'cancel', row, 'red')
        : row.status === 'Rascunho'
          ? action('Publicar', 'publish', row, 'green') + action('Editar', 'edit', row)
          : '<span class="muted">Evento cancelado</span>';
    if (kind === 'documentos') {
      const state = documentStatus(String(row['date']));
      return (
        action('Baixar', 'download', row, 'blue') +
        (row['type'] === 'Relatório'
          ? ''
          : action(
              state === 'Válido' ? 'Atualizar' : 'Renovar',
              'renew',
              row,
              state === 'Válido' ? '' : tone(state),
            ))
      );
    }
    return '';
  }
  function renderRows(): void {
    const tableBody = body.querySelector('tbody');
    if (kind === 'documentos') {
      const grid = body.querySelector('.documents-grid');
      if (!grid) return;
      grid.innerHTML =
        `<div class="document-head" role="row"><span role="columnheader">Documento</span><span role="columnheader">Vencimento</span><span role="columnheader">Status</span><span role="columnheader">Ação</span></div>` +
        rows
          .map((row) => {
            const status = documentStatus(String(row['date']));
            return `<div class="document-row" role="row"><div class="document-name" role="cell">${fileIcon}${esc(row.name)}</div><div role="cell" data-label="Vencimento" class="${status === 'Vencido' ? 'expired' : ''}">${dateLabel(String(row['date']), true)}</div><div role="cell" data-label="Status">${badge(status)}</div><div role="cell" class="table-actions">${rowActions(row)}</div></div>`;
          })
          .join('');
      return;
    }
    if (!tableBody) return;
    const visible = rows.filter(
      (row) =>
        selected.size === 0 ||
        selected.has(String(kind === 'voluntarios' ? row['interest'] : row.status)),
    );
    if (sortKey)
      visible.sort((a, b) =>
        typeof a[sortKey] === 'number' && typeof b[sortKey] === 'number'
          ? direction * (Number(a[sortKey]) - Number(b[sortKey]))
          : direction *
            String(a[sortKey]).localeCompare(String(b[sortKey]), 'pt-BR', { numeric: true }),
      );
    tableBody.innerHTML = visible
      .map(
        (row) =>
          `<tr data-id="${esc(row.id)}">${columns[kind]!.map(([key, label]) => {
            let value = esc(row[key]);
            let css = '';
            if (key === 'name')
              return `<th scope="row">${kind === 'doacoes' ? `<button class="donation-detail" data-row-action="detail" data-id="${esc(row.id)}">${esc(row.name)}</button>` : value}</th>`;
            if (key === 'status') value = badge(row.status);
            if (key === 'actions') value = `<div class="table-actions">${rowActions(row)}</div>`;
            if (key === 'date') {
              value = dateLabel(String(row[key]), kind === 'eventos');
              css = 'muted';
            }
            if (key === 'value') {
              value = typeof row[key] === 'number' ? money(Number(row[key])) : esc(row[key]);
              css =
                kind === 'doacoes' && row['type'] === 'Financeira'
                  ? 'colored-value'
                  : 'numeric-value';
            }
            if (key === 'type' && kind === 'prestacao')
              css = row[key] === 'Despesa' ? 'expense' : 'income';
            if (key === 'count') css = 'numeric-value';
            return `<td data-label="${label}" class="${css}">${value}</td>`;
          }).join('')}</tr>`,
      )
      .join('');
    const empty = body.querySelector<HTMLElement>('.empty');
    if (empty) empty.hidden = visible.length > 0;
  }
  function tableMarkup(): string {
    return `<section class="table-card" aria-label="Lista de registros">${
      kind === 'vagas'
        ? `<div class="tabs" role="group" aria-label="Filtrar vagas">${[
            ['', 'Todos'],
            ['Aberta', 'Abertas'],
            ['Encerrada', 'Encerradas'],
          ]
            .map(
              ([value, label]) =>
                `<button data-filter="${value}" aria-pressed="${!value}" class="${!value ? 'selected' : ''}">${label}</button>`,
            )
            .join('')}</div>`
        : ''
    }<div class="table-scroll"><table class="management-table"><thead><tr>${columns[kind]!.map(([key, label]) => `<th scope="col" ${key !== 'actions' ? 'aria-sort="none"' : ''}>${key !== 'actions' ? `<button data-sort="${key}">${label}</button>` : label}</th>`).join('')}</tr></thead><tbody></tbody></table></div><p class="empty" hidden>Nenhum registro encontrado.</p></section>`;
  }
  function kpis(report = false): string {
    const data = report
      ? [
          [
            'Total Arrecadado',
            45200,
            '+15% este mês',
            'M12 3v18M16 7H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6',
          ],
          [
            'Voluntários Ativos',
            23,
            '+4 novos voluntários',
            'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
          ],
          ['Projetos Ativos', 5, '+1 novo projeto', 'M3 7V3h7l2 3h9v15H3z'],
          [
            'Impacto Estimado',
            1200,
            'Beneficiados diretos',
            'M16 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 13l-1 8 5-3 5 3-1-8',
          ],
        ]
      : [
          ['Total Recebido', 45200, 'Histórico consolidado', ''],
          ['Este Mês', 4200, '+12% em relação a agosto', ''],
          ['Doadores Únicos', 87, 'Indivíduos e empresas', ''],
        ];
    return `<section class="kpis ${report ? 'four' : ''}" aria-label="Indicadores">${data.map(([label, value, sub, path], i) => `<article class="metric"><div class="metric-label">${label}${report ? `<span class="metric-icon">${icon(String(path))}</span>` : ''}</div><strong class="metric-value" data-count="${value}" data-money="${i === 0 || (!report && i === 1)}">${i === 0 || (!report && i === 1) ? money(Number(value)) : Number(value).toLocaleString('pt-BR')}</strong><small>${sub}</small></article>`).join('')}</section>`;
  }
  function animateMetrics(): void {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer!.unobserve(entry.target);
          entry.target.classList.add('animate-in');
          entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
            const target = Number(el.dataset['count']);
            const started = performance.now();
            const tick = (now: number) => {
              if (abort.signal.aborted) return;
              const progress = Math.min(1, (now - started) / 750);
              const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
              el.textContent =
                el.dataset['money'] === 'true' ? money(value) : value.toLocaleString('pt-BR');
              if (progress < 1) {
                const id = requestAnimationFrame((time) => {
                  frames.delete(id);
                  tick(time);
                });
                frames.add(id);
              }
            };
            const id = requestAnimationFrame((time) => {
              frames.delete(id);
              tick(time);
            });
            frames.add(id);
          });
        }),
      { threshold: 0.15 },
    );
    body.querySelectorAll('.kpis,.charts').forEach((el) => observer!.observe(el));
  }
  const confirmChange = (
    row: Row,
    title: string,
    text: string,
    status: string,
    label: string,
    danger = false,
    reason = false,
  ) => {
    openModal(
      title,
      `<p>${esc(text)}</p>${reason ? '<label class="field">Justificativa (opcional)<textarea name="reason" maxlength="1000"></textarea></label>' : ''}`,
      label,
      (form) => {
        if (
          !update(row, {
            status,
            ...(reason ? { reason: String(new FormData(form).get('reason') || '') } : {}),
          })
        ) {
          modalError('Não foi possível salvar a alteração.');
          return false;
        }
        announce(
          status === 'Aberto' && kind === 'eventos'
            ? 'Evento publicado com sucesso!'
            : 'Status atualizado com sucesso.',
        );
        return true;
      },
      danger,
    );
  };
  function openEditor(row?: Row): void {
    const event = kind === 'eventos';
    const heading = row
      ? event
        ? 'Editar Evento'
        : 'Editar Vaga'
      : event
        ? 'Novo Evento'
        : 'Nova Vaga';
    const html =
      inputField(
        'name',
        event ? 'Nome do Evento' : 'Título da Vaga',
        row?.name || '',
        'text',
        'required maxlength="150"',
      ) +
      (event
        ? inputField('date', 'Data', String(row?.['date'] || ''), 'date', 'required') +
          inputField(
            'capacity',
            'Número de vagas',
            String(row?.['capacity'] || ''),
            'number',
            `required min="${row?.['count'] || 1}" step="1"`,
          )
        : selectField(
            'mode',
            'Modalidade',
            ['Remoto', 'Presencial'],
            String(row?.['mode'] || 'Remoto'),
          )) +
      `<label class="field">Descrição<textarea name="description" maxlength="4000">${esc(row?.['description'] || '')}</textarea></label>`;
    openModal(heading, html, 'Salvar', (form) => {
      const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
      const next: Row = {
        ...(row || { id: crypto.randomUUID(), status: event ? 'Rascunho' : 'Aberta', count: 0 }),
        ...data,
        name: data['name'].trim(),
        ...(event ? { capacity: Number(data['capacity']) } : {}),
      };
      const success = row ? update(row, next) : persistRows([next, ...rows]);
      if (!success) {
        modalError('Não foi possível salvar.');
        return false;
      }
      announce(event ? 'Evento salvo com sucesso!' : 'Vaga salva com sucesso!');
      if (/\/(nova|novo|editar\/)/.test(context.path)) context.navigate('/ong/' + kind);
      return true;
    });
  }
  function openDocument(row?: Row): void {
    const renewing = !!row && documentStatus(String(row['date'])) !== 'Válido';
    const title = row
      ? `${renewing ? 'Renovar' : 'Atualizar'} ${row.name}`
      : 'Enviar novo documento';
    let upload: ReturnType<typeof setupUpload>;
    openModal(
      title,
      uploadMarkup +
        selectField(
          'type',
          'Tipo de documento',
          ['Estatuto', 'Ata', 'Certidão', 'Certificado', 'Relatório', 'Outro'],
          String(row?.['type'] || 'Estatuto'),
        ) +
        inputField(
          'date',
          renewing ? 'Nova data de vencimento' : 'Data de vencimento (opcional)',
          String(row?.['date'] || ''),
          'date',
          renewing ? 'required' : '',
        ),
      renewing ? 'Renovar documento' : row ? 'Atualizar' : 'Enviar',
      (form) => {
        if (upload.pending()) {
          modalError('Aguarde o carregamento do arquivo.');
          return false;
        }
        const file = upload.get();
        if (!file) {
          modalError('Selecione um arquivo PDF, PNG ou JPG de até 5MB.');
          return false;
        }
        const data = new FormData(form);
        const next = {
          id: row?.id || crypto.randomUUID(),
          name: row?.name || file.name,
          status: '',
          type: String(data.get('type')),
          date: String(data.get('date')),
          fileName: file.name,
          fileData: file.data,
        };
        if (renewing && next.date < new Date().toLocaleDateString('en-CA')) {
          modalError('Escolha uma data de vencimento futura.');
          return false;
        }
        if (!(row ? update(row, next) : persistRows([next, ...rows]))) {
          modalError('Não foi possível salvar o arquivo. Verifique o espaço disponível.');
          return false;
        }
        announce('Documento salvo com sucesso!');
        return true;
      },
    );
    upload = setupUpload(query('.modal-content'));
    disposeUpload = upload.dispose;
  }
  function renderAccounting(): void {
    body.innerHTML = `<form class="form-card accounting-form" novalidate><h2>Registrar Lançamento Financeiro</h2><div class="form-grid">${selectField('project', 'Projeto Social', projects)}<div class="field"><span>Tipo de Lançamento</span><div class="segment" role="group" aria-label="Tipo de Lançamento"><label><input type="radio" name="type" value="Receita" checked>Receita</label><label><input type="radio" name="type" value="Despesa">Despesa</label></div></div>${inputField('name', 'Descrição do Lançamento', '', 'text', 'required maxlength="200" placeholder="Ex: Aquisição de livros infantis..."')}${inputField('value', 'Valor (R$)', '0,00', 'text', 'required inputmode="decimal"')}${inputField('date', 'Data do Fato Gerador', '', 'date', 'required')}<div class="field"><span>Comprovante / Recibo</span>${uploadMarkup}</div></div><div class="form-bottom"><button class="primary" type="submit">Registrar Lançamento</button></div></form>${tableMarkup()}`;
    const form = query<HTMLFormElement>('.accounting-form');
    const upload = setupUpload(form);
    abort.signal.addEventListener('abort', upload.dispose, { once: true });
    const amount = form.elements.namedItem('value') as HTMLInputElement;
    amount.addEventListener(
      'input',
      () => {
        amount.value = amount.value.replace(/[^\d.,]/g, '');
        amount.setCustomValidity('');
      },
      options,
    );
    amount.addEventListener(
      'blur',
      () => {
        const value = parseMoney(amount.value);
        if (Number.isFinite(value))
          amount.value = value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
      },
      options,
    );
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        const value = parseMoney(amount.value);
        amount.setCustomValidity(
          !Number.isFinite(value) || value <= 0 ? 'Informe um valor maior que zero.' : '',
        );
        if (!validate(form)) return;
        if (upload.pending()) {
          announce('Aguarde a leitura do comprovante.', true);
          return;
        }
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
        const file = upload.get();
        if (
          persistRows([
            {
              id: crypto.randomUUID(),
              name: data['name'].trim(),
              type: data['type'],
              project: data['project'],
              date: data['date'],
              value,
              status: 'Em análise',
              fileName: file?.name || '',
              fileData: file?.data || '',
            },
            ...rows,
          ])
        ) {
          form.reset();
          upload.clear();
          announce('Lançamento registrado com sucesso!');
        }
      },
      options,
    );
  }
  function renderReports(): void {
    body.innerHTML =
      kpis(true) +
      `<section class="charts" aria-label="Gráficos de desempenho"><figure class="chart-card"><figcaption>Arrecadação Mensal (Últimos 6 Meses)</figcaption><div class="bar-chart" role="img" aria-label="Abril: R$ 3.100; Maio: R$ 5.200; Junho: R$ 4.500; Julho: R$ 7.800; Agosto: R$ 8.900; Setembro: R$ 11.200"><div class="y-axis"><span>12K</span><span>9K</span><span>6K</span><span>3K</span><span>0</span></div><div class="bars">${revenue.map((value, i) => `<div class="bar" tabindex="0" style="--height:${value / 120}%" title="${months[i]}: ${money(value)}" aria-label="${months[i]}: ${money(value)}"><span class="value">${value.toLocaleString('pt-BR')}</span><span class="month">${months[i]}</span></div>`).join('')}</div></div></figure><figure class="chart-card"><figcaption>Distribuição por Categoria</figcaption><svg class="donut" viewBox="0 0 160 160" role="img" aria-label="Alimentação e Cozinha 50%; Livros e Educação 28%; Infraestrutura e Espaço 22%"><g transform="rotate(-90 80 80)">${[
        ['#0259e1', 50, 0, 'Alimentação & Cozinha'],
        ['#05bf97', 28, 50, 'Livros & Educação'],
        ['#08c4e7', 22, 78, 'Infraestrutura & Espaço'],
      ]
        .map(
          ([color, value, offset, label]) =>
            `<circle tabindex="0" cx="80" cy="80" r="60" fill="none" stroke="${color}" stroke-width="30" pathLength="100" stroke-dasharray="${value} ${100 - Number(value)}" stroke-dashoffset="-${offset}"><title>${esc(label)}: ${value}% · ${money((45200 * Number(value)) / 100)}</title></circle>`,
        )
        .join('')}</g></svg><ul class="legend">${[
        ['#0259e1', 'Alimentação & Cozinha', 50],
        ['#05bf97', 'Livros & Educação', 28],
        ['#08c4e7', 'Infraestrutura & Espaço', 22],
      ]
        .map(
          ([color, label, value]) =>
            `<li><i style="--dot:${color}"></i>${esc(label)}<strong>${value}%</strong></li>`,
        )
        .join('')}</ul></figure></section>`;
  }
  function renderSettings(): void {
    const notificationLabels = [
      'Novas doações recebidas',
      'Novas inscrições de voluntários nas vagas',
      'Atualizações e novos recursos da plataforma',
      'Relatórios e resumos mensais de impacto',
    ];
    const displayLabels = [
      'Perfil público visível no buscador',
      'Aceitar doações financeiras online',
      'Aceitar novos voluntários nos projetos ativos',
    ];
    let preferences: Record<string, boolean> = {};
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (saved && !Array.isArray(saved) && typeof saved === 'object') preferences = saved;
    } catch {
      /* Defaults remain usable. */
    }
    const switches = (labels: string[], prefix: string) =>
      `<div class="switch-list">${labels
        .map((label, i) => {
          const key = prefix + i;
          const checked =
            typeof preferences[key] === 'boolean'
              ? preferences[key]
              : !(prefix === 'notification' && i === 2);
          return `<label class="switch-label"><input type="checkbox" role="switch" data-preference="${key}" ${checked ? 'checked' : ''}><span class="switch" aria-hidden="true"></span>${label}</label>`;
        })
        .join('')}</div>`;
    body.innerHTML = `<section class="settings-card"><h2>Dados da Conta</h2><div class="account-row">${inputField('email', 'E-mail de acesso', context.email, 'email', 'readonly')}<button data-settings="password">Alterar Senha</button></div></section><section class="settings-card"><h2>Notificações por E-mail</h2>${switches(notificationLabels, 'notification')}</section><section class="settings-card"><h2>Preferências de Exibição</h2>${switches(displayLabels, 'display')}</section><section class="settings-card danger-zone"><div><h2>Zona de Perigo</h2><p>A exclusão ou desativação da sua conta é permanente e apagará todos os dados de voluntários e doações.</p></div><button data-settings="deactivate">Desativar conta</button></section>`;
    body.addEventListener(
      'change',
      (event) => {
        const input = event.target as HTMLInputElement;
        const key = input.dataset['preference'];
        if (!key) return;
        const next = { ...preferences, [key]: input.checked };
        if (write(storageKey, next)) {
          preferences = next;
          console.info(input.closest('label')!.textContent?.trim(), input.checked);
          announce('Preferência salva.');
        } else input.checked = !input.checked;
      },
      options,
    );
  }
  function settingsAction(actionName: string): void {
    if (actionName === 'password') {
      const passwordField = (name: string, label: string) =>
        `<label class="field">${label}<span class="password-wrap"><input name="${name}" type="password" required ${name === 'current' ? 'autocomplete="current-password"' : 'minlength="8" autocomplete="new-password"'}><button type="button" data-eye="${name}" aria-label="Mostrar ${label.toLowerCase()}" aria-pressed="false">Mostrar</button></span><span class="validation-error" hidden></span></label>`;
      openModal(
        'Alterar Senha',
        passwordField('current', 'Senha atual') +
          passwordField('next', 'Nova senha') +
          passwordField('confirmation', 'Confirmar nova senha'),
        'Salvar nova senha',
        (form) => {
          const data = new FormData(form);
          if (data.get('next') !== data.get('confirmation')) {
            modalError('A confirmação deve coincidir com a nova senha.');
            return false;
          }
          const result = context.changePassword(
            String(data.get('current')),
            String(data.get('next')),
          );
          if (result) {
            modalError(result);
            return false;
          }
          announce('Senha alterada com sucesso!');
          return true;
        },
      );
    } else {
      openModal(
        'Desativar conta da organização',
        `<p>⚠ Esta ação é irreversível. Todos os dados de voluntários, doações e projetos serão permanentemente apagados. Digite 'DESATIVAR' para confirmar.</p>${inputField('confirmation', 'Confirmação', '', 'text', 'required autocomplete="off"')}`,
        'Confirmar desativação',
        (form) => {
          if (new FormData(form).get('confirmation') !== 'DESATIVAR') return false;
          const keys = Object.keys(localStorage).filter(
            (key) =>
              key.startsWith(`movune:ong:${context.owner}:`) ||
              key === `movune:project-settings:${context.owner}` ||
              key === `movune:project-draft:${context.owner}`,
          );
          const activities = JSON.parse(localStorage.getItem('movune:atividades') || '[]');
          if (Array.isArray(activities))
            localStorage.setItem(
              'movune:atividades',
              JSON.stringify(
                activities.filter(
                  (record: { ownerId?: string }) => record.ownerId !== context.owner,
                ),
              ),
            );
          keys.forEach((key) => localStorage.removeItem(key));
          context.deactivate();
          return true;
        },
        true,
      );
      const confirm = query<HTMLButtonElement>('[data-confirm]');
      confirm.disabled = true;
      query<HTMLInputElement>('.modal-content input').addEventListener(
        'input',
        (event) => {
          confirm.disabled = (event.target as HTMLInputElement).value !== 'DESATIVAR';
        },
        options,
      );
    }
  }
  function download(content: string, filename: string, mime: string): void {
    const url = URL.createObjectURL(new Blob(['\ufeff', content], { type: mime }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportReport(format: string): void {
    if (format === 'pdf') {
      window.print();
      announce('Relatório pronto para imprimir ou salvar como PDF.');
      return;
    }
    const data = [
      ['Indicador', 'Valor'],
      ['Total Arrecadado', 45200],
      ['Voluntários Ativos', 23],
      ['Projetos Ativos', 5],
      ['Impacto Estimado', 1200],
      [],
      ['Mês', 'Arrecadação'],
      ...months.map((month, i) => [month, revenue[i]]),
      [],
      ['Categoria', 'Porcentagem'],
      ['Alimentação & Cozinha', 50],
      ['Livros & Educação', 28],
      ['Infraestrutura & Espaço', 22],
    ];
    if (format === 'excel') {
      const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Relatório"><Table>${data.map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="${typeof cell === 'number' ? 'Number' : 'String'}">${esc(cell)}</Data></Cell>`).join('')}</Row>`).join('')}</Table></Worksheet></Workbook>`;
      download(xml, 'relatorio-movune.xls', 'application/vnd.ms-excel');
    } else
      download(
        data.map((row) => row.map(csvCell).join(';')).join('\r\n'),
        'relatorio-movune.csv',
        'text/csv;charset=utf-8',
      );
    announce('Download iniciado.');
  }
  if (kind === 'configuracoes') renderSettings();
  else if (kind === 'relatorios') renderReports();
  else if (kind === 'prestacao') renderAccounting();
  else if (kind === 'documentos')
    body.innerHTML =
      '<section class="table-card documents-grid" role="table" aria-label="Documentos da organização"></section>';
  else
    body.innerHTML =
      (kind === 'doacoes' ? kpis() : '') +
      (kind === 'voluntarios'
        ? `<div class="chips" role="group" aria-label="Filtrar por interesse"><strong>Filtros:</strong>${['Todos os Status', 'Educação', 'Tecnologia', 'Comunicação'].map((label, i) => `<button data-filter="${i ? label : ''}" class="${i ? '' : 'selected'}" aria-pressed="${!i}">${label}</button>`).join('')}</div>`
        : '') +
      tableMarkup();
  renderRows();
  animateMetrics();
  root.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element;
      const filter = target.closest<HTMLButtonElement>('[data-filter]');
      if (filter) {
        const value = filter.dataset['filter']!;
        if (!value) selected.clear();
        else if (kind === 'voluntarios') {
          if (selected.has(value)) selected.delete(value);
          else selected.add(value);
        } else selected = new Set([value]);
        root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
          const active = button.dataset['filter']
            ? selected.has(button.dataset['filter']!)
            : !selected.size;
          button.classList.toggle('selected', active);
          button.setAttribute('aria-pressed', String(active));
        });
        renderRows();
      }
      const sort = target.closest<HTMLButtonElement>('[data-sort]');
      if (sort) {
        const key = sort.dataset['sort']!;
        direction = sortKey === key ? -direction : 1;
        sortKey = key;
        root.querySelectorAll('[aria-sort]').forEach((el) => el.setAttribute('aria-sort', 'none'));
        sort.closest('th')!.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
        renderRows();
      }
      const eye = target.closest<HTMLButtonElement>('[data-eye]');
      if (eye) {
        const input = modalForm.elements.namedItem(eye.dataset['eye']!) as HTMLInputElement;
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        eye.textContent = visible ? 'Ocultar' : 'Mostrar';
        eye.setAttribute('aria-pressed', String(visible));
        eye.setAttribute('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
      }
      const settings = target.closest<HTMLButtonElement>('[data-settings]');
      if (settings) settingsAction(settings.dataset['settings']!);
      const exportButton = target.closest<HTMLButtonElement>('[data-export]');
      if (exportButton) exportReport(exportButton.dataset['export']!);
      if (target.closest('[data-action="new"]')) {
        if (kind === 'vagas' || kind === 'eventos')
          context.navigate(`/ong/${kind}/${kind === 'vagas' ? 'nova' : 'novo'}`);
        else if (kind === 'documentos') openDocument();
        else if (kind === 'prestacao') {
          query('.accounting-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
          query<HTMLInputElement>('.accounting-form [name="name"]').focus({ preventScroll: true });
        }
      }
      const button = target.closest<HTMLButtonElement>('[data-row-action]');
      if (!button) return;
      const row = rows.find((item) => item.id === button.dataset['id']);
      if (!row) return;
      switch (button.dataset['rowAction']) {
        case 'edit':
          context.navigate(`/ong/${kind}/editar/${encodeURIComponent(row.id)}`);
          break;
        case 'close':
          confirmChange(
            row,
            'Encerrar vaga',
            'Tem certeza que deseja encerrar esta vaga?',
            'Encerrada',
            'Encerrar',
          );
          break;
        case 'reopen':
          confirmChange(row, 'Reabrir vaga', 'Deseja reabrir esta vaga?', 'Aberta', 'Reabrir');
          break;
        case 'approve':
          confirmChange(
            row,
            'Aprovar inscrição',
            `Deseja aprovar ${row.name} como voluntário(a)?`,
            'Ativo',
            'Aprovar',
          );
          break;
        case 'reject':
          confirmChange(
            row,
            'Rejeitar inscrição',
            `Deseja rejeitar a inscrição de ${row.name}?`,
            'Rejeitado',
            'Rejeitar',
            true,
            true,
          );
          break;
        case 'reactivate':
          confirmChange(
            row,
            'Reativar voluntário',
            `Deseja reativar ${row.name}?`,
            'Ativo',
            'Reativar',
          );
          break;
        case 'cancel':
          confirmChange(
            row,
            'Cancelar evento',
            `Tem certeza que deseja cancelar o evento '${row.name}'? Esta ação não poderá ser desfeita.`,
            'Cancelado',
            'Cancelar evento',
            true,
          );
          break;
        case 'publish':
          confirmChange(
            row,
            'Publicar evento',
            `Deseja publicar o evento '${row.name}'? Ele ficará visível para todos os usuários.`,
            'Aberto',
            'Publicar',
          );
          break;
        case 'profile':
          context.navigate(`/voluntario/${encodeURIComponent(row.id)}/perfil`);
          break;
        case 'message':
          openModal(
            `Mensagem para ${row.name}`,
            '<label class="field">Mensagem<textarea name="message" required maxlength="2000"></textarea><span class="validation-error" hidden></span></label>',
            'Enviar',
            (form) => {
              const key = `movune:ong:${context.owner}:mensagens`;
              let messages: unknown[] = [];
              try {
                const saved = JSON.parse(localStorage.getItem(key) || '[]');
                if (Array.isArray(saved)) messages = saved;
              } catch {
                /* Start a new local message history. */
              }
              if (
                !write(key, [
                  ...messages,
                  {
                    to: row.id,
                    message: String(new FormData(form).get('message')).trim(),
                    createdAt: new Date().toISOString(),
                  },
                ])
              ) {
                modalError('Não foi possível salvar a mensagem.');
                return false;
              }
              announce(
                'Mensagem registrada no navegador. O envio externo ainda não está conectado.',
              );
              return true;
            },
          );
          break;
        case 'detail':
          openModal(
            'Detalhes da doação',
            `<p><strong>${esc(row.name)}</strong></p><p>${esc(row['type'])} · ${typeof row['value'] === 'number' ? money(row['value']) : esc(row['value'])}</p><p>Destino: ${esc(row['project'])}<br>Data: ${dateLabel(String(row['date']), true)}<br>Status: ${esc(row.status)}</p><p>Método de pagamento, comprovante e mensagem não informados.</p>`,
            row.status === 'Pendente' ? 'Confirmar recebimento' : 'Fechar',
            row.status === 'Pendente'
              ? () => {
                  if (!update(row, { status: 'Confirmada' })) {
                    modalError('Não foi possível salvar.');
                    return false;
                  }
                  announce('Doação confirmada.');
                  return true;
                }
              : undefined,
          );
          break;
        case 'renew':
          openDocument(row);
          break;
        case 'download': {
          if (
            typeof row['fileData'] === 'string' &&
            /^data:(application\/pdf|image\/(png|jpeg));base64,/.test(row['fileData'])
          ) {
            const link = document.createElement('a');
            link.href = row['fileData'];
            link.download = String(row['fileName'] || row.name);
            document.body.append(link);
            link.click();
            link.remove();
            announce('Download iniciado.');
          } else {
            console.info('Download simulado:', row.name);
            announce('Documento de exemplo. Envie um arquivo para habilitar o download.');
          }
          break;
        }
      }
    },
    options,
  );
  if ((kind === 'vagas' || kind === 'eventos') && /\/(nova|novo)(?:[?#]|$)/.test(context.path))
    openEditor();
  const editId = context.path.match(/\/editar\/([^/?#]+)/)?.[1];
  if (editId && (kind === 'vagas' || kind === 'eventos')) {
    const row = rows.find((item) => item.id === decodeURIComponent(editId));
    if (row) openEditor(row);
    else announce('Registro não encontrado.', true);
  }
  const volunteerId = context.path.match(/^\/voluntario\/([^/]+)\/perfil/)?.[1];
  if (kind === 'voluntarios' && volunteerId) {
    const row = rows.find((item) => item.id === decodeURIComponent(volunteerId));
    if (row)
      openModal(
        row.name,
        `<p>Área de interesse: ${esc(row['interest'])}</p><p>Disponibilidade: ${esc(row['availability'])}</p><p>Status: ${esc(row.status)}</p>`,
        'Fechar',
      );
    else announce('Voluntário não encontrado.', true);
  }
  return () => {
    abort.abort();
    observer?.disconnect();
    frames.forEach((id) => cancelAnimationFrame(id));
    disposeUpload?.();
    dialog.close();
  };
}
