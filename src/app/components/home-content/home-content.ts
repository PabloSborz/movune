import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-content',
  imports: [CommonModule],
  templateUrl: './home-content.html',
  styleUrl: './home-content.css',
})
export class HomeContent {
  readonly paths = [
    { icon: '♥', title: 'Para quem quer doar', description: 'Apoie projetos auditados com doações recorrentes ou pontuais. Receba relatórios periódicos da destinação de cada centavo.', action: 'Começar a doar', href: '/doacoes', tone: 'blue' },
    { icon: '✦', title: 'Para quem quer ser voluntário', description: 'Ofereça seu talento para quem precisa. Encontre ações locais e remotas alinhadas com suas habilidades e disponibilidade.', action: 'Quero me candidatar', href: '/voluntariado', tone: 'green' },
    { icon: '⌂', title: 'Para ONGs que buscam apoio', description: 'Publique suas necessidades de doações e voluntários. Acesse ferramentas de gestão e comprove seu impacto de forma simples.', action: 'Inscrever minha ONG', href: '/cadastro-ong', tone: 'blue' },
  ];

  readonly featuredOngs = [
    { name: 'Rede Cuidar', category: 'Saúde', city: 'São Paulo - SP', description: 'Assistência médica preventiva e cuidado integral para famílias em situação de vulnerabilidade.', image: '/card-image.png', tone: 'blue' },
    { name: 'Instituto Aprender', category: 'Educação', city: 'Belo Horizonte - MG', description: 'Inclusão digital e mentoria que abrem novas oportunidades para crianças e jovens.', image: '/card-image (1).png', tone: 'amber' },
    { name: 'Casa Verde Viva', category: 'Meio Ambiente', city: 'Curitiba - PR', description: 'Agroflorestas urbanas e educação ambiental para comunidades mais sustentáveis.', image: '/card-image (2).png', tone: 'green' },
  ];

  readonly featuredProjects = [
    { name: 'Biblioteca de Bairro', ong: 'Instituto Aprender', amount: 'R$ 9.450', progress: 63, volunteers: 4, image: '/card-image (3).png' },
    { name: 'Cozinha Solidária', ong: 'Rede Cuidar', amount: 'R$ 18.200', progress: 61, volunteers: 12, image: '/card-image (4).png' },
    { name: 'Horta Escola', ong: 'Casa Verde Viva', amount: 'R$ 7.100', progress: 89, volunteers: 6, image: '/card-image (5).png' },
  ];

}

