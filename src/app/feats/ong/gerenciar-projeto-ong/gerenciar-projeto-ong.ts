import { Component, ElementRef, DestroyRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OngShell } from '../../../components/ong-shell/ong-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

type Status = 'ongoing' | 'completed' | 'draft';
interface Project { id: string; name: string; goal: number; raised: number; days: number | null; status: Status; featured?: boolean; }
const labels: Record<Status, string> = { ongoing: 'Em andamento', completed: 'Concluído', draft: 'Rascunho' };
export const exampleProjects: Project[] = [
  { id: 'biblioteca-de-bairro', name: 'Biblioteca de bairro', goal: 25000, raised: 12400, days: 60, status: 'ongoing' },
  { id: 'cozinha-solidaria', name: 'Cozinha solidária', goal: 15000, raised: 15000, days: null, status: 'completed' },
  { id: 'saude-na-comunidade', name: 'Saúde na comunidade', goal: 30000, raised: 18500, days: 30, status: 'ongoing' },
  { id: 'horta-escola', name: 'Horta escola', goal: 10000, raised: 3800, days: 90, status: 'ongoing' },
];

@Component({
  selector: 'app-gerenciar-projeto-ong',
  imports: [OngShell],
  templateUrl: './gerenciar-projeto-ong.html',
  styleUrl: './gerenciar-projeto-ong.css',
  // Native DOM rows need selectors independent of Angular template attributes.
  // Every rule is scoped to app-gerenciar-projeto-ong in the stylesheet.
  encapsulation: ViewEncapsulation.None,
})
export class GerenciarProjetoOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly auth = inject(AuthStore);
  private readonly activity = inject(SiteActivityStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);

  constructor() { afterNextRender(() => this.initialize()); }

  private initialize(): void {
    const root = this.host.nativeElement;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const body = root.querySelector('tbody')!;
    const feedback = root.querySelector<HTMLElement>('.feedback')!;
    const storageKey = 'movune:project-settings:' + (this.auth.session()?.id ?? 'demo');
    let settings: Record<string, Partial<Project>> = {};
    const announce = (message: string) => { feedback.textContent = message; feedback.hidden = false; };
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) settings = saved as typeof settings;
    } catch { announce('Não foi possível carregar as preferências salvas.'); }
    const parseMoney = (value = '') => {
      const clean = value.replace(/[^0-9.,]/g, '');
      const number = Number(clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean.replace(/\.(?=\d{3}(?:\.|$))/g, ''));
      return Number.isFinite(number) ? number : 0;
    };
    const registered: Project[] = this.activity.byType('projeto')
      .filter(record => record.ownerId === this.auth.session()?.id && !!record.ownerId)
      .map(record => {
        const statusText = record.status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const deadline = record.fields['Prazo'] || '';
        const date = /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? new Date(deadline + 'T00:00:00').getTime() : NaN;
        return {
          id: record.id, name: record.fields['Nome do projeto'] || record.pageTitle,
          goal: parseMoney(record.fields['Meta financeira']), raised: parseMoney(record.fields['Arrecadado']),
          days: Number.isFinite(date) ? Math.max(0, Math.ceil((date - Date.now()) / 86400000)) : /^\d+(\s*dias?)?$/i.test(deadline) ? parseInt(deadline) : null,
          status: statusText.includes('conclu') ? 'completed' : statusText.includes('rascunho') ? 'draft' : 'ongoing',
        };
      });
    const projects: Project[] = [...registered, ...exampleProjects.map(project => ({ ...project }))].map(project => {
      const saved = settings[project.id];
      if (!saved || typeof saved !== 'object') return project;
      return {
        ...project,
        name: typeof saved.name === 'string' && saved.name.trim() ? saved.name : project.name,
        goal: typeof saved.goal === 'number' && Number.isFinite(saved.goal) && saved.goal > 0 ? saved.goal : project.goal,
        days: typeof saved.days === 'number' && Number.isInteger(saved.days) && saved.days >= 0 ? saved.days : project.days,
        status: saved.status && Object.hasOwn(labels, saved.status) ? saved.status : project.status,
        featured: saved.featured === true,
      };
    });
    const persist = (project: Project, change: Partial<Project>): boolean => {
      const updated = { ...settings, [project.id]: { ...settings[project.id], ...change } };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        settings = updated;
        Object.assign(project, change);
        return true;
      } catch { announce('Não foi possível salvar. Verifique o armazenamento do navegador e tente novamente.'); return false; }
    };
    let filter = 'all';
    let sort: keyof Project | '' = '';
    let direction = 1;
    const currency = (value: number) => 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    const link = (text: string, href: string, className: string) => {
      const element = document.createElement('a');
      element.textContent = text; element.href = href; element.className = className; element.dataset['route'] = '';
      return element;
    };
    const render = () => {
      const visible = projects.filter(project => filter === 'all' || project.status === filter);
      if (sort) {
        const key = sort;
        visible.sort((a, b) => {
          const value = (project: Project) => key === 'status' ? labels[project.status]
            : key === 'days' && project.status === 'completed' ? null : project[key];
          const left = value(a), right = value(b);
          if (left === null) return right === null ? 0 : 1;
          if (right === null) return -1;
          return direction * (typeof left === 'number' && typeof right === 'number'
            ? left - right : String(left).localeCompare(String(right), 'pt-BR', { sensitivity: 'base', numeric: true }));
        });
      }
      body.replaceChildren();
      visible.forEach(project => {
        const row = document.createElement('tr'); row.dataset['id'] = project.id;
        const name = document.createElement('th'); name.scope = 'row'; name.dataset['label'] = 'Projeto'; name.textContent = project.name; row.append(name);
        const cell = (label: string, text: string, className = '') => {
          const element = document.createElement('td'); element.dataset['label'] = label; element.textContent = text; element.className = className; row.append(element); return element;
        };
        cell('Meta', currency(project.goal));
        cell('Arrecadado', currency(project.raised), 'raised' + (project.goal > 0 && project.raised >= project.goal ? ' goal-met' : ''));
        cell('Prazo', project.status === 'completed' || project.days === null ? '—' : project.days + ' dias', 'deadline');
        const badge = document.createElement('span'); badge.className = 'status ' + project.status; badge.textContent = labels[project.status]; cell('Status', '').append(badge);
        const actions = document.createElement('div'); actions.className = 'row-actions';
        if (project.status === 'completed') {
          actions.append(link('Ver relatório', '/ong/relatorios?projeto=' + encodeURIComponent(project.id), 'report-action'));
        } else {
          actions.append(link('Editar', '/ong/projetos/' + encodeURIComponent(project.id) + '/editar', 'edit-action'));
          const feature = document.createElement('button'); feature.type = 'button';
          feature.dataset['feature'] = project.id; feature.setAttribute('aria-pressed', String(!!project.featured));
          feature.textContent = project.featured ? 'Destacado' : 'Destacar';
          feature.setAttribute('aria-label', (project.featured ? 'Remover destaque de ' : 'Destacar ') + project.name);
          actions.append(feature);
        }
        cell('Ações', '').append(actions);
        body.append(row);
      });
      root.querySelector<HTMLElement>('.empty-state')!.hidden = visible.length > 0;
      root.querySelector<HTMLElement>('.table-scroll')!.hidden = visible.length === 0;
      root.querySelector('.result-status')!.textContent = visible.length + ' projetos encontrados';
    };
    root.addEventListener('click', event => {
      const target = event.target as Element;
      const tab = target.closest<HTMLButtonElement>('[data-filter]');
      if (tab) {
        filter = tab.dataset['filter']!;
        root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
          button.classList.toggle('active', button === tab);
          button.setAttribute('aria-pressed', String(button === tab));
        }); render();
      }
      const header = target.closest<HTMLButtonElement>('[data-sort]');
      if (header) {
        const key = header.dataset['sort'] as keyof Project;
        direction = sort === key ? -direction : 1; sort = key;
        root.querySelectorAll('[aria-sort]').forEach(cell => { cell.setAttribute('aria-sort', 'none'); cell.querySelector('.sort-arrow')!.textContent = '↕'; });
        header.closest('th')!.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
        header.querySelector('.sort-arrow')!.textContent = direction === 1 ? '↑' : '↓'; render();
      }
      const button = target.closest<HTMLButtonElement>('[data-feature]');
      if (button) {
        const project = projects.find(item => item.id === button.dataset['feature'])!;
        if (persist(project, { featured: !project.featured })) {
          announce(project.featured ? project.name + ' está em destaque.' : 'Destaque removido de ' + project.name + '.');
          render();
          body.querySelector<HTMLButtonElement>('[data-feature="' + project.id + '"]')?.focus();
        }
      }
    }, options);
    const media = window.matchMedia('(max-width: 768px)');
    const responsive = () => root.querySelector('.table-scroll')!.setAttribute('tabindex', media.matches ? '-1' : '0');
    responsive(); media.addEventListener('change', responsive, options);
    render();
    const editId = this.route.snapshot.paramMap.get('id');
    if (editId) {
      root.querySelector<HTMLElement>('.projects-view')!.hidden = true;
      root.querySelector<HTMLElement>('.project-editor')!.hidden = false;
      const project = projects.find(item => item.id === editId);
      const form = root.querySelector<HTMLFormElement>('.editor-form')!;
      if (!project) { form.hidden = true; root.querySelector<HTMLElement>('.missing-project')!.hidden = false; }
      else {
        const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
        field('name').value = project.name; field('goal').value = String(project.goal);
        field('days').value = String(project.days ?? 0); field('status').value = project.status;
        form.addEventListener('submit', event => {
          event.preventDefault();
          field('name').setCustomValidity(field('name').value.trim() ? '' : 'Informe o nome do projeto.');
          if (!form.reportValidity()) return;
          if (persist(project, { name: field('name').value.trim(), goal: Number(field('goal').value), days: Number(field('days').value), status: field('status').value as Status })) {
            void this.router.navigateByUrl('/ong/projetos');
          }
        }, options);
        field('name').addEventListener('input', () => field('name').setCustomValidity(''), options);
      }
    }
    this.destroy.onDestroy(() => controller.abort());
  }
}
