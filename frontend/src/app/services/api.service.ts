import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // --- Inquiry Endpoints ---
  submitInquiry(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/inquiries`, data);
  }

  getInquiries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inquiries`, { headers: this.getHeaders() });
  }

  updateInquiryStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/inquiries/${id}`, { status }, { headers: this.getHeaders() });
  }

  deleteInquiry(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/inquiries/${id}`, { headers: this.getHeaders() });
  }

  // --- Gallery Endpoints ---
  getGalleryImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/gallery`);
  }

  uploadGalleryImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return this.http.post(`${this.baseUrl}/gallery`, formData, { headers });
  }

  deleteGalleryImage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/gallery/${id}`, { headers: this.getHeaders() });
  }

  // --- Settings Endpoints ---
  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/settings`);
  }

  updateSetting(key: string, value: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/settings/${key}`, { value }, { headers: this.getHeaders() });
  }

  // --- Stats Endpoints ---
  recordVisit(): Observable<any> {
    return this.http.post(`${this.baseUrl}/stats/visit`, {});
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`, { headers: this.getHeaders() });
  }
}
