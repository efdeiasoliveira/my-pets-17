import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'index.html', pathMatch: 'full' },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeComponent},
  { path: 'owners', loadChildren: () => import('./features/owners/owners.routes').then(m => m.ownersRoutes) }
];
