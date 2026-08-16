import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AccessProfile, AuthStore } from '../../shared/auth-store.service';

interface SideBarLink {
  label: string;
  path: string;
  exact?: boolean;
}

interface SideBarGroup {
  title: string;
  links: SideBarLink[];
}

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private readonly auth = inject(AuthStore);
  readonly session = this.auth.session;

  private readonly publicGroups: SideBarGroup[] = [
    {
      title: 'Pagina publica',
      links: [
        { label: 'Home', path: '/', exact: true },
        { label: 'ONGs', path: '/ongs' },
        { label: 'Projetos', path: '/projetos' },
        { label: 'Voluntariado', path: '/voluntariado' },
        { label: 'Eventos', path: '/eventos' },
        { label: 'Doacoes', path: '/doacoes' },
        { label: 'Transparencia', path: '/transparencia' },
      ],
    },
    {
      title: 'Sites secundarios',
      links: [
        { label: 'Como funciona', path: '/como-funciona' },
        { label: 'Sobre', path: '/sobre' },
        { label: 'Contato', path: '/contato' },
        { label: 'Empresas parceiras', path: '/empresas-parceiras' },
        { label: 'Perguntas frequentes', path: '/perguntas-frequentes' },
      ],
    },
  ];

  private readonly privateGroups: Record<AccessProfile, SideBarGroup> = {
    usuario: {
      title: 'Area do usuario',
      links: [
        { label: 'Meu perfil', path: '/usuario/meu-perfil' },
        { label: 'Inscricoes', path: '/usuario/minhas-inscricoes' },
        { label: 'Doacoes', path: '/usuario/minhas-doacoes' },
        { label: 'Favoritos', path: '/usuario/favoritos' },
        { label: 'Certificados', path: '/usuario/certificados' },
      ],
    },
    ong: {
      title: 'Area da ONG',
      links: [
        { label: 'Painel', path: '/ong/painel' },
        { label: 'Projetos', path: '/ong/projetos' },
        { label: 'Vagas', path: '/ong/vagas' },
        { label: 'Voluntarios', path: '/ong/voluntarios' },
        { label: 'Prestacao', path: '/ong/prestacao-contas' },
        { label: 'Documentos', path: '/ong/documentos' },
        { label: 'Configuracoes', path: '/ong/configuracoes' },
      ],
    },
    admin: {
      title: 'Administracao',
      links: [
        { label: 'Painel', path: '/admin/painel' },
        { label: 'Usuarios', path: '/admin/usuarios' },
        { label: 'ONGs', path: '/admin/ongs' },
        { label: 'Projetos', path: '/admin/projetos' },
        { label: 'Doacoes', path: '/admin/doacoes' },
        { label: 'Denuncias', path: '/admin/denuncias' },
        { label: 'Conteudo', path: '/admin/conteudo' },
        { label: 'Relatorios', path: '/admin/relatorios' },
        { label: 'Configuracoes', path: '/admin/configuracoes' },
      ],
    },
  };

  private readonly legalGroup: SideBarGroup = {
    title: 'Legal',
    links: [
      { label: 'Privacidade', path: '/politica-privacidade' },
      { label: 'Termos de uso', path: '/termos-uso' },
      { label: 'Cookies', path: '/politica-cookies' },
      { label: 'Politica de doacoes', path: '/politica-doacoes' },
      { label: 'Transparencia', path: '/politica-transparencia' },
    ],
  };

  readonly groups = computed<SideBarGroup[]>(() => {
    const activeSession = this.session();

    if (!activeSession) {
      return [...this.publicGroups, this.legalGroup];
    }

    return [...this.publicGroups, this.privateGroups[activeSession.perfil], this.legalGroup];
  });

  profileLabel(profile: AccessProfile): string {
    const labels: Record<AccessProfile, string> = {
      usuario: 'Usuario',
      ong: 'ONG',
      admin: 'Administrador',
    };

    return labels[profile];
  }
}
