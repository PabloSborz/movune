import { Component, signal } from '@angular/core';

import { UserAreaShell } from '../../../components/user-area-shell/user-area-shell';

interface Certificate {
  title: string;
  date: string;
  code?: string;
}

@Component({
  selector: 'app-certificado',
  imports: [UserAreaShell],
  templateUrl: './certificado.html',
  styleUrl: './certificado.css',
})
export class Certificado {
  readonly available = signal<Certificate[]>([
    { title: 'Mentoria de carreira — 40h', date: '20/Set/2026', code: 'MV-832F-927A' },
    { title: 'Workshop de primeiros socorros — 8h', date: '12/Ago/2026', code: 'MV-119D-428B' },
  ]);
  readonly pending = signal<Certificate[]>([
    { title: 'Mutirão de arrecadação — 8h', date: '25/Out/2026' },
  ]);
  readonly toast = signal('');

  download(certificate: Certificate): void {
    this.toast.set(`Download do certificado iniciado (simulação): ${certificate.title}.`);
  }
}
