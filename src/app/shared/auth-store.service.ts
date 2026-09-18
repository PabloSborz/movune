import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AccessProfile = 'usuario' | 'ong' | 'admin';

export interface UserRegistrationInput {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidadeEstado: string;
  interesses: string;
  habilidades: string;
  senha: string;
}

export interface OngRegistrationInput {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  email: string;
  telefone: string;
  endereco: string;
  areaAtuacao: string;
  documentos: string;
  senha: string;
  dataFundacao?: string;
  site?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cpfGestor?: string;
}

export interface MovuneUser extends UserRegistrationInput {
  id: string;
  perfil: 'usuario';
  status: 'Ativo' | 'Bloqueado';
  criadoEm: string;
  ultimoAcesso?: string;
  avatar?: string;
  notificacoes?: { email: boolean; push: boolean; sms: boolean };
}

export interface MovuneOng extends OngRegistrationInput {
  id: string;
  perfil: 'ong';
  status: 'Em analise' | 'Aprovada' | 'Suspensa';
  criadoEm: string;
  ultimoAcesso?: string;
}

export interface AuthSession {
  id: string;
  perfil: AccessProfile;
  nome: string;
  email: string;
  iniciadoEm: string;
}

export interface AuthResult {
  ok: boolean;
  message: string;
  route?: string;
}

export interface LoginInput {
  perfil: AccessProfile;
  identificador: string;
  senha: string;
}

const USERS_KEY = 'movune:usuarios';
const ONGS_KEY = 'movune:ongs';
const SESSION_KEY = 'movune:sessao';
const ADMIN_USER = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';
const DEMO_PASSWORD = '123456';
const DEMO_VOLUNTEER_EMAIL = 'voluntario@gmail.com';
const DEMO_ONG_EMAIL = 'ong@gmail.com';

