import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly primaryLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'ONGs', path: '/ongs' },
    { label: 'Projetos', path: '/projetos' },
    { label: 'Voluntariado', path: '/voluntariado' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Transparencia', path: '/transparencia' },
  ];

  readonly accessLinks = [
    { label: 'Login', path: '/login' },
    { label: 'Usuario', path: '/usuario/meu-perfil' },
    { label: 'ONG', path: '/ong/painel' },
    { label: 'Admin', path: '/admin/painel' },
  ];
}
