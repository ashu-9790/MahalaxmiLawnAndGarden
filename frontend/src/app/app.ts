import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { ContactModalComponent } from './components/contact-modal/contact-modal';
import { ModalService } from './services/modal.service';
import { ApiService } from './services/api.service';
import { NgToastModule } from 'ng-angular-popup';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgToastModule, ContactModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  modalService = inject(ModalService);
  router = inject(Router);
  api = inject(ApiService);
  
  ngOnInit() {
    // Record page visit once per session
    if (!sessionStorage.getItem('visitRecorded')) {
      this.api.recordVisit().subscribe({
        next: () => sessionStorage.setItem('visitRecorded', 'true'),
        error: (err) => console.error('Failed to record visit', err)
      });
    }

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }
}
