import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="logo">
            <img 
              src="logo.png" 
              alt="MLG Logo" 
              class="brand-logo-img" 
              width="48" 
              height="48"
              style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; object-fit: contain; border-radius: 50%; display: block;">
            <span class="logo-text">{{ ts.t().title }}</span>
          </a>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            @if (auth.isLoggedInSignal()) {
              <button (click)="logout()" class="nav-pill logout-pill" title="Logout">
                Logout
              </button>
            }
            <button class="mobile-toggle" (click)="toggleMenu()">
              @if (isMobileMenuOpen()) {
                <span class="close-icon">&times;</span>
              } @else {
                <span class="nav-pill menu-pill">
                  <span class="hamburger-lines">🌱</span>
                  <span class="pill-text">{{ ts.t().nav_menu }}</span>
                </span>
              }
            </button>
          </div>
        </div>
        
        <div class="nav-overlay" [class.nav-active]="isMobileMenuOpen()">
          <nav class="nav-links">
            <a routerLink="/" class="nav-link" (click)="closeMenu()">{{ ts.t().nav_home }}</a>
            <a routerLink="/" fragment="services" class="nav-link" (click)="closeMenu()">{{ ts.t().nav_services }}</a>
            <a routerLink="/gallery" class="nav-link" (click)="closeMenu()">{{ ts.t().nav_gallery }}</a>
            <a (click)="modalService.openContactModal(); closeMenu()" class="nav-link">{{ ts.t().nav_contact }}</a>
            
            @if (auth.isLoggedInSignal()) {
              <a routerLink="/admin" class="nav-link admin-btn" (click)="closeMenu()">{{ ts.t().nav_admin }}</a>
              <button (click)="logout(); closeMenu()" class="logout-btn">Logout</button>
            }
            
            <button class="lang-toggle" (click)="ts.toggleLanguage(); closeMenu()">
              🌐 {{ ts.currentLang() === 'mr' ? 'English' : 'मराठी' }}
            </button>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background-color: var(--color-bg-navbar);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-family: var(--font-heading);
      font-weight: 800;
      color: var(--color-primary-dark);
      font-size: 1.4rem;
      transition: transform 0.2s ease;
    }
    .logo:hover {
      transform: scale(1.02);
    }
    .logo-text {
      line-height: 1.2;
    }
    .brand-logo-img {
      height: 46px;
      width: 46px;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid var(--color-primary);
      box-shadow: 0 4px 12px rgba(132, 184, 104, 0.25);
    }
    .logo-icon {
      font-size: 1.8rem;
    }
    @media (max-width: 768px) {
      .logo {
        font-size: 1.05rem;
        gap: 0.3rem;
      }
      .brand-logo-img {
        height: 36px;
        width: 36px;
      }
      .logo-icon {
        font-size: 1.4rem;
      }
    }
    .nav-brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 2000;
    }
    .mobile-toggle {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
    }
    .nav-pill {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.35rem 0.7rem;
      border-radius: 20px;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      border: none;
    }
    .menu-pill {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
      animation: pulse 2s infinite;
    }
    .logout-pill {
      background: white;
      color: var(--color-error);
      border: 1px solid var(--color-error);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(230, 57, 70, 0.1);
    }
    .logout-pill:hover {
      background: var(--color-error-light);
    }
    .hamburger-lines { font-size: 1.1rem; }
    .close-icon {
      font-size: 2.5rem;
      color: var(--color-primary-dark);
      line-height: 1;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(132, 184, 104, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(132, 184, 104, 0); }
      100% { box-shadow: 0 0 0 0 rgba(132, 184, 104, 0); }
    }
    
    /* Full Screen Mobile Overlay */
    .nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(248, 250, 245, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1500;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      transform: translateY(-20px);
    }
    .nav-overlay.nav-active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
    }
    .nav-link {
      text-decoration: none;
      color: var(--color-primary-dark);
      font-weight: 700;
      font-size: 1.5rem;
      font-family: var(--font-heading);
      transition: all 0.3s;
      cursor: pointer;
    }
    .nav-link:hover {
      color: var(--color-primary);
    }
    .admin-btn {
      color: var(--color-secondary-dark);
      border-bottom: 2px solid var(--color-secondary);
      padding-bottom: 2px;
    }
    .login-btn {
      font-size: 0.9rem;
      padding: 0.4rem 0.9rem;
      border: 1px solid var(--color-border);
      border-radius: 20px;
      background: white;
      transition: all 0.3s ease;
    }
    .login-btn:hover {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary);
      color: var(--color-primary-dark);
    }
    .logout-btn {
      background: none;
      border: 1px solid var(--color-error);
      color: var(--color-error);
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .logout-btn:hover {
      background-color: var(--color-error-light);
    }
    .lang-toggle {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: 0.5rem 1.1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: 0 4px 6px rgba(45, 106, 79, 0.2);
      transition: all 0.3s ease;
    }
    .lang-toggle:hover {
      background-color: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 6px 12px rgba(45, 106, 79, 0.3);
    }
    @media (min-width: 768px) {
      .nav-container {
        flex-direction: row;
        gap: 0;
        padding: 0.8rem 2rem;
      }
      .nav-brand {
        width: auto;
      }
      .mobile-toggle, .logout-pill {
        display: none;
      }
      .nav-overlay {
        position: static;
        width: auto;
        height: auto;
        background: none;
        backdrop-filter: none;
        opacity: 1;
        visibility: visible;
        transform: none;
        display: block;
      }
      .nav-links {
        flex-direction: row;
        gap: 1.5rem;
      }
      .nav-link {
        font-size: 0.95rem;
        color: var(--color-text-muted);
        font-weight: 600;
      }
      .nav-link:hover {
        color: var(--color-primary);
      }
    }
  `]
})
export class HeaderComponent {
  ts = inject(TranslationService);
  auth = inject(AuthService);
  router = inject(Router);
  modalService = inject(ModalService);
  
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
  
  closeMenu() {
    this.isMobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
