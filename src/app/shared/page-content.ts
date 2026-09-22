
export interface PageAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface PageMetric {
  value: string;
  label: string;
}

export interface PageSection {
  title: string;
  body?: string;
  items?: string[];
}

export interface PageCard {
  title: string;
  meta?: string;
  description: string;
  tags?: string[];
  href?: string;
}

export interface PageTable {
  columns: string[];
  rows: string[][];
}

export interface PageContent {
  eyebrow: string;
  title: string;
  titleImage?: string;
  titleImageAlt?: string;
  description: string;
  image?: string;
  actions?: PageAction[];
  metrics?: PageMetric[];
  filters?: string[];
  sections?: PageSection[];
  cards?: PageCard[];
  fields?: string[];
  table?: PageTable;
}

const brandImage = '/logo-slogan-transparent.png';
const logoImage = '/logo-transparent.png';
const sloganImage = '/slogan-transparent.png';

export const PAGE_CONTENT = {
  home: {
    eyebrow: 'Página pública',
    title: 'Conecta ONG',
    titleImage: brandImage,
    titleImageAlt: 'Movune - Mover pessoas. Unir causas.',
    description:
      'Uma plataforma para aproximar pessoas, empresas e ONGs em projetos sociais com transparência, doações e voluntariado.',
    image: brandImage,
    actions: [
      { label: 'Doar agora', href: '/doacoes' },
      { label: 'Ser voluntário', href: '/voluntariado', variant: 'secondary' },
      { label: 'Cadastrar ONG', href: '/cadastro-ong', variant: 'secondary' },
    ],
    metrics: [
      { value: '128', label: 'ONGs cadastradas' },
      { value: '3.4k', label: 'voluntários conectados' },
      { value: 'R$ 860k', label: 'em apoio mobilizado' },
    ],
  },
  comoFunciona: {
    eyebrow: 'Guia da plataforma',
    title: 'Como funciona',
    description:
      'A Movune é uma plataforma pensada para conectar doadores, voluntários, empresas e ONGs de forma simples, transparente e eficiente.',
    image: sloganImage,
    actions: [
      { label: 'Encontrar ONGs', href: '/ongs' },
      { label: 'Ver projetos', href: '/projetos', variant: 'secondary' },
      { label: 'Cadastrar ONG', href: '/cadastro-ong', variant: 'secondary' },
    ],
    metrics: [
      { value: '1', label: 'Descubra uma causa' },
      { value: '2', label: 'Escolha como ajudar' },
      { value: '3', label: 'Acompanhe o impacto' },
    ],
    sections: [
      {
        title: 'Para Apoiadores e Voluntários',
        body: 'Explore causas alinhadas ao seu perfil, participe de eventos solidários e acompanhe onde cada contribuição é aplicada com total transparência.',
      },
      {
        title: 'Para Organizações Sociais (ONGs)',
        body: 'Divulgue seus projetos, capte recursos, gerencie voluntários e publique prestações de contas em um painel simples e estruturado.',
      },
      {
        title: 'Para Empresas Parceiras',
        body: 'Fortaleça programas de responsabilidade social e ESG conectando seus colaboradores e recursos a projetos sociais de alto impacto.',
      },
    ],
    cards: [
      {
        title: 'Doações Transparentes',
        meta: 'Apoio financeiro e material',
        description:
          'Apoie campanhas ativas via Pix, itens essenciais ou doações mensais e receba relatórios detalhados.',
        tags: ['Pix', 'Doação Direta', 'Relatórios'],
        href: '/doacoes',
      },
      {
        title: 'Vagas de Voluntariado',
        meta: 'Tempo e habilidades',
        description:
          'Inscreva-se em vagas presenciais ou remotas, ajude ONGs da sua região e receba certificados de participação.',
        tags: ['Remoto', 'Presencial', 'Certificado'],
        href: '/voluntariado',
      },
      {
        title: 'Projetos e Eventos',
        meta: 'Ações comunitárias',
        description:
          'Acompanhe mutirões, oficinas e eventos promovidos pelas organizações em tempo real.',
        tags: ['Agenda', 'Comunidade', 'Mutirões'],
        href: '/eventos',
      },
    ],
  },
  sobre: {
    eyebrow: 'Institucional',
    title: 'Sobre a Movune',
    description:
      'A Movune nasce para mover pessoas e unir causas, oferecendo um ambiente simples para descobrir, apoiar e acompanhar impacto social.',
    image: sloganImage,
    actions: [
      { label: 'Conhecer ONGs', href: '/ongs' },
      { label: 'Falar conosco', href: '/contato', variant: 'secondary' },
    ],
    sections: [
      {
        title: 'Historia',
        body: 'A plataforma foi pensada para reduzir a distancia entre quem quer ajudar e quem precisa de apoio organizado.',
      },
      {
        title: 'Missao, visao e valores',
        items: [
          'Missao: conectar recursos, tempo e conhecimento a causas sociais reais.',
          'Visao: ser referencia em colaboracao transparente entre sociedade civil e ONGs.',
          'Valores: confianca, inclusao, impacto mensuravel e cuidado com dados.',
        ],
      },
      {
        title: 'Impacto esperado',
        body: 'Ampliar a visibilidade das ONGs, simplificar o acesso a voluntarios e fortalecer a prestacao de contas.',
      },
    ],
  },
  listaOngs: {
    eyebrow: 'Catalogo publico',
    title: 'Lista de ONGs',
    description:
      'Explore organizações cadastradas por cidade, estado, causa social e status de verificação.',
    image: brandImage,
    actions: [
      { label: 'Ver perfil modelo', href: '/perfil-ong' },
      { label: 'Cadastrar ONG', href: '/cadastro-ong', variant: 'secondary' },
    ],
    filters: ['Nome ou causa', 'Cidade', 'Estado', 'Area de atuacao', 'ONG verificada'],
    cards: [
      {
        title: 'Rede Cuidar',
        meta: 'Assistencia social',
        description:
          'Atende famílias com cestas, oficinas e encaminhamento para serviços públicos.',
        tags: ['Sao Paulo', 'Verificada', '24 projetos'],
        href: '/perfil-ong',
      },
      {
        title: 'Instituto Aprender',
        meta: 'Educação',
        description: 'Promove reforço escolar, leitura e inclusão digital para crianças e jovens.',
        tags: ['Curitiba', 'Voluntariado', 'Eventos ativos'],
        href: '/perfil-ong',
      },
      {
        title: 'Casa Verde Viva',
        meta: 'Meio ambiente',
        description: 'Organiza mutirões, hortas comunitárias e educação ambiental nos bairros.',
        tags: ['Recife', 'Doações materiais', 'Impacto local'],
        href: '/perfil-ong',
      },
    ],
  },
  perfilOng: {
    eyebrow: 'Perfil publico',
    title: 'Perfil da ONG',
    description:
      'Página institucional com história, contato, projetos ativos, eventos, vagas e indicadores de transparência.',
    image: logoImage,
    actions: [
      { label: 'Doar para esta ONG', href: '/doacoes' },
      { label: 'Ver projetos', href: '/projetos', variant: 'secondary' },
    ],
    metrics: [
      { value: '18', label: 'projetos ativos' },
      { value: '940', label: 'pessoas beneficiadas' },
      { value: '96%', label: 'documentos conferidos' },
    ],
    sections: [
      {
        title: 'Informações institucionais',
        items: [
          'CNPJ, responsavel legal e area de atuacao.',
          'Endereco, telefone, e-mail e redes sociais.',
        ],
      },
      {
        title: 'Transparencia',
        body: 'A ONG exibe comprovantes, relatórios, despesas e resultados para fortalecer a confiança dos apoiadores.',
      },
    ],
    cards: [
      {
        title: 'Projeto Escola Aberta',
        meta: 'Educacao',
        description: 'Oficinas no contraturno para estudantes da rede pública.',
        tags: ['Meta 72%', '80 crianças', 'Atualizado hoje'],
        href: '/detalhes-projeto',
      },
      {
        title: 'Mutirao de alimentos',
        meta: 'Evento',
        description: 'Arrecadação e triagem de cestas para distribuição no fim de semana.',
        tags: ['Sábado', '30 vagas', 'Inscrição aberta'],
        href: '/detalhes-eventos',
      },
    ],
  },
  listaProjetos: {
    eyebrow: 'Projetos sociais',
    title: 'Lista de Projetos',
    description:
      'Campanhas sociais disponíveis para doação, participação e acompanhamento de resultados.',
    image: brandImage,
    actions: [
      { label: 'Abrir projeto modelo', href: '/detalhes-projeto' },
      { label: 'Ver transparencia', href: '/transparencia', variant: 'secondary' },
    ],
    filters: ['Categoria', 'Cidade', 'Situacao', 'Prazo', 'Meta financeira'],
    cards: [
      {
        title: 'Biblioteca de bairro',
        meta: 'Educacao',
        description: 'Compra de livros, mobiliario e computadores para um espaco comunitario.',
        tags: ['R$ 18.400 arrecadados', 'Meta 65%', 'Destaque'],
        href: '/detalhes-projeto',
      },
      {
        title: 'Cozinha solidaria',
        meta: 'Seguranca alimentar',
        description: 'Refeições semanais para famílias acompanhadas pela rede socioassistencial.',
        tags: ['Prazo 20 dias', 'Recife', 'Doacao recorrente'],
        href: '/detalhes-projeto',
      },
      {
        title: 'Horta escola',
        meta: 'Meio ambiente',
        description: 'Instalacao de hortas educativas e formacao de multiplicadores locais.',
        tags: ['Materiais', 'Voluntarios', 'Em andamento'],
        href: '/detalhes-projeto',
      },
    ],
  },
  detalhesProjeto: {
    eyebrow: 'Projeto social',
    title: 'Detalhes do Projeto',
    description:
      'Descrição completa da campanha, metas, público beneficiado, atualizações e resultados esperados.',
    image: brandImage,
    actions: [
      { label: 'Doar para o projeto', href: '/doacoes' },
      { label: 'Participar como voluntario', href: '/voluntariado', variant: 'secondary' },
    ],
    metrics: [
      { value: 'R$ 18.400', label: 'arrecadados' },
      { value: 'R$ 28.000', label: 'meta financeira' },
      { value: '160', label: 'beneficiados previstos' },
    ],
    sections: [
      {
        title: 'Objetivo',
        body: 'Criar uma biblioteca comunitária com acesso à leitura, computadores e apoio de voluntários educadores.',
      },
      {
        title: 'Atualizações',
        items: [
          'Primeira compra de livros aprovada.',
          'Parceria com escola local confirmada.',
          'Prestação parcial anexada.',
        ],
      },
      {
        title: 'Resultados esperados',
        body: 'Aumentar acesso a livros, apoiar estudos e promover encontros culturais mensais.',
      },
    ],
  },
  voluntariado: {
    eyebrow: 'Oportunidades',
    title: 'Voluntariado',
    description:
      'Encontre vagas presenciais, remotas e híbridas para contribuir com tempo, habilidades e conhecimento.',
    image: sloganImage,
    actions: [{ label: 'Ver vaga modelo', href: '/detalhe-vaga-voluntario' }],
    filters: ['Area de atuacao', 'Localizacao', 'Modalidade', 'Disponibilidade', 'Habilidade'],
    cards: [
      {
        title: 'Mentoria de carreira',
        meta: 'Remoto',
        description:
          'Acompanhar jovens em trilhas de curriculo, entrevista e planejamento profissional.',
        tags: ['2h semanais', 'Educacao', 'Inscricao aberta'],
        href: '/detalhe-vaga-voluntario',
      },
      {
        title: 'Organizacao de evento',
        meta: 'Presencial',
        description: 'Apoio na recepcao, montagem e atendimento durante acao comunitaria.',
        tags: ['Sabado', 'Sao Paulo', '10 vagas'],
        href: '/detalhe-vaga-voluntario',
      },
    ],
  },
  detalheVagaVoluntario: {
    eyebrow: 'Vaga de voluntariado',
    title: 'Detalhes da Vaga',
    description:
      'Informacoes sobre atividade, requisitos, horarios, local, responsavel e processo de inscricao.',
    image: logoImage,
    actions: [
      { label: 'Inscrever-se', href: '/login' },
      { label: 'Ver outras vagas', href: '/voluntariado', variant: 'secondary' },
    ],
    sections: [
      {
        title: 'Atividade',
        body: 'Apoiar a comunicacao da campanha com textos curtos, organizacao de posts e acompanhamento de mensagens.',
      },
      {
        title: 'Requisitos',
        items: [
          'Boa comunicacao escrita.',
          'Disponibilidade de 4 horas semanais.',
          'Interesse por causas sociais.',
        ],
      },
      {
        title: 'Horario e responsavel',
        body: 'Atividade remota, com reuniao semanal as tercas. Responsavel: coordenacao de voluntariado.',
      },
    ],
  },
  eventos: {
    eyebrow: 'Agenda social',
    title: 'Eventos',
    description:
      'Calendario de acoes, campanhas, oficinas e encontros promovidos pelas ONGs cadastradas.',
    image: brandImage,
    actions: [{ label: 'Detalhes do evento', href: '/detalhes-eventos' }],
    filters: ['Data', 'Cidade', 'Organizacao', 'Tipo de evento'],
    cards: [
      {
        title: 'Mutirao de arrecadacao',
        meta: '24 de agosto',
        description: 'Triagem de alimentos, kits de higiene e roupas para familias acompanhadas.',
        tags: ['30 vagas', 'Presencial', 'Inscricao aberta'],
        href: '/detalhes-eventos',
      },
      {
        title: 'Oficina de educacao financeira',
        meta: 'Online',
        description: 'Encontro aberto para orientacao de planejamento financeiro familiar.',
        tags: ['Evento remoto', 'Gratuito', 'Certificado'],
        href: '/detalhes-eventos',
      },
    ],
  },
  detalhesEventos: {
    eyebrow: 'Evento social',
    title: 'Detalhes do Evento',
    description:
      'Descricao, data, horario, local, ONG responsavel, vagas e chamada para inscricao.',
    image: brandImage,
    actions: [
      { label: 'Inscrever-se', href: '/login' },
      { label: 'Voltar aos eventos', href: '/eventos', variant: 'secondary' },
    ],
    metrics: [
      { value: '24/08', label: 'data' },
      { value: '9h', label: 'inicio' },
      { value: '30', label: 'vagas' },
    ],
    sections: [
      {
        title: 'Programacao',
        items: [
          'Recepcao e orientacao dos voluntarios.',
          'Separacao dos itens arrecadados.',
          'Entrega e registro de resultados.',
        ],
      },
      {
        title: 'Local',
        body: 'Centro comunitario parceiro, com ponto de encontro informado apos inscricao.',
      },
    ],
  },
  doacoes: {
    eyebrow: 'Apoio financeiro e material',
    title: 'Doacoes',
    description:
      'Escolha campanhas verificadas e apoie com dinheiro, materiais, servicos ou doacoes recorrentes.',
    image: sloganImage,
    actions: [
      { label: 'Escolher projeto', href: '/projetos' },
      { label: 'Ver politica de doacoes', href: '/politica-doacoes', variant: 'secondary' },
    ],
    sections: [
      {
        title: 'Formas de doacao',
        items: [
          'Pix, cartao ou boleto.',
          'Materiais cadastrados pela ONG.',
          'Servicos profissionais e apoio tecnico.',
        ],
      },
      {
        title: 'Seguranca',
        body: 'As campanhas exibem dados da ONG, objetivo, uso previsto dos recursos e historico de prestacao de contas.',
      },
    ],
    fields: ['Tipo de doacao', 'Valor ou item', 'Projeto apoiado', 'Dados do doador'],
  },
  transparencia: {
    eyebrow: 'Transparencia publica',
    title: 'Transparencia',
    description:
      'Acompanhe valores arrecadados, despesas, comprovantes, relatorios e resultados por ONG ou projeto.',
    image: brandImage,
    actions: [
      { label: 'Ver politica', href: '/politica-transparencia' },
      { label: 'Conhecer ONGs', href: '/ongs', variant: 'secondary' },
    ],
    metrics: [
      { value: 'R$ 860k', label: 'arrecadados' },
      { value: '412', label: 'comprovantes' },
      { value: '18k', label: 'pessoas beneficiadas' },
    ],
    table: {
      columns: ['Campanha', 'Arrecadado', 'Despesas', 'Status'],
      rows: [
        ['Biblioteca de bairro', 'R$ 18.400', 'R$ 7.950', 'Parcial publicado'],
        ['Cozinha solidaria', 'R$ 32.100', 'R$ 30.480', 'Conferido'],
        ['Horta escola', 'R$ 9.850', 'R$ 4.200', 'Em andamento'],
      ],
    },
  },
  empresasParceiras: {
    eyebrow: 'Parcerias',
    title: 'Empresas Parceiras',
    description:
      'Espaco para empresas apoiadoras, programas de responsabilidade social e campanhas de impacto compartilhado.',
    image: sloganImage,
    actions: [
      { label: 'Quero ser parceira', href: '/contato' },
      { label: 'Ver projetos', href: '/projetos', variant: 'secondary' },
    ],
    cards: [
      {
        title: 'Programa Empresa Solidaria',
        meta: 'Parceria recorrente',
        description:
          'Apoio mensal a projetos locais com relatorios de impacto para equipes e clientes.',
        tags: ['ESG', 'Relatorios', 'Voluntariado corporativo'],
      },
      {
        title: 'Campanhas com funcionarios',
        meta: 'Engajamento interno',
        description: 'Cocriacao de acoes para doacao, mentoria e mobilizacao de colaboradores.',
        tags: ['Times', 'Metas', 'Certificados'],
      },
    ],
  },
  contato: {
    eyebrow: 'Atendimento',
    title: 'Contato',
    description:
      'Canal para duvidas, parcerias, suporte a ONGs, sugestoes e atendimento sobre doacoes ou voluntariado.',
    image: logoImage,
    actions: [{ label: 'Entrar no sistema', href: '/login', variant: 'secondary' }],
    sections: [
      {
        title: 'Canais',
        items: [
          'E-mail: contato@movune.org',
          'Telefone: (11) 4000-0000',
          'Endereco: Sao Paulo, SP',
        ],
      },
      {
        title: 'Redes sociais',
        body: 'Instagram, LinkedIn e Facebook podem ser exibidos aqui quando os perfis oficiais estiverem publicados.',
      },
    ],
    fields: ['Nome', 'E-mail', 'Assunto', 'Mensagem'],
  },
  perguntasFrequentes: {
    eyebrow: 'Ajuda',
    title: 'Perguntas Frequentes',
    description:
      'Respostas para duvidas sobre cadastro, doacoes, voluntariado, verificacao e seguranca da plataforma.',
    image: sloganImage,
    sections: [
      {
        title: 'Cadastro',
        items: [
          'Usuarios podem atuar como voluntarios, doadores ou ambos.',
          'ONGs precisam enviar dados institucionais e documentos.',
        ],
      },
      {
        title: 'Doacoes',
        items: [
          'Campanhas exibem destino previsto dos recursos.',
          'Comprovantes e resultados ficam vinculados a prestacao de contas.',
        ],
      },
      {
        title: 'Seguranca',
        body: 'A plataforma prioriza verificacao de ONGs, moderacao de conteudo e protecao de dados pessoais.',
      },
    ],
  },
  login: {
    eyebrow: 'Acesso',
    title: 'Login',
    description:
      'Entrada para usuarios, ONGs e administradores acompanharem doacoes, inscricoes, projetos e relatorios.',
    image: logoImage,
    actions: [
      { label: 'Criar conta', href: '/escolha' },
      { label: 'Recuperar senha', href: '/recuperacao-senha', variant: 'secondary' },
    ],
    fields: ['E-mail', 'Senha', 'Perfil de acesso'],
  },
  cadastroUsuario: {
    eyebrow: 'Acesso',
    title: 'Cadastro de Usuario',
    description:
      'Crie uma conta para doar, salvar favoritos, acompanhar projetos e se inscrever em vagas ou eventos.',
    image: logoImage,
    actions: [
      { label: 'Ja tenho conta', href: '/login', variant: 'secondary' },
      { label: 'Cadastrar ONG', href: '/cadastro-ong', variant: 'secondary' },
    ],
    fields: ['Nome completo', 'E-mail', 'Telefone', 'Interesses', 'Habilidades', 'Cidade e estado'],
  },
  cadastroOng: {
    eyebrow: 'Acesso para organizacoes',
    title: 'Cadastro de ONG',
    description:
      'Cadastre a organizacao, envie documentos e prepare o perfil para publicar projetos, eventos e vagas.',
    image: brandImage,
    actions: [
      { label: 'Entrar', href: '/login', variant: 'secondary' },
      { label: 'Politica de transparencia', href: '/politica-transparencia', variant: 'secondary' },
    ],
    fields: [
      'Razao social',
      'CNPJ',
      'Responsavel legal',
      'Endereco',
      'Area de atuacao',
      'Documentos',
    ],
  },
  meuPerfil: {
    eyebrow: 'Area do usuario',
    title: 'Meu Perfil',
    description:
      'Central do usuario com dados pessoais, foto, habilidades, preferencias e configuracoes da conta.',
    image: logoImage,
    actions: [
      { label: 'Minhas inscricoes', href: '/usuario/minhas-inscricoes' },
      { label: 'Minhas doacoes', href: '/usuario/minhas-doacoes', variant: 'secondary' },
    ],
    metrics: [
      { value: '6', label: 'inscricoes ativas' },
      { value: '4', label: 'projetos apoiados' },
      { value: '12h', label: 'voluntariado registrado' },
    ],
    fields: ['Nome', 'Foto', 'Habilidades', 'Preferencias', 'Notificacoes'],
  },
  minhaInscricao: {
    eyebrow: 'Area do usuario',
    title: 'Minhas Inscricoes',
    description:
      'Acompanhe vagas e eventos em que voce se inscreveu, com status, datas e proximas acoes.',
    image: brandImage,
    table: {
      columns: ['Atividade', 'Tipo', 'Data', 'Status'],
      rows: [
        ['Mentoria de carreira', 'Vaga', 'Toda terca', 'Aprovada'],
        ['Mutirao de alimentos', 'Evento', '24/08', 'Pendente'],
        ['Oficina financeira', 'Evento', '02/09', 'Confirmada'],
      ],
    },
  },
  minhaDoacao: {
    eyebrow: 'Area do usuario',
    title: 'Minhas Doacoes',
    description: 'Historico de doacoes, comprovantes, projetos apoiados e atualizacoes de impacto.',
    image: sloganImage,
    metrics: [
      { value: 'R$ 1.280', label: 'total doado' },
      { value: '9', label: 'doacoes realizadas' },
      { value: '4', label: 'projetos apoiados' },
    ],
    table: {
      columns: ['Projeto', 'Valor', 'Data', 'Comprovante'],
      rows: [
        ['Biblioteca de bairro', 'R$ 250', '12/08', 'Disponivel'],
        ['Cozinha solidaria', 'R$ 180', '04/08', 'Disponivel'],
        ['Horta escola', 'R$ 90', '28/07', 'Pendente'],
      ],
    },
  },
  favoritos: {
    eyebrow: 'Area do usuario',
    title: 'Favoritos',
    description: 'ONGs, projetos, vagas e eventos salvos para acompanhar depois.',
    image: brandImage,
    cards: [
      {
        title: 'Rede Cuidar',
        meta: 'ONG favorita',
        description: 'Organizacao acompanhada para receber alertas sobre novos projetos.',
        tags: ['Assistencia social', 'Sao Paulo'],
        href: '/perfil-ong',
      },
      {
        title: 'Biblioteca de bairro',
        meta: 'Projeto salvo',
        description: 'Campanha marcada para acompanhar arrecadacao e atualizacoes.',
        tags: ['Educacao', 'Meta 65%'],
        href: '/detalhes-projeto',
      },
    ],
  },
  certificado: {
    eyebrow: 'Area do usuario',
    title: 'Certificados',
    description:
      'Certificados de participacao voluntaria emitidos por ONGs apos atividades concluidas.',
    image: logoImage,
    cards: [
      {
        title: 'Mentoria de carreira',
        meta: '12 horas',
        description: 'Certificado liberado pela ONG responsavel apos conclusao da trilha.',
        tags: ['PDF', 'Emitido', 'Voluntariado'],
      },
      {
        title: 'Mutirao de alimentos',
        meta: '6 horas',
        description: 'Certificado aguardando validacao da coordenacao.',
        tags: ['Pendente', 'Evento'],
      },
    ],
  },
  painelOng: {
    eyebrow: 'Area da ONG',
    title: 'Painel da ONG',
    description:
      'Resumo operacional de projetos, doacoes, voluntarios, eventos e indicadores de desempenho.',
    image: brandImage,
    actions: [
      { label: 'Cadastrar projeto', href: '/ong/projetos/cadastrar' },
      { label: 'Editar perfil', href: '/ong/editar-perfil', variant: 'secondary' },
    ],
    metrics: [
      { value: '12', label: 'projetos ativos' },
      { value: 'R$ 42k', label: 'arrecadados no mes' },
      { value: '86', label: 'voluntarios inscritos' },
    ],
    sections: [
      {
        title: 'Alertas',
        items: [
          '2 documentos proximos do vencimento.',
          '5 inscricoes aguardando avaliacao.',
          '1 prestacao de contas pendente.',
        ],
      },
    ],
  },
  editarOng: {
    eyebrow: 'Area da ONG',
    title: 'Editar Perfil da ONG',
    description:
      'Atualize logo, descricao, endereco, contatos, missao, visao, valores e redes sociais.',
    image: logoImage,
    fields: [
      'Logo',
      'Descricao institucional',
      'Endereco',
      'Contatos',
      'Missao',
      'Visao',
      'Valores',
      'Redes sociais',
    ],
  },
  gerenciarProjetoOng: {
    eyebrow: 'Area da ONG',
    title: 'Gerenciar Projetos',
    description: 'Crie, edite, visualize, destaque ou encerre projetos publicados pela ONG.',
    image: brandImage,
    actions: [{ label: 'Novo projeto', href: '/ong/projetos/cadastrar' }],
    table: {
      columns: ['Projeto', 'Meta', 'Prazo', 'Status'],
      rows: [
        ['Biblioteca de bairro', 'R$ 28.000', '30 dias', 'Publicado'],
        ['Cozinha solidaria', 'R$ 45.000', '20 dias', 'Em destaque'],
        ['Horta escola', 'R$ 12.000', '45 dias', 'Rascunho'],
      ],
    },
  },
  cadastrarProjetoOng: {
    eyebrow: 'Area da ONG',
    title: 'Cadastrar Projeto',
    description:
      'Formulario para nome, descricao, meta, prazo, imagens, publico beneficiado e necessidades.',
    image: brandImage,
    fields: [
      'Nome do projeto',
      'Descricao',
      'Categoria',
      'Meta financeira',
      'Prazo',
      'Imagens',
      'Publico beneficiado',
      'Necessidades',
    ],
  },
  gerenciarVagaOng: {
    eyebrow: 'Area da ONG',
    title: 'Gerenciar Vagas',
    description: 'Crie, edite, pause ou encerre oportunidades de voluntariado.',
    image: sloganImage,
    table: {
      columns: ['Vaga', 'Modalidade', 'Inscritos', 'Status'],
      rows: [
        ['Mentoria de carreira', 'Remota', '18', 'Aberta'],
        ['Organizacao de evento', 'Presencial', '26', 'Aberta'],
        ['Designer voluntario', 'Hibrida', '7', 'Pausada'],
      ],
    },
  },
  gerenciarVoluntarioOng: {
    eyebrow: 'Area da ONG',
    title: 'Gerenciar Voluntarios',
    description:
      'Visualize inscritos, aprove ou recuse candidaturas e entre em contato com participantes.',
    image: logoImage,
    table: {
      columns: ['Voluntario', 'Interesse', 'Disponibilidade', 'Status'],
      rows: [
        ['Ana Lima', 'Mentoria', 'Terca a noite', 'Aprovar'],
        ['Bruno Alves', 'Evento', 'Sabado', 'Pendente'],
        ['Carla Nunes', 'Comunicacao', 'Remoto', 'Contato enviado'],
      ],
    },
  },
  gerenciarEventosOng: {
    eyebrow: 'Area da ONG',
    title: 'Gerenciar Eventos',
    description: 'Crie, edite, acompanhe inscricoes e cancele eventos sociais quando necessario.',
    image: brandImage,
    table: {
      columns: ['Evento', 'Data', 'Vagas', 'Status'],
      rows: [
        ['Mutirao de arrecadacao', '24/08', '30', 'Publicado'],
        ['Oficina financeira', '02/09', '80', 'Publicado'],
        ['Encontro de parceiros', '15/09', '40', 'Rascunho'],
      ],
    },
  },
  gerenciaDoacaoOng: {
    eyebrow: 'Area da ONG',
    title: 'Gerenciar Doacoes',
    description:
      'Acompanhe valores, materiais recebidos, doacoes externas e pendencias de confirmacao.',
    image: sloganImage,
    metrics: [
      { value: 'R$ 42k', label: 'recebidos' },
      { value: '312', label: 'itens materiais' },
      { value: '18', label: 'doacoes externas' },
    ],
    table: {
      columns: ['Origem', 'Tipo', 'Destino', 'Status'],
      rows: [
        ['Voluntário', 'Pix', 'Biblioteca', 'Confirmada'],
        ['Empresa Parceira', 'Materiais', 'Cozinha', 'Em triagem'],
        ['Doacao externa', 'Servico', 'Comunicacao', 'Registrada'],
      ],
    },
  },
  prestacaoContaOng: {
    eyebrow: 'Area da ONG',
    title: 'Prestacao de Contas',
    description:
      'Registre receitas, despesas, notas, recibos, comprovantes e indicadores de uso dos recursos.',
    image: brandImage,
    fields: [
      'Tipo de lancamento',
      'Projeto vinculado',
      'Valor',
      'Data',
      'Comprovante',
      'Descricao',
    ],
    table: {
      columns: ['Lancamento', 'Projeto', 'Valor', 'Situacao'],
      rows: [
        ['Compra de livros', 'Biblioteca', 'R$ 3.200', 'Comprovado'],
        ['Aluguel de transporte', 'Cozinha', 'R$ 1.100', 'Em analise'],
      ],
    },
  },
  relatorioOng: {
    eyebrow: 'Area da ONG',
    title: 'Relatorios',
    description:
      'Relatorios financeiros, impacto social e exportacao de informacoes para gestao da ONG.',
    image: sloganImage,
    metrics: [
      { value: '24', label: 'relatorios gerados' },
      { value: '8', label: 'projetos analisados' },
      { value: '94%', label: 'dados completos' },
    ],
    sections: [
      {
        title: 'Exportacoes',
        items: ['Financeiro por periodo.', 'Impacto por projeto.', 'Voluntariado por atividade.'],
      },
    ],
  },
  documentoOng: {
    eyebrow: 'Area da ONG',
    title: 'Documentos da ONG',
    description: 'Envie e atualize documentos institucionais, acompanhe verificacao e pendencias.',
    image: logoImage,
    table: {
      columns: ['Documento', 'Vencimento', 'Status', 'Acao'],
      rows: [
        ['CNPJ', 'Sem vencimento', 'Aprovado', 'Visualizar'],
        ['Ata da diretoria', '12/2026', 'Aprovado', 'Atualizar'],
        ['Comprovante de endereco', '09/2026', 'Pendente', 'Enviar'],
      ],
    },
  },
  configuracaoOng: {
    eyebrow: 'Area da ONG',
    title: 'Configuracoes da ONG',
    description:
      'Gerencie senha, notificacoes, permissoes e usuarios responsaveis pelo perfil da ONG.',
    image: logoImage,
    fields: [
      'Senha',
      'Notificacoes',
      'Permissoes',
      'Usuarios responsaveis',
      'Preferencias de pagamento',
    ],
  },
  configuracaoSistema: {
    eyebrow: 'Area administrativa',
    title: 'Configuracao do Sistema',
    description: 'Gerencie parametros gerais, seguranca e preferencias da plataforma.',
    image: logoImage,
    fields: ['Nome da plataforma', 'E-mail de suporte', 'Notificacoes', 'Politica de acesso'],
  },
  gerenciarConteudo: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar Conteudo',
    description: 'Revise paginas, comunicados e informacoes publicadas na plataforma.',
    image: brandImage,
    table: {
      columns: ['Conteudo', 'Tipo', 'Atualizado em', 'Status'],
      rows: [
        ['Pagina inicial', 'Pagina', 'Hoje', 'Publicado'],
        ['Guia da plataforma', 'Pagina', 'Ontem', 'Publicado'],
      ],
    },
  },
  gerenciarDenuncia: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar Denuncias',
    description: 'Analise denuncias, registre providencias e acompanhe o status de cada caso.',
    image: logoImage,
    table: {
      columns: ['Denuncia', 'Alvo', 'Recebida em', 'Status'],
      rows: [
        ['#1024', 'Projeto social', 'Hoje', 'Em analise'],
        ['#1023', 'Perfil de usuario', 'Ontem', 'Resolvida'],
      ],
    },
  },
  gerenciarDoacao: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar Doacoes',
    description: 'Acompanhe doacoes financeiras e materiais registradas na plataforma.',
    image: brandImage,
    table: {
      columns: ['Doador', 'Tipo', 'Projeto apoiado', 'Status'],
      rows: [
        ['Ana Lima', 'Pix', 'Biblioteca de bairro', 'Confirmada'],
        ['Visitante', 'Material', 'Cozinha solidaria', 'Pendente'],
      ],
    },
  },
  gerenciarProjetos: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar Projetos',
    description: 'Acompanhe projetos sociais, metas, aprovacao e resultados publicados.',
    image: brandImage,
    table: {
      columns: ['Projeto', 'ONG', 'Meta', 'Status'],
      rows: [
        ['Biblioteca de bairro', 'Rede Cuidar', 'R$ 18.400', 'Em andamento'],
        ['Horta escola', 'Casa Verde Viva', 'R$ 9.800', 'Em revisao'],
      ],
    },
  },
  painelAdmin: {
    eyebrow: 'Area administrativa',
    title: 'Painel do Administrador',
    description:
      'Visao geral da plataforma com indicadores de usuarios, ONGs, projetos, doacoes e moderacao.',
    image: brandImage,
    metrics: [
      { value: '18.2k', label: 'usuarios' },
      { value: '128', label: 'ONGs' },
      { value: '342', label: 'projetos' },
      { value: '41', label: 'alertas' },
    ],
    sections: [
      {
        title: 'Pendencias criticas',
        items: ['12 ONGs aguardando verificacao.', '7 denuncias novas.', '22 projetos em revisao.'],
      },
    ],
  },
  gerenciarUsuario: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar Usuarios',
    description: 'Visualize, edite, bloqueie ou exclua usuarios, com historico e status de conta.',
    image: logoImage,
    table: {
      columns: ['Usuario', 'Perfil', 'Status', 'Ultimo acesso'],
      rows: [
        ['Ana Lima', 'Voluntaria', 'Ativo', 'Hoje'],
        ['Marcos Silva', 'Doador', 'Ativo', 'Ontem'],
        ['Equipe ONG', 'Responsavel', 'Em analise', '12/08'],
      ],
    },
  },
  gerenciarOngs: {
    eyebrow: 'Area administrativa',
    title: 'Gerenciar ONGs',
    description:
      'Aprove cadastros, verifique documentos, acompanhe reputacao e suspenda organizacoes quando necessario.',
    image: brandImage,
    table: {
      columns: ['ONG', 'Cidade', 'Documentos', 'Status'],
      rows: [
        ['Rede Cuidar', 'Sao Paulo', 'Completo', 'Aprovada'],
        ['Instituto Aprender', 'Curitiba', 'Pendente', 'Em analise'],
      ],
    },
  },
  relatorioAdmin: {
    eyebrow: 'Area administrativa',
    title: 'Relatorios Administrativos',
    description: 'Consulte indicadores de operacao, impacto e movimentacao da plataforma.',
    image: sloganImage,
    metrics: [
      { value: '342', label: 'projetos ativos' },
      { value: '3.4k', label: 'voluntarios' },
      { value: 'R$ 860k', label: 'apoio mobilizado' },
    ],
  },
  politicaCookies: {
    eyebrow: 'Politicas legais',
    title: 'Politica de Cookies',
    description: 'Entenda como utilizamos cookies para melhorar a experiencia na Movune.',
    sections: [
      { title: 'Uso de cookies', body: 'Utilizamos cookies essenciais para funcionamento, seguranca e preferencias.' },
      { title: 'Gerenciamento', body: 'Voce pode controlar cookies nas configuracoes do seu navegador.' },
    ],
  },
  politicaDoacao: {
    eyebrow: 'Politicas legais',
    title: 'Politica de Doacao',
    description: 'Consulte as regras para registrar, acompanhar e cancelar doacoes na plataforma.',
    sections: [
      { title: 'Transparencia', body: 'As doacoes sao vinculadas a campanhas e projetos identificados.' },
      { title: 'Comprovantes', body: 'Registros e comprovantes ficam disponiveis para acompanhamento.' },
    ],
  },
  politicaPrivacidade: {
    eyebrow: 'Politicas legais',
    title: 'Politica de Privacidade',
    description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais.',
    sections: [
      { title: 'Dados coletados', body: 'Coletamos apenas os dados necessarios para oferecer nossos servicos.' },
      { title: 'Seus direitos', body: 'Voce pode solicitar acesso, correcao ou exclusao dos seus dados.' },
    ],
  },
  politicaTransparencia: {
    eyebrow: 'Politicas legais',
    title: 'Politica de Transparencia',
    description: 'Conheca os compromissos da Movune com informacao clara e prestacao de contas.',
    sections: [
      { title: 'Informacoes publicas', body: 'Projetos, campanhas e indicadores sao apresentados de forma acessivel.' },
      { title: 'Acompanhamento', body: 'A plataforma registra atualizacoes para facilitar a verificacao do impacto.' },
    ],
  },
  termosUso: {
    eyebrow: 'Politicas legais',
    title: 'Termos de Uso',
    description: 'Leia as condicoes para utilizar os recursos e participar da comunidade Movune.',
    sections: [
      { title: 'Uso da plataforma', body: 'Use a Movune de forma legal, respeitosa e com informacoes verdadeiras.' },
      { title: 'Responsabilidades', body: 'Cada usuario e responsavel pelas informacoes e interacoes que publicar.' },
    ],
  },
} satisfies Record<string, PageContent>;