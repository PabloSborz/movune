import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  readonly groups = [
    {
      title: 'Usuario',
      links: [
        { label: 'Meu perfil', path: '/usuario/meu-perfil' },
        { label: 'Inscricoes', path: '/usuario/minhas-inscricoes' },
        { label: 'Doacoes', path: '/usuario/minhas-doacoes' },
        { label: 'Favoritos', path: '/usuario/favoritos' },
        { label: 'Certificados', path: '/usuario/certificados' },
      ],
    },
    {
      title: 'ONG',
      links: [
        { label: 'Painel', path: '/ong/painel' },
        { label: 'Projetos', path: '/ong/projetos' },
        { label: 'Vagas', path: '/ong/vagas' },
        { label: 'Voluntarios', path: '/ong/voluntarios' },
        { label: 'Prestacao', path: '/ong/prestacao-contas' },
      ],
    },
    {
      title: 'Admin',
      links: [
        { label: 'Painel', path: '/admin/painel' },
        { label: 'Usuarios', path: '/admin/usuarios' },
        { label: 'ONGs', path: '/admin/ongs' },
        { label: 'Projetos', path: '/admin/projetos' },
        { label: 'Relatorios', path: '/admin/relatorios' },
      ],
    },
  ];
}
