import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAreaShell } from '../../../components/user-area-shell/user-area-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

type Category = 'ongs' | 'projetos' | 'vagas' | 'eventos';
interface Favorite {
  id: string; type: Category; name: string; image: string; href: string;
  category?: string; location?: string; ong?: string; amount?: string; progress?: number;
}
const SAMPLES: Favorite[] = [
  { id: 'demo-rede', type: 'ongs', name: 'Rede Cuidar', category: 'Saúde', location: 'São Paulo - SP', image: '/card-image.png', href: '/perfil-ong' },
  { id: 'demo-instituto', type: 'ongs', name: 'Instituto Aprender', category: 'Educação', location: 'Belo Horizonte - MG', image: '/card-image (1).png', href: '/perfil-ong' },
  { id: 'demo-biblioteca', type: 'projetos', name: 'Biblioteca de bairro', ong: 'Instituto Aprender', amount: 'R$ 9.450', progress: 63, image: '/card-image (3).png', href: '/detalhes-projeto' },
  { id: 'demo-horta', type: 'projetos', name: 'Horta escola', ong: 'Casa Verde Viva', amount: 'R$ 7.100', progress: 89, image: '/card-image (5).png', href: '/detalhes-projeto' },
];

@Component({
  selector: 'app-favoritos',
  imports: [UserAreaShell, RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);
  readonly tabs = [
    { id: 'ongs' as const, label: 'ONGs' }, { id: 'projetos' as const, label: 'Projetos' },
    { id: 'vagas' as const, label: 'Vagas' }, { id: 'eventos' as const, label: 'Eventos' },
  ];
  readonly activeTab = signal<Category>('ongs');
  readonly removing = signal<string[]>([]);
  readonly removed = signal<string[]>([]);
  readonly announcement = signal('');
  readonly favorites = computed(() => {
    const saved: Favorite[] = this.activity.byType('favorito')
      .filter(record => !!this.auth.session() && record.ownerId === this.auth.session()?.id)
      .map(record => {
        const href = record.fields['Link'] || '/ongs';
        const type: Category = /vaga|voluntari/.test(href) ? 'vagas' : /evento/.test(href) ? 'eventos' : /projeto|doac/.test(href) ? 'projetos' : 'ongs';
        return { id: record.id, type, name: record.fields['Titulo'] || record.pageTitle,
          category: record.fields['Categoria'], image: '/card-image.png', href };
      });
    return [...saved, ...SAMPLES.filter(sample => !saved.some(item => item.name.toLowerCase() === sample.name.toLowerCase()))]
      .filter(item => !this.removed().includes(item.id));
  });
  readonly sections = computed(() => {
    const types: Category[] = this.activeTab() === 'ongs' ? ['ongs', 'projetos'] : [this.activeTab()];
    const titles = { ongs: 'ONGs Favoritas', projetos: 'Projetos Favoritos', vagas: 'Vagas Favoritas', eventos: 'Eventos Favoritos' };
    const empty = { ongs: 'Nenhuma ONG favorita ainda', projetos: 'Nenhum projeto favorito ainda', vagas: 'Nenhum favorito nesta categoria', eventos: 'Nenhum favorito nesta categoria' };
    return types.map(type => ({ type, title: titles[type], empty: empty[type], cards: this.favorites().filter(item => item.type === type) }));
  });

  changeTab(event: KeyboardEvent, index: number): void {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + this.tabs.length - 1) % this.tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = this.tabs.length - 1;
    else return;
    event.preventDefault();
    this.activeTab.set(this.tabs[next].id);
    const target = event.currentTarget as HTMLElement;
    (target.parentElement?.children[next] as HTMLElement)?.focus();
  }

  remove(card: Favorite): void {
    if (this.removing().includes(card.id) || !globalThis.confirm('Remover dos favoritos?')) return;
    this.removing.update(ids => [...ids, card.id]);
    setTimeout(() => {
      this.activity.remove(card.id);
      const matchingSample = SAMPLES.find(item => item.name.toLowerCase() === card.name.toLowerCase());
      this.removed.update(ids => [...ids, card.id, ...(matchingSample ? [matchingSample.id] : [])]);
      this.removing.update(ids => ids.filter(id => id !== card.id));
      this.announcement.set(card.name + ' removido dos favoritos.');
    }, 200);
  }
}
