import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { AdminComponent } from './components/admin/admin';
import { GalleryComponent } from './components/gallery/gallery';
import { LaunchComponent } from './components/launch/launch';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'launch', component: LaunchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'gallery', component: GalleryComponent },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
