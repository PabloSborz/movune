import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FeaturePage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly page = PAGE_CONTENT.home;

  readonly summaries = [
    {
      id: 'ongs',
      eyebrow: 'Encontre uma causa',
      title: 'Conheça as ONGs',
      description:
        'Explore organizações por causa, localização e verificação antes de escolher onde participar.',
      highlights: ['Causas sociais', 'Projetos ativos', 'Perfis verificados'],
      actionLabel: 'Explorar ONGs',
      actionPath: '/ongs',
    },
    {
      id: 'projetos',
      eyebrow: 'Apoie uma iniciativa',
      title: 'Escolha um projeto',
      description:
        'Compare metas, necessidades e resultados esperados para apoiar uma campanha com clareza.',
      highlights: ['Metas visiveis', 'Doacao financeira ou material', 'Prestacao de contas'],
      actionLabel: 'Ver projetos',
      actionPath: '/projetos',
    },
    {
      id: 'voluntariado',
      eyebrow: 'Doe seu tempo',
      title: 'Seja voluntário',
      description:
        'Encontre vagas presenciais ou remotas que combinam com seu tempo e suas habilidades.',
      highlights: ['Vagas por habilidade', 'Presencial ou remoto', 'Inscrição organizada'],
      actionLabel: 'Encontrar vagas',
      actionPath: '/voluntariado',
    },
  ];
}