// Estado de autenticação mantido no navegador para o protótipo da plataforma.
@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly users = signal<MovuneUser[]>([]);
  readonly ongs = signal<MovuneOng[]>([]);
  readonly session = signal<AuthSession | null>(null);

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.users.set(this.readArray<MovuneUser>(USERS_KEY));
      this.ongs.set(this.readArray<MovuneOng>(ONGS_KEY));
      this.session.set(this.readValue<AuthSession>(SESSION_KEY));
      this.seedDemoAccounts();
    }
  }

  private seedDemoAccounts(): void {
    // Cria contas de exemplo uma única vez, preservando alterações já salvas.
    if (!this.emailInUse(DEMO_VOLUNTEER_EMAIL)) {
      const volunteer: MovuneUser = {
        id: 'demo-voluntario',
        perfil: 'usuario',
        status: 'Ativo',
        criadoEm: new Date().toISOString(),
        nomeCompleto: 'Voluntário',
        email: DEMO_VOLUNTEER_EMAIL,
        telefone: '(99) 99999-9999',
        cidadeEstado: 'Blumenau, Santa Catarina',
        interesses: 'Educação, Saúde',
        habilidades: 'Comunicação, Design, Ensino',
        senha: DEMO_PASSWORD,
      };
      this.users.set([...this.users(), volunteer]);
      this.persist(USERS_KEY, this.users());
    }

    const previousDemo = this.users().find(user => user.id === 'demo-voluntario' && user.nomeCompleto === 'Ana Silva');
    if (previousDemo) {
      this.users.update(users => users.map(user => user.id === previousDemo.id
        ? { ...user, nomeCompleto: 'Voluntário', telefone: '(99) 99999-9999', cidadeEstado: 'Blumenau, Santa Catarina' }
        : user));
      this.persist(USERS_KEY, this.users());
    }
    const activeSession = this.session();
    if (activeSession?.id === 'demo-voluntario' && activeSession.nome === 'Ana Silva') {
      this.session.set({ ...activeSession, nome: 'Voluntário' });
      this.persist(SESSION_KEY, this.session());
    }

    if (!this.emailInUse(DEMO_ONG_EMAIL)) {
      const ong: MovuneOng = {
        id: 'demo-ong',
        perfil: 'ong',
        status: 'Aprovada',
        criadoEm: new Date().toISOString(),
        razaoSocial: 'Instituto Movune',
        nomeFantasia: 'Instituto Movune',
        cnpj: '00.000.000/0001-00',
        responsavel: 'Equipe Movune',
        email: DEMO_ONG_EMAIL,
        telefone: '(11) 98765-4321',
        endereco: 'São Paulo, SP',
        areaAtuacao: 'Educação, Saúde',
        documentos: 'Conta de demonstração',
        senha: DEMO_PASSWORD,
        cidade: 'São Paulo',
        estado: 'SP',
      };
      this.ongs.set([...this.ongs(), ong]);
      this.persist(ONGS_KEY, this.ongs());
    }
  }

  registerUser(input: UserRegistrationInput): AuthResult {
    const email = this.normalize(input.email);

    if (this.emailInUse(email)) {
      return { ok: false, message: 'Este e-mail ja esta cadastrado.' };
    }

    const user: MovuneUser = {
      ...input,
      email,
      id: this.createId('user'),
      perfil: 'usuario',
      status: 'Ativo',
      criadoEm: new Date().toISOString(),
    };

    this.users.set([...this.users(), user]);
    this.persist(USERS_KEY, this.users());
    this.startSession({
      id: user.id,
      perfil: 'usuario',
      nome: user.nomeCompleto,
      email: user.email,
      iniciadoEm: new Date().toISOString(),
    });

    return { ok: true, message: 'Usuario cadastrado com sucesso.', route: '/usuario/meu-perfil' };
  }

  registerOng(input: OngRegistrationInput): AuthResult {
    const email = this.normalize(input.email);

    if (this.emailInUse(email)) {
      return { ok: false, message: 'Este e-mail ja esta cadastrado.' };
    }

    const ong: MovuneOng = {
      ...input,
      email,
      id: this.createId('ong'),
      perfil: 'ong',
      status: 'Em analise',
      criadoEm: new Date().toISOString(),
    };

    this.ongs.set([...this.ongs(), ong]);
    this.persist(ONGS_KEY, this.ongs());
    this.startSession({
      id: ong.id,
      perfil: 'ong',
      nome: ong.nomeFantasia || ong.razaoSocial,
      email: ong.email,
      iniciadoEm: new Date().toISOString(),
    });

    return { ok: true, message: 'ONG cadastrada com sucesso.', route: '/ong/painel' };
  }

  login(input: LoginInput): AuthResult {
    if (input.perfil === 'admin') {
      return this.loginAdmin(input);
    }

    if (input.perfil === 'usuario') {
      return this.loginUser(input);
    }

    return this.loginOng(input);
  }

  logout(): void {
    this.session.set(null);

    if (this.isBrowser && globalThis.localStorage) {
      globalThis.localStorage.removeItem(SESSION_KEY);
    }
  }

  updateUserStatus(id: string, status: MovuneUser['status']): void {
    const updatedUsers = this.users().map((user) => (user.id === id ? { ...user, status } : user));

    this.users.set(updatedUsers);
    this.persist(USERS_KEY, updatedUsers);
  }

  removeUser(id: string): void {
    const updatedUsers = this.users().filter((user) => user.id !== id);

    this.users.set(updatedUsers);
    this.persist(USERS_KEY, updatedUsers);

    if (this.session()?.id === id) {
      this.logout();
    }
  }

  updateOngStatus(id: string, status: MovuneOng['status']): void {
    const updatedOngs = this.ongs().map((ong) => (ong.id === id ? { ...ong, status } : ong));

    this.ongs.set(updatedOngs);
    this.persist(ONGS_KEY, updatedOngs);
  }

  removeOng(id: string): void {
    const updatedOngs = this.ongs().filter((ong) => ong.id !== id);

    this.ongs.set(updatedOngs);
    this.persist(ONGS_KEY, updatedOngs);

    if (this.session()?.id === id) {
      this.logout();
    }
  }

  updatePassword(emailValue: string, senha: string): AuthResult {
    const email = this.normalize(emailValue);
    const user = this.users().find((item) => item.email === email);

    if (user) {
      const updatedUsers = this.users().map((item) =>
        item.id === user.id ? { ...item, senha } : item,
      );

      this.users.set(updatedUsers);
      this.persist(USERS_KEY, updatedUsers);

      return { ok: true, message: 'Senha de usuario atualizada com sucesso.', route: '/login' };
    }

    const ong = this.ongs().find((item) => item.email === email);

    if (ong) {
      const updatedOngs = this.ongs().map((item) =>
        item.id === ong.id ? { ...item, senha } : item,
      );

      this.ongs.set(updatedOngs);
      this.persist(ONGS_KEY, updatedOngs);

      return { ok: true, message: 'Senha da ONG atualizada com sucesso.', route: '/login' };
    }

    return { ok: false, message: 'Nenhuma conta foi encontrada com este e-mail.' };
  }

  updateUserProfile(
    id: string,
    changes: Pick<
      MovuneUser,
      | 'nomeCompleto'
      | 'email'
      | 'telefone'
      | 'cidadeEstado'
      | 'interesses'
      | 'habilidades'
      | 'avatar'
      | 'notificacoes'
    >,
  ): AuthResult {
    const user = this.users().find((item) => item.id === id);
    if (!user) return { ok: false, message: 'Usuário não encontrado.' };
    const email = this.normalize(changes.email);
    if (
      this.users().some((item) => item.id !== id && item.email === email) ||
      this.ongs().some((item) => item.email === email)
    ) {
      return { ok: false, message: 'Este e-mail já está cadastrado.' };
    }
    const updated = this.users().map((item) =>
      item.id === id ? { ...item, ...changes, email } : item,
    );
    this.users.set(updated);
    this.persist(USERS_KEY, updated);
    const session = this.session();
    if (session?.id === id) {
      const nextSession = { ...session, nome: changes.nomeCompleto, email };
      this.session.set(nextSession);
      this.persist(SESSION_KEY, nextSession);
    }
    return { ok: true, message: 'Alterações salvas com sucesso!' };
  }

  private loginAdmin(input: LoginInput): AuthResult {
    const usuario = input.identificador.trim().toLowerCase();

    if (usuario === ADMIN_USER && input.senha === ADMIN_PASSWORD) {
      this.startSession({
        id: 'admin',
        perfil: 'admin',
        nome: 'Administrador',
        email: ADMIN_USER,
        iniciadoEm: new Date().toISOString(),
      });

      return { ok: true, message: 'Login administrativo realizado.', route: '/admin/painel' };
    }

    return { ok: false, message: 'Usuario ou senha de administrador invalidos.' };
  }

  private loginUser(input: LoginInput): AuthResult {
    const email = this.normalize(input.identificador);
    const user = this.users().find((item) => item.email === email && item.senha === input.senha);

    if (!user) {
      return { ok: false, message: 'E-mail ou senha de usuario invalidos.' };
    }

    if (user.status === 'Bloqueado') {
      return { ok: false, message: 'Esta conta de usuario esta bloqueada.' };
    }

    this.touchUser(user.id);
    this.startSession({
      id: user.id,
      perfil: 'usuario',
      nome: user.nomeCompleto,
      email: user.email,
      iniciadoEm: new Date().toISOString(),
    });

    return { ok: true, message: 'Login de usuario realizado.', route: '/usuario/meu-perfil' };
  }

  private loginOng(input: LoginInput): AuthResult {
    const email = this.normalize(input.identificador);
    const ong = this.ongs().find((item) => item.email === email && item.senha === input.senha);

    if (!ong) {
      return { ok: false, message: 'E-mail ou senha de ONG invalidos.' };
    }

    if (ong.status === 'Suspensa') {
      return { ok: false, message: 'Esta ONG esta suspensa.' };
    }

    this.touchOng(ong.id);
    this.startSession({
      id: ong.id,
      perfil: 'ong',
      nome: ong.nomeFantasia || ong.razaoSocial,
      email: ong.email,
      iniciadoEm: new Date().toISOString(),
    });

    return { ok: true, message: 'Login da ONG realizado.', route: '/ong/painel' };
  }

  private touchUser(id: string): void {
    const updatedUsers = this.users().map((user) =>
      user.id === id ? { ...user, ultimoAcesso: new Date().toISOString() } : user,
    );

    this.users.set(updatedUsers);
    this.persist(USERS_KEY, updatedUsers);
  }

  private touchOng(id: string): void {
    const updatedOngs = this.ongs().map((ong) =>
      ong.id === id ? { ...ong, ultimoAcesso: new Date().toISOString() } : ong,
    );

    this.ongs.set(updatedOngs);
    this.persist(ONGS_KEY, updatedOngs);
  }

  private startSession(session: AuthSession): void {
    this.session.set(session);
    this.persist(SESSION_KEY, session);
  }

  private emailInUse(email: string): boolean {
    return (
      this.users().some((user) => user.email === email) ||
      this.ongs().some((ong) => ong.email === email)
    );
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private createId(prefix: string): string {
    const randomValue =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${prefix}-${randomValue}`;
  }

  private readArray<T>(key: string): T[] {
    const value = this.readValue<T[]>(key);

    return Array.isArray(value) ? value : [];
  }

  private readValue<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    const rawValue = globalThis.localStorage?.getItem(key);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      // Dados antigos ou corrompidos não devem impedir a abertura da aplicação.
      return null;
    }
  }

  private persist<T>(key: string, value: T): void {
    if (!this.isBrowser || !globalThis.localStorage) {
      return;
    }

    globalThis.localStorage.setItem(key, JSON.stringify(value));
  }
}
