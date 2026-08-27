import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';

@Directive({
  selector: 'input[appDisableAutofill]',
})
export class DisableAutofillDirective implements OnInit {
  private readonly element = inject(ElementRef<HTMLInputElement>).nativeElement;
  private locked = true;

  ngOnInit(): void {
    this.element.readOnly = true;
    this.element.autocomplete = this.element.type === 'password' ? 'new-password' : 'off';
    this.element.setAttribute('data-1p-ignore', 'true');
    this.element.setAttribute('data-lpignore', 'true');
  }

  @HostListener('pointerdown')
  @HostListener('focus')
  enableManualInput(): void {
    if (!this.locked) {
      return;
    }

    this.locked = false;
    this.element.value = '';
    this.element.readOnly = false;
    this.element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
