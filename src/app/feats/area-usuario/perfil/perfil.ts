import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';

type PostId = 'volunteering' | 'donation' | 'skill';

@Component({
  selector: 'app-perfil',
  imports: [Footer, Header, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  readonly lazyPlaceholder =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="728" height="340" viewBox="0 0 728 340"%3E%3Crect width="728" height="340" fill="%23f1f5f9"/%3E%3C/svg%3E';

  readonly tabs = ['Timeline', 'Projetos', 'Doações', 'Certificados'];
  readonly causeOptions = [
    'Educação Infantil',
    'Meio Ambiente',
    'Inclusão Digital',
    'Saúde Comunitária',
    'Alimentação Solidária',
  ];

  activeTab = 'Timeline';
  composerExpanded = false;
  composerText = '';
  causeMenuOpen = false;
  selectedCause = '';
  selectedMediaName = '';

  readonly supportCounts: Record<PostId, number> = {
    volunteering: 24,
    donation: 18,
    skill: 31,
  };

  readonly comments: Record<PostId, string[]> = {
    volunteering: ['Que projeto bonito!', 'A biblioteca ficou muito acolhedora.'],
    donation: ['Também vou apoiar essa campanha.'],
    skill: ['Essa habilidade vai ajudar muita gente.'],
  };

  readonly commentDrafts: Record<PostId, string> = {
    volunteering: '',
    donation: '',
    skill: '',
  };

  private readonly supportedPosts = new Set<PostId>();
  private readonly openedComments = new Set<PostId>();

  constructor() {
    afterNextRender(() => this.setupLazyImages());
  }

  expandComposer(): void {
    this.composerExpanded = true;
    setTimeout(() => {
      const textarea = this.element.nativeElement.querySelector<HTMLTextAreaElement>('textarea');
      textarea?.focus();
      if (textarea) this.resizeTextarea(textarea);
    });
  }

  collapseComposer(): void {
    this.composerExpanded = false;
    this.composerText = '';
    this.selectedCause = '';
    this.selectedMediaName = '';
  }

  onComposerInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.composerText = textarea.value;
    this.resizeTextarea(textarea);
  }

  publishPost(): void {
    if (!this.composerText.trim() && !this.selectedCause && !this.selectedMediaName) {
      return;
    }

    this.collapseComposer();
  }

  handleMediaSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMediaName = input.files?.[0]?.name || '';
    if (this.selectedMediaName) this.expandComposer();
  }

  selectCause(cause: string): void {
    this.selectedCause = cause;
    this.causeMenuOpen = false;
    this.expandComposer();
  }

  toggleSupport(post: PostId): void {
    if (this.supportedPosts.has(post)) {
      this.supportedPosts.delete(post);
      this.supportCounts[post] -= 1;
      return;
    }

    this.supportedPosts.add(post);
    this.supportCounts[post] += 1;
  }

  isSupported(post: PostId): boolean {
    return this.supportedPosts.has(post);
  }

  toggleComments(post: PostId): void {
    if (this.openedComments.has(post)) {
      this.openedComments.delete(post);
      return;
    }

    this.openedComments.add(post);
  }

  isCommentsOpen(post: PostId): boolean {
    return this.openedComments.has(post);
  }

  updateCommentDraft(post: PostId, event: Event): void {
    this.commentDrafts[post] = (event.target as HTMLInputElement).value;
  }

  submitComment(post: PostId): void {
    const text = this.commentDrafts[post].trim();
    if (!text) return;

    this.comments[post] = [...this.comments[post], text];
    this.commentDrafts[post] = '';
  }

  shareProfile(): void {
    const url = `${this.document.location.origin}/area-usuario/perfil`;
    const browserNavigator = globalThis.navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
      clipboard?: Pick<Clipboard, 'writeText'>;
    };
    const shareData = {
      title: 'Perfil de Voluntário na Movune',
      text: 'Veja o perfil de impacto de Voluntário na Movune.',
      url,
    };

    if (typeof browserNavigator.share === 'function') {
      void browserNavigator.share(shareData);
      return;
    }

    void browserNavigator.clipboard?.writeText(url);
  }

  private resizeTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private setupLazyImages(): void {
    const images = Array.from(
      this.element.nativeElement.querySelectorAll<HTMLImageElement>('img[data-src]'),
    );

    const load = (image: HTMLImageElement) => {
      const src = image.dataset['src'];
      if (!src) return;

      image.addEventListener('load', () => image.classList.add('is-loaded'), { once: true });
      image.src = src;
    };

    if (!('IntersectionObserver' in globalThis)) {
      images.forEach(load);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          load(entry.target as HTMLImageElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '160px 0px' },
    );

    images.forEach((image) => observer.observe(image));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
