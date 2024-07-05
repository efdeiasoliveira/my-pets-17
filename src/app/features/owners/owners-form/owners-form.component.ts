import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoContainerModule, PoDialogService, PoDividerModule, PoFieldModule, PoLoadingModule, PoNotificationService, PoPageEditLiterals, PoPageModule } from '@po-ui/ng-components';
import { OwnersService } from '../shared/services/owners.service';
import { OwnerForm } from '../shared/interfaces/owner-form.model';
import { Owner } from '../shared/interfaces/owner.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owners-form',
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
  templateUrl: './owners-form.component.html',
  styleUrl: './owners-form.component.css'
})
export class OwnersFormComponent {


  ownersForm: FormGroup;

  breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', link: '/'},
      { label: 'Tutores', link: '/owners' },
      { label: 'Novo Registro' }
    ]
  }

  isSave: boolean;
  isLoading: boolean;
  isDisableButton: boolean;
  ownersSubscription: any;
  operation: string = 'post';
  title: string = 'Novo Registro'
  customLiterals: PoPageEditLiterals
   = {
    saveNew: 'Salvar e Novo'
  }

  constructor(private router: Router,
              private ownersService: OwnersService,
              private poNotificationService: PoNotificationService,
              private activatedRoute: ActivatedRoute,
              private poDialogService: PoDialogService
            ){
    this.operation = 'post';
    this.title = 'Novo Registro'
    this.isLoading = false;
    this.isDisableButton = false;
    this.isSave = false;
    this.ownersForm = this.createForm();
  }

  ngOnInit(): void {
    this.setOperation();
    this.setTitle();
    if ( this.operation === 'put'){
      this.getOwner();
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
    return new FormGroup<OwnerForm>({
      id: new FormControl('', {nonNullable: true}),
      name: new FormControl('', {nonNullable: true}),
      rg: new FormControl('', {nonNullable: true}),
      cpf: new FormControl('', {nonNullable: true}),
      email: new FormControl('', {nonNullable: true}),
      tel1: new FormControl('', {nonNullable: true}),
      tel2: new FormControl('', {nonNullable: true})
    })
  }

  cancel(): void {
    if ( this.isSave ){
      this.ownersSubscription.unsubscribe();
      this.isSave = false;
    }
    this.router.navigate(['owners'])
  }

  save(isSaveAndNew: boolean): void {
    this.isLoading = true;
    this.isDisableButton = true;
    this.isSave = true;

    if (this.operation === 'post'){
      this.ownersSubscription = this.ownersService.post(this.ownersForm.value).subscribe({
        next: response => this.onSaveSuccess(response, isSaveAndNew),
        error: error => this.onSaveError(error)
      })
    } else if (this.operation === 'put'){
      this.ownersSubscription = this.ownersService.put(this.ownersForm.value).subscribe({
        next: response => this.onSaveSuccess(response, isSaveAndNew),
        error: error => this.onSaveError(error)
      })
    }
  }

  onSaveSuccess(response: Owner, isSaveAndNew: boolean): void{
    this.isLoading = false;
    this.isDisableButton = false;

    isSaveAndNew ? this.ownersForm.reset() : this.router.navigate(['owners'])
    this.poNotificationService.success(`Registro ${ this.operation === 'post' ? 'incluído' : 'alterado' } com sucesso: ${ response.id }`)
  }

  onSaveError(error: any): void{
    this.isLoading = false;
    this.isDisableButton = false;
    this.poNotificationService.error(`Falha ao salvar o registro`)
  }

  getOwner(): void{
    this.isLoading = true;
    this.ownersService.getById(this.activatedRoute.snapshot.params['id']).subscribe({
      next: owner => this.onGetSuccess(owner),
      error: error => this.onGetError(error)
    })
  }

  onGetSuccess(owner: Owner): void {
    this.isLoading = false;
    this.ownersForm.setValue({
      id: owner.id,
      name: owner.name,
      rg: owner.rg,
      cpf: owner.cpf,
      email: owner.email,
      tel1: owner.tel1,
      tel2: owner.tel2

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
    this.ownersService.delete(this.activatedRoute.snapshot.params['id']).subscribe({
      next: (response: any) => this.onDeleteSuccess(),
      error: () => this.onDeleteError()
    })
  }

  onDeleteSuccess(): void {
    this.isLoading = false;
    this.isDisableButton = false;
    this.router.navigate([ 'owners'])
    this.poNotificationService.success('Registro excluído com sucesso...')
  }

  onDeleteError(): void{
    this.isLoading = false;
    this.isDisableButton = false;
    this.poNotificationService.error('Falha ao excluir o registro')
  }
}
