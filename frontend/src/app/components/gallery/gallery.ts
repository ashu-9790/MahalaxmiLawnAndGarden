import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class GalleryComponent implements OnInit {
  api = inject(ApiService);
  ts = inject(TranslationService);
  
  galleryImages = signal<any[]>([]);
  selectedPhoto = signal<any | null>(null);

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });

    this.api.getGalleryImages().subscribe({
      next: (images) => {
        this.galleryImages.set(images);
      },
      error: (err) => console.error('Failed to load gallery', err)
    });
  }

  openLightbox(image: any) {
    this.selectedPhoto.set(image);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedPhoto.set(null);
    document.body.style.overflow = 'auto';
  }

  nextPhoto(event: Event) {
    event.stopPropagation();
    const images = this.galleryImages();
    const current = this.selectedPhoto();
    if (!current || images.length === 0) return;
    
    const currentIndex = images.findIndex(img => img._id === current._id);
    const nextIndex = (currentIndex + 1) % images.length;
    this.selectedPhoto.set(images[nextIndex]);
  }

  prevPhoto(event: Event) {
    event.stopPropagation();
    const images = this.galleryImages();
    const current = this.selectedPhoto();
    if (!current || images.length === 0) return;
    
    const currentIndex = images.findIndex(img => img._id === current._id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    this.selectedPhoto.set(images[prevIndex]);
  }
}
