import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly publicLinks = [
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
