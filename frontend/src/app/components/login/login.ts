import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  auth = inject(AuthService);
  ts = inject(TranslationService);
  router = inject(Router);

  // Form State
  username = signal('');
  password = signal('');

  // UI State
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (!this.username() || !this.password()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.auth.login({
      username: this.username(),
      password: this.password()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage.set(err.error?.message || 'Invalid username or password');
        this.isSubmitting.set(false);
      }
    });
  }
}
