import { Component, inject, signal, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { ModalService } from '../../services/modal.service';
import { NgToastService } from 'ng-angular-popup';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  ts = inject(TranslationService);
  api = inject(ApiService);
  toast = inject(NgToastService);
  sanitizer = inject(DomSanitizer);
  modalService = inject(ModalService);

  // Form State
  name = signal('');
  phone = signal('');
  email = signal('');
  serviceType = signal('Lawn Maintenance');
  message = signal('');
  isSubmitting = signal(false);
  isDropdownOpen = signal(false);

  // Gallery State
  galleryImages = signal<any[]>([]);
  transformations = computed(() => this.galleryImages().filter(img => img.type === 'transformation'));
  selectedGalleryImage = signal<any | null>(null);

  // Video State
  youtubeUrl = signal<string | null>(null);
  safeYoutubeUrl = signal<SafeResourceUrl | null>(null);
  isVideoModalOpen = signal(false);

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
    this.fetchGallery();
    this.fetchSettings();
  }

  fetchSettings() {
    this.api.getSettings().subscribe({
      next: (settings) => {
        if (settings.youtubeUrl) {
          this.youtubeUrl.set(settings.youtubeUrl);
          this.formatYoutubeUrl(settings.youtubeUrl);
        }
      },
      error: (err) => console.error('Failed to fetch settings', err)
    });
  }

  formatYoutubeUrl(url: string) {
    // Convert standard youtube link or youtu.be to embed link
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      this.safeYoutubeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    }
  }

  fetchGallery() {
    this.api.getGalleryImages().subscribe({
      next: (data) => {
        this.galleryImages.set(data);
      },
      error: (err) => {
        console.error('Failed to load gallery images', err);
      }
    });
  }

  onSubmit() {
    if (!this.name() || !this.phone() || !this.serviceType()) {
      return;
    }

    this.isSubmitting.set(true);

    this.api.submitInquiry({
      name: this.name(),
      phone: this.phone(),
      email: this.email() || undefined,
      serviceType: this.serviceType(),
      message: this.message() || undefined
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.success(this.ts.t().form_success, 'Success!', 4000);
        
        // Build WhatsApp Message
        const waNumber = '919766924949';
        const waText = `*New Website Inquiry*\n\n*Name:* ${this.name()}\n*Phone:* ${this.phone()}\n*Email:* ${this.email() || 'N/A'}\n*Service:* ${this.serviceType()}\n*Message:* ${this.message() || 'N/A'}`;
        const encodedText = encodeURIComponent(waText);
        window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
        
        // Reset form signals
        this.name.set('');
        this.phone.set('');
        this.email.set('');
        this.serviceType.set('');
        this.message.set('');
      },
      error: (err) => {
        console.error('Error submitting inquiry:', err);
        this.isSubmitting.set(false);
        this.toast.danger(this.ts.t().form_error, 'Error', 4000);
      }
    });
  }

  // --- Dropdown Methods ---
  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  selectService(service: string) {
    this.serviceType.set(service);
    this.isDropdownOpen.set(false);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  // --- Lightbox Methods ---
  openLightbox(image: any) {
    this.selectedGalleryImage.set(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeLightbox() {
    this.selectedGalleryImage.set(null);
    document.body.style.overflow = 'auto';
  }

  // --- Video Methods ---
  openVideoModal() {
    this.isVideoModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeVideoModal() {
    this.isVideoModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }
}
