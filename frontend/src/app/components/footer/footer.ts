import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <img src="logo.png" alt="MLG Logo" class="footer-logo-img" width="46" height="46" style="width: 46px; height: 46px; object-fit: contain; border-radius: 50%; border: 2px solid var(--color-primary);">
            <h3 class="logo-text">{{ ts.t().title }}</h3>
          </div>
          <p class="brand-desc">{{ ts.t().cta_sub }}</p>
        </div>
        <div class="footer-contact">
          <h4>{{ ts.t().cta_contact }}</h4>
          <p class="owner-name">👤 {{ ts.t().owner_name }}</p>
          <a [href]="'tel:' + ts.t().phone_raw" class="phone-link">
            📞 {{ ts.t().phone }}
          </a>
        </div>
        <div class="footer-note">
          <p>{{ ts.t().bottom_note_1 }}</p>
          <p class="tagline">{{ ts.t().bottom_note_2 }}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-flex">
          <p>&copy; {{ currentYear }} {{ ts.t().title }}. All Rights Reserved.</p>
          <p>Designed with ❤️ for Nature Lovers</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-bg-dark);
      color: #e2ede5;
      padding: 4rem 0 0 0;
      border-top: 4px solid var(--color-secondary);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-bottom: 3rem;
      text-align: center;
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .logo h3 {
      color: white;
      font-size: 1.5rem;
    }
    .brand-desc {
      color: #a3c4bc;
      font-size: 0.95rem;
      max-width: 100%;
    }
    .footer-contact h4, .footer-note h4 {
      color: var(--color-secondary);
      margin-bottom: 1rem;
      font-size: 1.1rem;
      font-family: var(--font-heading);
    }
    .owner-name {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .phone-link {
      display: inline-block;
      text-decoration: none;
      color: white;
      font-weight: 700;
      font-size: 1.25rem;
      background-color: rgba(212, 175, 55, 0.15);
      border: 1px solid var(--color-secondary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      margin-top: 0.5rem;
      transition: all 0.3s ease;
    }
    .phone-link:hover {
      background-color: var(--color-secondary);
      color: var(--color-bg-dark);
      transform: translateY(-2px);
    }
    .footer-note p {
      font-size: 0.95rem;
      margin-bottom: 0.8rem;
      color: #d8f3dc;
    }
    .footer-note .tagline {
      font-style: italic;
      color: #a3c4bc;
      font-size: 0.85rem;
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1.5rem 0;
      font-size: 0.85rem;
      color: #7da198;
    }
    .footer-bottom-flex {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }
    @media (min-width: 900px) {
      .footer-grid {
        grid-template-columns: 1.5fr 1fr 1.5fr;
        gap: 3rem;
        text-align: left;
      }
      .logo {
        justify-content: flex-start;
      }
      .brand-desc {
        max-width: 320px;
      }
      .footer-bottom-flex {
        flex-direction: row;
        gap: 0;
        text-align: left;
      }
    }
  `]
})
export class FooterComponent {
  ts = inject(TranslationService);
  currentYear = new Date().getFullYear();
}
