import { PetsService } from './shared/services/pets.service';
import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoPageAction, PoTableColumn, PoNotificationService, PoPageModule, PoTagModule, PoTableModule } from '@po-ui/ng-components';
import { Pets } from './shared/interfaces/pets.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoTagModule,
    PoTableModule
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent implements OnInit {

  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormPet.bind(this) }
  ]

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/'},
      { label: 'Pets' }
    ]
  }

  columns: Array<PoTableColumn> = []
  pets: Pets = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  isLoading: boolean = false;
  hasNextPage: boolean = false;
  page: number = 1;
  textRemainingRecords: string = '';
  totalPets: number = 0;

  constructor(
    private petsService: PetsService,
    private poNotificationService: PoNotificationService,
    private router: Router
  ){
    this.setColumns();
  }

  ngOnInit(): void {
    this.getPets(1,10);
  }

  goToFormPet(): void {
    this.router.navigate(['pets/new'])
  }

  setColumns(): void {
    this.columns = [
      { property: 'id', label: 'Código', type: 'link', action: (row: string) => this.goToFormEdit(row) },
      { property: 'name', label: 'Nome' },
      { property: 'breed', label: 'Raça' },
      { property: 'color', label: 'Cor' },
      { property: 'sexo', label: 'Sexo', type: 'label', labels: [{value:'F', label:'Fêmea', color:'color-07'}, {value:'M', label:'Macho', color:'color-01'}]},
      { property: 'specie', label: 'Espécie' },
      { property: 'ownerName', label: 'Tutor' }
    ]
  }

  goToFormEdit(id:string):void{
    this.router.navigate(['pets/edit', id])
  }


  getPets(page:number, pageSize:number): void{
    this.isLoading = true;
    this.petsService.get(page,pageSize).subscribe({
      next: (pets: Pets) => this.onGetSuccess(pets),
      error: (error: any) => { this.poNotificationService.error('Falha ao retornar tutores.'); this.isLoading = false }
    })
  }

  onGetSuccess(pets:Pets): void {
    if (this.pets.items.length === 0){
      this.pets.items = pets.items;
    } else {
      this.pets.items = this.pets.items.concat(pets.items);
    }

    this.isLoading = false;
    this.hasNextPage = pets.hasNext;
    this.totalPets = this.pets.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalPets} de ${this.totalPets+pets.remainingRecords}`
  }

  showMoreItems(): void{
    this.page += 1;
    this.getPets(this.page,10);
  }
}
