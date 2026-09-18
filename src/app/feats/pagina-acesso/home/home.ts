import { Component, ElementRef, afterNextRender, inject, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-access-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly session = inject(AuthStore).session;
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroy = inject(DestroyRef);
  readonly stats = [
    { icon: '◷', value: '12', label: 'Horas voluntariadas' },
    { icon: '♡', value: '3', label: 'Projetos ativos' },
    { icon: '$', value: 'R$ 450', label: 'Total doado' },
    { icon: '♙', value: '5', label: 'Certificados' },
  ];
  readonly projects = [
    { ong: 'Instituto Aprender', name: 'Biblioteca do Bairro', description: 'Expansão e doação de acervo e catalogação de novos acervos infantis e infantojuvenis.', image: '/card-image (3).png', progress: null },
    { ong: 'Rede Cuidar', name: 'Cozinha Solidária SP', description: 'Distribuição diária de refeições nutritivas para moradores em situação de rua.', image: '/card-image (4).png', progress: 50 },
    { ong: 'Casa Verde Viva', name: 'Horta Escola Ecologia', description: 'Educação, arte e agroecologia para alunos da rede pública municipal durante o fim de semana.', image: '/card-image (5).png', progress: 100 },
  ];
  readonly events = [
    { day: '28', month: 'Fev', title: 'Mutirão de Plantio Urbano', location: 'Casa Verde Viva - Curitiba', time: '09:00 às 13:00', green: false },
    { day: '05', month: 'Mar', title: 'Oficina de Alfabetização', location: 'Inst. Aprender - Belo Horizonte', time: '14:00 às 17:00', green: true },
  ];
  readonly jobs = [
    { mode: 'Remoto', title: 'Mentor de Inclusão Digital', description: 'Ensine conceitos básicos de informática e navegação na internet para idosos. 2 horas semanais.', tags: ['Tecnologia', 'Ensino', 'Inclusão digital'] },
    { mode: 'São Paulo - SP', title: 'Apoio em Triagem Médica', description: 'Ajuda na recepção e organização de fichas médicas para mutirão comunitário aos sábados.', tags: ['Saúde', 'Organização', 'Atendimento'] },
    { mode: 'Híbrido', title: 'Produtor de Conteúdo Eco', description: 'Desenvolvimento de posts informativos para conscientização sobre reciclagem local.', tags: ['Comunicação', 'Design', 'Meio ambiente'] },
  ];
  readonly footerGroups = [
    { title: 'Institucional', links: [
      { label: 'Sobre Nós', path: '/sobre' }, { label: 'Como funciona', path: '/como-funciona' }, { label: 'Transparência', path: '/transparencia' }, { label: 'Contato', path: '/contato' }, { label: 'FAQ', path: '/perguntas-frequentes' },
    ] },
    { title: 'Para ONGs', links: [
      { label: 'Cadastrar ONG', path: '/cadastro-ong' }, { label: 'Painel de Controle', path: '/ong/painel' }, { label: 'Guia de Recursos', path: '/como-funciona' }, { label: 'Portal de Voluntários', path: '/voluntariado' },
    ] },
    { title: 'Legal', links: [
      { label: 'Privacidade', path: '/politica-privacidade' }, { label: 'Termos de Uso', path: '/termos-uso' }, { label: 'Cookies', path: '/politica-cookies' }, { label: 'Segurança de Doações', path: '/politica-doacoes' },
    ] },
  ];
  constructor() {
    afterNextRender(() => {
      const bars = this.element.nativeElement.querySelectorAll<HTMLElement>('.progress');
      if (!('IntersectionObserver' in globalThis)) {
        bars.forEach(bar => bar.classList.add('visible'));
        return;
      }
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      bars.forEach(bar => observer.observe(bar));
      this.destroy.onDestroy(() => observer.disconnect());
    });
  }
}
