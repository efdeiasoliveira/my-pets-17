import { OwnersService } from './shared/services/owners.service';
import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoPageAction, PoTableColumn, PoNotificationService, PoPageModule, PoTagModule, PoTableModule } from '@po-ui/ng-components';
import { Owners } from './shared/interfaces/owners.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoTagModule,
    PoTableModule
  ],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export class OwnersComponent implements OnInit {

  actions: Array<PoPageAction> = [
    { label: 'Novo', action: this.goToFormOwner.bind(this) }
  ]

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/'},
      { label: 'Tutores' }
    ]
  }

  columns: Array<PoTableColumn> = []
  owners: Owners = {
    items: [],
    hasNext: false,
    remainingRecords: 0
  }

  isLoading: boolean = false;
  hasNextPage: boolean = false;
  page: number = 1;
  textRemainingRecords: string = '';
  totalOwners: number = 0;

  constructor(
    private ownersService: OwnersService,
    private poNotificationService: PoNotificationService,
    private router: Router
  ){
    this.setColumns();
  }

  ngOnInit(): void {
    this.getOwners(1,10);
  }

  goToFormOwner(): void {
    this.router.navigate(['owners/new'])
  }

  setColumns(): void {
    this.columns = [
      { property: 'id', label: 'Código', type: 'link', action: (row: string) => this.goToFormEdit(row) },
      { property: 'name', label: 'Nome' },
      { property: 'rg', label: 'RG', visible: false },
      { property: 'cpf', label: 'CPF' },
      { property: 'email', label: 'E-Mail' },
      { property: 'tel1', label: 'Telefone 1' },
      { property: 'tel2', label: 'Telefone 2', visible: false },
      { property: 'pets', label: 'Pets', type: 'icon', icons: [
        { value: 'view-pet', icon: 'po-icon-eye', tooltip: 'Visualizar Pets' },
        { value: 'include-pet', icon: 'po-icon-plus-circle', tooltip: 'Incluir Pets'}
      ] }
    ]
  }

  goToFormEdit(id:string):void{
    this.router.navigate(['owners/edit', id])
  }


  getOwners(page:number, pageSize:number): void{
    this.isLoading = true;
    this.ownersService.get(page,pageSize).subscribe({
      next: (owners: Owners) => this.onGetSuccess(owners),
      error: (error: any) => { this.poNotificationService.error('Falha ao retornar tutores.'); this.isLoading = false }
    })
  }

  onGetSuccess(owners:Owners): void {
    if (this.owners.items.length === 0){
      this.owners.items = owners.items;
    } else {
      this.owners.items = this.owners.items.concat(owners.items);
    }

    this.isLoading = false;
    this.hasNextPage = owners.hasNext;
    this.totalOwners = this.owners.items.length;
    this.textRemainingRecords = `Mostrando ${this.totalOwners} de ${this.totalOwners+owners.remainingRecords}`
  }

  showMoreItems(): void{
    this.page += 1;
    this.getOwners(this.page,10);
  }
}
