import { Component } from '@angular/core';

import { HomeContent } from '../../../components/home-content/home-content';

@Component({
  selector: 'app-home',
  imports: [HomeContent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  /* Conteúdo da Home anterior, preservado para possível reutilização.
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
  */
}
