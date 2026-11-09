import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { ModalService } from '../../services/modal.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.css'
})
export class ContactModalComponent {
  ts = inject(TranslationService);
  api = inject(ApiService);
  modalService = inject(ModalService);
  toast = inject(NgToastService);

  // Form State
  name = signal('');
  phone = signal('');
  email = signal('');
  serviceType = signal('');
  message = signal('');
  isSubmitting = signal(false);
  isDropdownOpen = signal(false);

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
        
        this.modalService.closeContactModal();
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
}
