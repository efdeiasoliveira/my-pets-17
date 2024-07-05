import { Routes } from '@angular/router';
import { OwnersComponent } from './owners.component';
import { OwnersFormComponent } from './owners-form/owners-form.component';

export const ownersRoutes: Routes = [
  { path: '', component: OwnersComponent },
  { path: 'new', component: OwnersFormComponent},
  { path: 'edit/:id', component: OwnersFormComponent}
];
