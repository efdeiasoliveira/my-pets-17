import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoContainerModule, PoDialogService, PoDividerModule, PoFieldModule, PoLoadingModule, PoNotificationService, PoPageEditLiterals, PoPageModule } from '@po-ui/ng-components';
import { PetsService } from '../shared/services/pets.service';
import { PetForm } from '../shared/interfaces/pet-form.model';
import { Pet } from '../shared/interfaces/pet.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets-form',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoLoadingModule,
    PoContainerModule,
    PoDividerModule,
    PoFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pets-form.component.html',
  styleUrl: './pets-form.component.css'
})
export class PetsFormComponent {


  petsForm: FormGroup;

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/'},
      { label: 'Pets', link: '/pets' },
      { label: 'Novo Registro' }
    ]
  }

  isSave: boolean;
  isLoading: boolean;
  isDisableButton: boolean;
  petsSubscription: any;
  operation: string = 'post';
  title: string = 'Novo Registro'
  customLiterals: PoPageEditLiterals
   = {
    saveNew: 'Salvar e Novo'
  }

  constructor(private router: Router,
              private petsService: PetsService,
              private poNotificationService: PoNotificationService,
              private activatedRoute: ActivatedRoute,
              private poDialogService: PoDialogService
            ){
    this.operation = 'post';
    this.title = 'Novo Registro'
    this.isLoading = false;
    this.isDisableButton = false;
    this.isSave = false;
    this.petsForm = this.createForm();
  }

  ngOnInit(): void {
    this.setOperation();
    this.setTitle();
    if ( this.operation === 'put'){
      this.getPet();
    }
  }

  setOperation(): void {
    this.operation = this.activatedRoute.snapshot.params['id'] ? 'put' : 'post';
  }

  setTitle(): void {
    if ( this.operation === 'put' ){
      this.title = 'Alterar Registro'
      this.customLiterals.saveNew = 'Excluir'
    } else {
      this.title = 'Novo Registro'
      this.customLiterals.saveNew = 'Salvar e Novo'
    }
    this.breadcrumb.items[2].label = this.title;
  }

  createForm(): FormGroup{
    return new FormGroup<PetForm>({
      id: new FormControl('', {nonNullable: true}),
      name: new FormControl('', {nonNullable: true}),
      breed: new FormControl('', {nonNullable: true}),
      color: new FormControl('', {nonNullable: true}),
      sexo: new FormControl('', {nonNullable: true}),
      specie: new FormControl('', {nonNullable: true}),
      ownerId: new FormControl('', {nonNullable: true}),
      ownerName: new FormControl('', {nonNullable: true})
    })
  }

  cancel(): void {
    if ( this.isSave ){
      this.petsSubscription.unsubscribe();
      this.isSave = false;
    }
    this.router.navigate(['pets'])
  }

  save(isSaveAndNew: boolean): void {
    this.isLoading = true;
    this.isDisableButton = true;
    this.isSave = true;

    if (this.operation === 'post'){
      this.petsSubscription = this.petsService.post(this.petsForm.value).subscribe({
        next: response => this.onSaveSuccess(response, isSaveAndNew),
        error: error => this.onSaveError(error)
      })
    } else if (this.operation === 'put'){
      this.petsSubscription = this.petsService.put(this.petsForm.value).subscribe({
        next: response => this.onSaveSuccess(response, isSaveAndNew),
        error: error => this.onSaveError(error)
      })
    }
  }

  onSaveSuccess(response: Pet, isSaveAndNew: boolean): void{
    this.isLoading = false;
    this.isDisableButton = false;

    isSaveAndNew ? this.petsForm.reset() : this.router.navigate(['pets'])
    this.poNotificationService.success(`Registro ${ this.operation === 'post' ? 'incluído' : 'alterado' } com sucesso: ${ response.id }`)
  }

  onSaveError(error: any): void{
    this.isLoading = false;
    this.isDisableButton = false;
    this.poNotificationService.error(`Falha ao salvar o registro`)
  }

  getPet(): void{
    this.isLoading = true;
    this.petsService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: pet => this.onGetSuccess(pet),
      error: error => this.onGetError(error)
    })
  }

  onGetSuccess(pet: Pet): void {
    this.isLoading = false;
    this.petsForm.setValue({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      color: pet.color,
      sexo: pet.sexo,
      specie: pet.specie,
      ownerId: pet.ownerId,
      ownerName: pet.ownerName
    });
  }

  onGetError(error:any): void{
    this.isLoading = false;
    this.poNotificationService.error('Falha ao retornar o registro')
  }

  saveOrDelete(): void{
    if ( this.operation === 'post') {
      this.save(true)
    } else {
      this.confirmDelete()
    }
  }

  confirmDelete(): void {
    this.poDialogService.confirm({
      title: 'Excluir tutor',
      message: "Tem certeza que deseja excluir?",
      confirm: this.delete.bind(this)
    })
  }

  delete(): void {
    this.isLoading = true;
    this.isDisableButton = true;
    this.petsService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (response: any) => this.onDeleteSuccess(),
      error: () => this.onDeleteError()
    })
  }

  onDeleteSuccess(): void {
    this.isLoading = false;
    this.isDisableButton = false;
    this.router.navigate([ 'pets'])
    this.poNotificationService.success('Registro excluído com sucesso...')
  }

  onDeleteError(): void{
    this.isLoading = false;
    this.isDisableButton = false;
    this.poNotificationService.error('Falha ao excluir o registro')
  }
}
