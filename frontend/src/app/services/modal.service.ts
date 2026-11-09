import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isContactModalOpen = signal(false);

  openContactModal() {
    this.isContactModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeContactModal() {
    this.isContactModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }
}
