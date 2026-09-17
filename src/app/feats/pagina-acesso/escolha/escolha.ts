import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChoiceDialogService } from './choice-dialog.service';

@Component({
  selector: 'app-escolha',
  imports: [RouterLink],
  templateUrl: './escolha.html',
  styleUrl: './escolha.css',
})
export class Escolha implements AfterViewInit {
  @Input() modal = false;
  @ViewChild('dialogTitle') private dialogTitle?: ElementRef<HTMLElement>;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(ChoiceDialogService);

  get queryParams(): Record<string, string> {
    const email = this.modal ? this.dialog.email() : this.route.snapshot.queryParamMap.get('email');
    return email ? { email } : {};
  }

  ngAfterViewInit(): void {
    this.dialogTitle?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  close(): void {
    if (this.modal) this.dialog.close();
    else void this.router.navigate(['/']);
  }
}
