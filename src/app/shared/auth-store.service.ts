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
}

export interface MovuneUser extends UserRegistrationInput {
  id: string;
  perfil: 'usuario';
  status: 'Ativo' | 'Bloqueado';
  criadoEm: string;
  ultimoAcesso?: string;
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
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '09876';

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

  private loginAdmin(input: LoginInput): AuthResult {
    const usuario = input.identificador.trim().toLowerCase();

    if (usuario === ADMIN_USER && input.senha === ADMIN_PASSWORD) {
      this.startSession({
        id: 'admin',
        perfil: 'admin',
        nome: 'Administrador',
        email: 'admin@movune.local',
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
