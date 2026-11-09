import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(NgToastService);

  // UI State
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  activeTab = signal<'stats' | 'inquiries' | 'transformations' | 'single-photos' | 'site-settings'>('stats');

  // Stats State
  totalVisits = signal(0);
  todayVisits = signal(0);

  // Settings State
  youtubeUrl = signal('');
  isSavingSettings = signal(false);

  // Inquiry State
  inquiries = signal<any[]>([]);
  totalCount = signal(0);
  pendingCount = signal(0);
  reviewedCount = signal(0);
  contactedCount = signal(0);

  // Gallery State
  galleryImages = signal<any[]>([]);
  transformations = computed(() => this.galleryImages().filter(img => img.type === 'transformation'));
  singlePhotos = computed(() => this.galleryImages().filter(img => img.type === 'single'));
  
  beforeFile = signal<File | null>(null);
  afterFile = signal<File | null>(null);
  singlePhotoFile = signal<File | null>(null);
  uploadTitle = signal('');
  isUploading = signal(false);

  ngOnInit() {
    if (!this.auth.isLoggedInSignal()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchStats();
    this.fetchInquiries();
    this.fetchGallery();
    this.fetchSettings();
  }

  // --- Tab Navigation ---
  setTab(tab: 'stats' | 'inquiries' | 'transformations' | 'single-photos' | 'site-settings') {
    this.activeTab.set(tab);
    if (tab === 'stats' && this.totalVisits() === 0) {
      this.fetchStats();
    } else if (tab === 'inquiries' && this.inquiries().length === 0) {
      this.fetchInquiries();
    } else if ((tab === 'transformations' || tab === 'single-photos') && this.galleryImages().length === 0) {
      this.fetchGallery();
    } else if (tab === 'site-settings' && !this.youtubeUrl()) {
      this.fetchSettings();
    }
  }

  // --- Stats Logic ---
  fetchStats() {
    this.api.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.totalVisits.set(res.data.totalVisits);
          this.todayVisits.set(res.data.todayVisits);
        }
      },
      error: (err) => console.error('Failed to fetch stats:', err)
    });
  }

  // --- Inquiry Logic ---
  fetchInquiries() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.api.getInquiries().subscribe({
      next: (data) => {
        this.inquiries.set(data);
        this.calculateStats(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load inquiries:', err);
        this.errorMessage.set('Failed to load inquiries.');
        this.isLoading.set(false);
      }
    });
  }

  calculateStats(data: any[]) {
    this.totalCount.set(data.length);
    this.pendingCount.set(data.filter(i => i.status === 'Pending').length);
    this.reviewedCount.set(data.filter(i => i.status === 'Reviewed').length);
    this.contactedCount.set(data.filter(i => i.status === 'Contacted').length);
  }

  updateStatus(id: string, status: string) {
    this.api.updateInquiryStatus(id, status).subscribe({
      next: (updatedInquiry) => {
        this.inquiries.update(list => 
          list.map(item => item._id === id ? { ...item, status: updatedInquiry.status } : item)
        );
        this.calculateStats(this.inquiries());
        this.toast.success('Status updated successfully', 'Success', 3000);
      },
      error: (err) => {
        console.error('Failed to update inquiry status:', err);
        this.toast.danger('Failed to update status', 'Error', 3000);
      }
    });
  }

  deleteInquiry(id: string) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    this.api.deleteInquiry(id).subscribe({
      next: () => {
        this.inquiries.update(items => items.filter(i => i._id !== id));
        this.calculateStats(this.inquiries());
        this.toast.success('Inquiry deleted successfully', 'Success', 3000);
      },
      error: (err) => {
        this.toast.danger('Failed to delete inquiry', 'Error', 3000);
      }
    });
  }

  // --- Gallery Logic ---
  fetchGallery() {
    this.isLoading.set(true);
    this.api.getGalleryImages().subscribe({
      next: (data) => {
        this.galleryImages.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch gallery:', err);
        this.isLoading.set(false);
      }
    });
  }

  onBeforeFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.beforeFile.set(file);
  }

  onAfterFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.afterFile.set(file);
  }

  onSinglePhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.singlePhotoFile.set(file);
  }

  updateUploadTitle(event: any) {
    this.uploadTitle.set(event.target.value);
  }

  uploadTransformation(beforeInput: any, afterInput: any) {
    const before = this.beforeFile();
    const after = this.afterFile();
    if (!before || !after) return;

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('type', 'transformation');
    formData.append('beforeImage', before);
    formData.append('afterImage', after);
    formData.append('title', this.uploadTitle());

    this.api.uploadGalleryImage(formData).subscribe({
      next: (newImage) => {
        this.galleryImages.update(images => [newImage, ...images]);
        this.isUploading.set(false);
        this.beforeFile.set(null);
        this.afterFile.set(null);
        this.uploadTitle.set('');
        if (beforeInput) beforeInput.value = '';
        if (afterInput) afterInput.value = '';
        this.toast.success('Transformation uploaded successfully', 'Success', 3000);
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading.set(false);
        this.toast.danger(err.error?.msg || 'Upload failed', 'Error', 3000);
      }
    });
  }

  uploadSinglePhoto(singleInput: any) {
    const file = this.singlePhotoFile();
    if (!file) return;

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('type', 'single');
    formData.append('afterImage', file);
    formData.append('title', this.uploadTitle());

    this.api.uploadGalleryImage(formData).subscribe({
      next: (newImage) => {
        this.galleryImages.update(images => [newImage, ...images]);
        this.isUploading.set(false);
        this.singlePhotoFile.set(null);
        this.uploadTitle.set('');
        if (singleInput) singleInput.value = '';
        this.toast.success('Photo uploaded successfully', 'Success', 3000);
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading.set(false);
        this.toast.danger(err.error?.msg || 'Upload failed', 'Error', 3000);
      }
    });
  }

  deleteGalleryImage(id: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    this.api.deleteGalleryImage(id).subscribe({
      next: () => {
        this.galleryImages.update(images => images.filter(img => img._id !== id));
        this.toast.success('Image deleted', 'Success', 3000);
      },
      error: (err) => {
        console.error('Failed to delete image:', err);
        this.toast.danger('Failed to delete image', 'Error', 3000);
      }
    });
  }

  // --- Settings Logic ---
  fetchSettings() {
    this.api.getSettings().subscribe({
      next: (settings) => {
        if (settings.youtubeUrl) {
          this.youtubeUrl.set(settings.youtubeUrl);
        }
      },
      error: (err) => console.error('Failed to load settings:', err)
    });
  }

  saveSettings() {
    this.isSavingSettings.set(true);
    this.api.updateSetting('youtubeUrl', this.youtubeUrl()).subscribe({
      next: () => {
        this.isSavingSettings.set(false);
        this.toast.success('Settings saved successfully', 'Success', 3000);
      },
      error: (err) => {
        console.error('Failed to save settings:', err);
        this.isSavingSettings.set(false);
        this.toast.danger('Failed to save settings', 'Error', 3000);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
