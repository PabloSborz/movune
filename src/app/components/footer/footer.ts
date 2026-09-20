import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  @Input() home = false;
  readonly homeGroups = [
    {
      title: 'Institucional',
      links: [
        { label: 'Sobre Nós', href: '/sobre' },
        { label: 'Como funciona', href: '/como-funciona' },
        { label: 'Transparência', href: '/transparencia' },
        { label: 'Contato', href: '/contato' },
        { label: 'FAQ', href: '/perguntas-frequentes' },
      ],
    },
    {
      title: 'Para ONGs',
      links: [
        { label: 'Cadastrar ONG', href: '/cadastro-ong' },
        { label: 'Painel de Controle', href: '/ong/painel' },
        { label: 'Guia de Recursos', href: '/como-funciona' },
        { label: 'Portal de Voluntários', href: '/voluntariado' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacidade', href: '/politica-privacidade' },
        { label: 'Termos de Uso', href: '/termos-uso' },
        { label: 'Cookies', href: '/politica-cookies' },
        { label: 'Segurança de Doações', href: '/politica-doacoes' },
      ],
    },
  ];
  readonly publicLinks = [
    { label: 'Como funciona', path: '/como-funciona' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contato', path: '/contato' },
    { label: 'Empresas parceiras', path: '/empresas-parceiras' },
    { label: 'Perguntas frequentes', path: '/perguntas-frequentes' },
  ];

  readonly legalLinks = [
    { label: 'Privacidade', path: '/politica-privacidade' },
    { label: 'Termos', path: '/termos-uso' },
    { label: 'Cookies', path: '/politica-cookies' },
    { label: 'Doacoes', path: '/politica-doacoes' },
    { label: 'Transparencia', path: '/politica-transparencia' },
  ];
}
