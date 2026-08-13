import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feats/pagina-publica/home/home').then((m) => m.Home),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: 'sobre',
    loadComponent: () => import('./feats/pagina-publica/sobre/sobre').then((m) => m.Sobre),
  },
  {
    path: 'ongs',
    loadComponent: () =>
      import('./feats/pagina-publica/lista-ongs/lista-ongs').then((m) => m.ListaOngs),
  },
  {
    path: 'perfil-ong',
    loadComponent: () => import('./feats/ong/perfil-ong/perfil-ong').then((m) => m.PerfilOng),
  },
  {
    path: 'projetos',
    loadComponent: () =>
      import('./feats/pagina-publica/lista-projetos/lista-projetos').then((m) => m.ListaProjetos),
  },
  {
    path: 'detalhes-projeto',
    loadComponent: () =>
      import('./feats/pagina-publica/detalhes-projeto/detalhes-projeto').then(
        (m) => m.DetalhesProjeto,
      ),
  },
  {
    path: 'voluntariado',
    loadComponent: () =>
      import('./feats/pagina-publica/voluntario/voluntario').then((m) => m.Voluntario),
  },
  {
    path: 'detalhe-vaga-voluntario',
    loadComponent: () =>
      import('./feats/pagina-publica/detalhe-vaga-voluntario/detalhe-vaga-voluntario').then(
        (m) => m.DetalheVagaVoluntario,
      ),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./feats/pagina-publica/eventos/eventos').then((m) => m.Eventos),
  },
  {
    path: 'detalhes-eventos',
    loadComponent: () =>
      import('./feats/pagina-publica/detalhes-eventos/detalhes-eventos').then(
        (m) => m.DetalhesEventos,
      ),
  },
  {
    path: 'doacoes',
    loadComponent: () => import('./feats/pagina-publica/doacao/doacao').then((m) => m.Doacao),
  },
  {
    path: 'transparencia',
    loadComponent: () =>
      import('./feats/pagina-publica/transparencia/transparencia').then((m) => m.Transparencia),
  },
  {
    path: 'empresas-parceiras',
    loadComponent: () =>
      import('./feats/pagina-publica/empresas-parceiras/empresas-parceiras').then(
        (m) => m.EmpresasParceiras,
      ),
  },
  {
    path: 'contato',
    loadComponent: () => import('./feats/pagina-publica/contato/contato').then((m) => m.Contato),
  },
  {
    path: 'perguntas-frequentes',
    loadComponent: () =>
      import('./feats/pagina-publica/perguntas-frequantes/perguntas-frequantes').then(
        (m) => m.PerguntasFrequantes,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./feats/pagina-acesso/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro-usuario',
    loadComponent: () =>
      import('./feats/pagina-acesso/cadastro-usuario/cadastro-usuario').then(
        (m) => m.CadastroUsuario,
      ),
  },
  {
    path: 'cadastro-ong',
    loadComponent: () =>
      import('./feats/pagina-acesso/cadastro-ong/cadastro-ong').then((m) => m.CadastroOng),
  },
  {
    path: 'recuperacao-senha',
    loadComponent: () =>
      import('./feats/pagina-acesso/recuperacao-senha/recuperacao-senha').then(
        (m) => m.RecuperacaoSenha,
      ),
  },
  {
    path: 'redefinicao-senha',
    loadComponent: () =>
      import('./feats/pagina-acesso/redefinicao-senha/redefinicao-senha').then(
        (m) => m.RedefinicaoSenha,
      ),
  },
  { path: 'usuario', redirectTo: 'usuario/meu-perfil', pathMatch: 'full' },
  { path: 'painel-usuario', redirectTo: 'usuario/meu-perfil', pathMatch: 'full' },
  {
    path: 'usuario/meu-perfil',
    loadComponent: () =>
      import('./feats/area-usuario/meu-perfil/meu-perfil').then((m) => m.MeuPerfil),
  },
  {
    path: 'usuario/minhas-inscricoes',
    loadComponent: () =>
      import('./feats/area-usuario/minha-inscricao/minha-inscricao').then((m) => m.MinhaInscricao),
  },
  {
    path: 'usuario/minhas-doacoes',
    loadComponent: () =>
      import('./feats/area-usuario/minha-doacao/minha-doacao').then((m) => m.MinhaDoacao),
  },
  {
    path: 'usuario/favoritos',
    loadComponent: () =>
      import('./feats/area-usuario/favoritos/favoritos').then((m) => m.Favoritos),
  },
  {
    path: 'usuario/certificados',
    loadComponent: () =>
      import('./feats/area-usuario/certificado/certificado').then((m) => m.Certificado),
  },
  {
    path: 'ong/painel',
    loadComponent: () => import('./feats/ong/painel-ong/painel-ong').then((m) => m.PainelOng),
  },
  {
    path: 'ong/editar-perfil',
    loadComponent: () => import('./feats/ong/editar-ong/editar-ong').then((m) => m.EditarOng),
  },
  {
    path: 'ong/projetos/cadastrar',
    loadComponent: () =>
      import('./feats/ong/cadastrar-projeto-ong/cadastrar-projeto-ong').then(
        (m) => m.CadastrarProjetoOng,
      ),
  },
  {
    path: 'ong/projetos',
    loadComponent: () =>
      import('./feats/ong/gerenciar-projeto-ong/gerenciar-projeto-ong').then(
        (m) => m.GerenciarProjetoOng,
      ),
  },
  {
    path: 'ong/vagas',
    loadComponent: () =>
      import('./feats/ong/gerenciar-vaga-ong/gerenciar-vaga-ong').then((m) => m.GerenciarVagaOng),
  },
  {
    path: 'ong/voluntarios',
    loadComponent: () =>
      import('./feats/ong/gerenciar-voluntario-ong/gerenciar-voluntario-ong').then(
        (m) => m.GerenciarVoluntarioOng,
      ),
  },
  {
    path: 'ong/eventos',
    loadComponent: () =>
      import('./feats/ong/gerenciar-eventos-ong/gerenciar-eventos-ong').then(
        (m) => m.GerenciarEventosOng,
      ),
  },
  {
    path: 'ong/doacoes',
    loadComponent: () =>
      import('./feats/ong/gerencia-doacao-ong/gerencia-doacao-ong').then(
        (m) => m.GerenciaDoacaoOng,
      ),
  },
  {
    path: 'ong/prestacao-contas',
    loadComponent: () =>
      import('./feats/ong/prestacao-conta-ong/prestacao-conta-ong').then(
        (m) => m.PrestacaoContaOng,
      ),
  },
  {
    path: 'ong/relatorios',
    loadComponent: () =>
      import('./feats/ong/relatorio-ong/relatorio-ong').then((m) => m.RelatorioOng),
  },
  {
    path: 'ong/documentos',
    loadComponent: () =>
      import('./feats/ong/documento-ong/documento-ong').then((m) => m.DocumentoOng),
  },
  {
    path: 'ong/configuracoes',
    loadComponent: () =>
      import('./feats/ong/configuracao-ong/configuracao-ong').then((m) => m.ConfiguracaoOng),
  },
  {
    path: 'admin/painel',
    loadComponent: () =>
      import('./feats/area-administrativa/painel-admin/painel-admin').then((m) => m.PainelAdmin),
  },
  {
    path: 'admin/usuarios',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-usuario/gerenciar-usuario').then(
        (m) => m.GerenciarUsuario,
      ),
  },
  {
    path: 'admin/ongs',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-ongs/gerenciar-ongs').then(
        (m) => m.GerenciarOngs,
      ),
  },
  {
    path: 'admin/projetos',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-projetos/gerenciar-projetos').then(
        (m) => m.GerenciarProjetos,
      ),
  },
  {
    path: 'admin/doacoes',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-doacao/gerenciar-doacao').then(
        (m) => m.GerenciarDoacao,
      ),
  },
  {
    path: 'admin/denuncias',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-denuncia/gerenciar-denuncia').then(
        (m) => m.GerenciarDenuncia,
      ),
  },
  {
    path: 'admin/conteudo',
    loadComponent: () =>
      import('./feats/area-administrativa/gerenciar-conteudo/gerenciar-conteudo').then(
        (m) => m.GerenciarConteudo,
      ),
  },
  {
    path: 'admin/relatorios',
    loadComponent: () =>
      import('./feats/area-administrativa/relatorio-admin/relatorio-admin').then(
        (m) => m.RelatorioAdmin,
      ),
  },
  {
    path: 'admin/configuracoes',
    loadComponent: () =>
      import('./feats/area-administrativa/comfiguracao-sistema/comfiguracao-sistema').then(
        (m) => m.ComfiguracaoSistema,
      ),
  },
  {
    path: 'politica-privacidade',
    loadComponent: () =>
      import('./feats/paginas-legais/politica-privacidade/politica-privacidade').then(
        (m) => m.PoliticaPrivacidade,
      ),
  },
  {
    path: 'termos-uso',
    loadComponent: () =>
      import('./feats/paginas-legais/termos-uso/termos-uso').then((m) => m.TermosUso),
  },
  {
    path: 'politica-cookies',
    loadComponent: () =>
      import('./feats/paginas-legais/politica-cookies/politica-cookies').then(
        (m) => m.PoliticaCookies,
      ),
  },
  {
    path: 'politica-doacoes',
    loadComponent: () =>
      import('./feats/paginas-legais/politica-doacao/politica-doacao').then(
        (m) => m.PoliticaDoacao,
      ),
  },
  { path: 'politica-doacao', redirectTo: 'politica-doacoes', pathMatch: 'full' },
  {
    path: 'politica-transparencia',
    loadComponent: () =>
      import('./feats/paginas-legais/politica-transparencia/politica-transparencia').then(
        (m) => m.PoliticaTransparencia,
      ),
  },
  { path: '**', redirectTo: '' },
];
