import { Routes } from '@angular/router';
import { PetsComponent } from './pets.component';
import { PetsFormComponent } from './pets-form/pets-form.component';

export const petsRoutes: Routes = [
  { path: '', component: PetsComponent },
  { path: 'new', component: PetsFormComponent},
  { path: 'edit/:id', component: PetsFormComponent}
];
