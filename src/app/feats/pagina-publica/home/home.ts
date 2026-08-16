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
      id: 'como-funciona',
      eyebrow: 'Jornada dentro da plataforma',
      title: 'Como funciona',
      description:
        'A Movune organiza ONGs, projetos, eventos, vagas e doacoes em um fluxo simples para quem quer ajudar ou divulgar uma causa.',
      highlights: ['Descubra causas', 'Compare oportunidades', 'Acompanhe cada contribuicao'],
      actionLabel: 'Ver como funciona',
      actionPath: '/como-funciona',
    },
    {
      id: 'ongs',
      eyebrow: 'Catalogo de organizacoes',
      title: 'ONGs',
      description:
        'Encontre organizacoes por causa, cidade e status de verificacao, com acesso rapido a contatos e projetos ativos.',
      highlights: ['Rede Cuidar', 'Instituto Aprender', 'Casa Verde Viva'],
      actionLabel: 'Ver pagina de ONGs',
      actionPath: '/ongs',
    },
    {
      id: 'projetos',
      eyebrow: 'Campanhas sociais',
      title: 'Projetos',
      description:
        'Veja campanhas abertas para doacao, metas financeiras, necessidades materiais e resultados esperados.',
      highlights: ['Biblioteca de bairro', 'Cozinha solidaria', 'Horta escola'],
      actionLabel: 'Ver projetos completos',
      actionPath: '/projetos',
    },
    {
      id: 'voluntariado',
      eyebrow: 'Tempo e habilidades',
      title: 'Voluntariado',
      description:
        'Resumo das vagas presenciais, remotas e hibridas para quem quer contribuir com conhecimento ou apoio operacional.',
      highlights: ['Mentoria de carreira', 'Organizacao de evento', 'Comunicacao digital'],
      actionLabel: 'Ver vagas completas',
      actionPath: '/voluntariado',
    },
    {
      id: 'eventos',
      eyebrow: 'Agenda social',
      title: 'Eventos',
      description:
        'Acompanhe mutiroes, oficinas e campanhas das ONGs sem sair da Home, com datas e formas de participacao.',
      highlights: ['Mutirao de arrecadacao', 'Oficina financeira', 'Encontro de parceiros'],
      actionLabel: 'Ver agenda completa',
      actionPath: '/eventos',
    },
    {
      id: 'doacoes',
      eyebrow: 'Apoio financeiro e material',
      title: 'Doacoes',
      description:
        'Escolha como apoiar: Pix, materiais, servicos ou doacoes recorrentes vinculadas a campanhas verificadas.',
      highlights: ['Doacao por projeto', 'Doacao material', 'Acompanhamento do impacto'],
      actionLabel: 'Registrar doacao',
      actionPath: '/doacoes',
    },
    {
      id: 'impacto',
      eyebrow: 'Resultado das acoes',
      title: 'Impacto',
      description:
        'Veja uma leitura rapida do alcance das campanhas, pessoas atendidas, recursos mobilizados e acoes em andamento.',
      highlights: [
        '2.4 mil pessoas atendidas',
        '89 campanhas acompanhadas',
        '36 bairros impactados',
      ],
      actionLabel: 'Ver transparencia',
      actionPath: '/#transparencia',
    },
    {
      id: 'parceiros',
      eyebrow: 'Apoio institucional',
      title: 'Parceiros',
      description:
        'Empresas, coletivos e apoiadores podem fortalecer campanhas com recursos, espacos, servicos e divulgacao.',
      highlights: [
        'Empresas apoiadoras',
        'Parcerias por causa',
        'Beneficios para projetos sociais',
      ],
      actionLabel: 'Ver parceiros',
      actionPath: '/empresas-parceiras',
    },
    {
      id: 'transparencia',
      eyebrow: 'Prestacao de contas',
      title: 'Transparencia',
      description:
        'Resumo dos valores arrecadados, despesas, comprovantes e indicadores de impacto publicados na plataforma.',
      highlights: ['R$ 860k mobilizados', '412 comprovantes', 'Relatorios por campanha'],
      actionLabel: 'Ver transparencia completa',
      actionPath: '/transparencia',
    },
    {
      id: 'suporte',
      eyebrow: 'Ajuda e relacionamento',
      title: 'Suporte',
      description:
        'Encontre caminhos para tirar duvidas, falar com a equipe, entender regras de uso e receber orientacao sobre a plataforma.',
      highlights: ['Perguntas frequentes', 'Canal de contato', 'Orientacao para usuarios e ONGs'],
      actionLabel: 'Falar com a Movune',
      actionPath: '/contato',
    },
  ];
}
